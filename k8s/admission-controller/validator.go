package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strings"

	"gopkg.in/yaml.v2"
	admissionv1 "k8s.io/api/admission/v1"
	appsv1 "k8s.io/api/apps/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/runtime"
	"k8s.io/apimachinery/pkg/runtime/serializer"
)

var (
	runtimeScheme = runtime.NewScheme()
	codecs        = serializer.NewCodecFactory(runtimeScheme)
	deserializer  = codecs.UniversalDeserializer()
)

type PolicyTier struct {
	Tier         int      `yaml:"tier"`
	Environments []string `yaml:"environments"`
	Rules        struct {
		MinCodeCoverage           int  `yaml:"minCodeCoverage"`
		MaxCriticalVulnerabilities int  `yaml:"maxCriticalVulnerabilities"`
		MaxHighVulnerabilities     int  `yaml:"maxHighVulnerabilities"`
		RequiresBuildProvenance    bool `yaml:"requiresBuildProvenance"`
		RequiresSBOM               bool `yaml:"requiresSBOM"`
		RequiresSecurityScan       bool `yaml:"requiresSecurityScan"`
	} `yaml:"rules"`
}

type PolicyConfig struct {
	Tiers []PolicyTier `yaml:"tiers"`
}

func loadPolicy(filePath string) (*PolicyConfig, error) {
	data, err := ioutil.ReadFile(filePath)
	if err != nil {
		return nil, err
	}

	var config PolicyConfig
	err = yaml.Unmarshal(data, &config)
	if err != nil {
		return nil, err
	}

	return &config, nil
}

func getTierForNamespace(namespace string, config *PolicyConfig) (*PolicyTier, error) {
	var envSuffix string
	if strings.HasSuffix(namespace, "-DEV") || strings.HasSuffix(namespace, "-dev") {
		envSuffix = "DEV"
	} else if strings.HasSuffix(namespace, "-QA") || strings.HasSuffix(namespace, "-qa") {
		envSuffix = "QA"
	} else if strings.HasSuffix(namespace, "-PROD") || strings.HasSuffix(namespace, "-prod") {
		envSuffix = "PROD"
	} else if strings.HasSuffix(namespace, "-DEV-TEST") || strings.HasSuffix(namespace, "-dev-test") {
		envSuffix = "DEV-TEST"
	} else {
		envSuffix = "PROD"
	}

	for _, tier := range config.Tiers {
		for _, env := range tier.Environments {
			if env == envSuffix {
				return &tier, nil
			}
		}
	}

	return nil, fmt.Errorf("no policy tier found for namespace %s with environment %s", namespace, envSuffix)
}

func validateDeployment(deployment *appsv1.Deployment, tier *PolicyTier) (bool, string) {
	annotations := deployment.ObjectMeta.Annotations
	if annotations == nil {
		return false, "deployment is missing required governance annotations"
	}

	if coverage, exists := annotations["governance.io/code-coverage"]; exists {
		var coverageValue int
		fmt.Sscanf(coverage, "%d", &coverageValue)
		if coverageValue < tier.Rules.MinCodeCoverage {
			return false, fmt.Sprintf("code coverage %d%% is below the required minimum of %d%%", 
				coverageValue, tier.Rules.MinCodeCoverage)
		}
	} else if tier.Rules.MinCodeCoverage > 0 {
		return false, "missing code coverage annotation"
	}

	if criticalVulns, exists := annotations["governance.io/critical-vulnerabilities"]; exists {
		var vulnCount int
		fmt.Sscanf(criticalVulns, "%d", &vulnCount)
		if vulnCount > tier.Rules.MaxCriticalVulnerabilities {
			return false, fmt.Sprintf("found %d critical vulnerabilities, maximum allowed is %d", 
				vulnCount, tier.Rules.MaxCriticalVulnerabilities)
		}
	} else if tier.Rules.MaxCriticalVulnerabilities >= 0 {
		return false, "missing critical vulnerabilities annotation"
	}

	if highVulns, exists := annotations["governance.io/high-vulnerabilities"]; exists {
		var vulnCount int
		fmt.Sscanf(highVulns, "%d", &vulnCount)
		if vulnCount > tier.Rules.MaxHighVulnerabilities {
			return false, fmt.Sprintf("found %d high vulnerabilities, maximum allowed is %d", 
				vulnCount, tier.Rules.MaxHighVulnerabilities)
		}
	} else if tier.Rules.MaxHighVulnerabilities >= 0 {
		return false, "missing high vulnerabilities annotation"
	}

	if tier.Rules.RequiresBuildProvenance {
		if _, exists := annotations["governance.io/build-provenance"]; !exists {
			return false, "build provenance attestation is required but missing"
		}
	}

	if tier.Rules.RequiresSBOM {
		if _, exists := annotations["governance.io/sbom"]; !exists {
			return false, "SBOM attestation is required but missing"
		}
	}

	if tier.Rules.RequiresSecurityScan {
		if _, exists := annotations["governance.io/security-scan"]; !exists {
			return false, "security scan attestation is required but missing"
		}
	}

	return true, ""
}

func handleValidate(w http.ResponseWriter, r *http.Request) {
	var body []byte
	if r.Body != nil {
		if data, err := ioutil.ReadAll(r.Body); err == nil {
			body = data
		}
	}

	contentType := r.Header.Get("Content-Type")
	if contentType != "application/json" {
		log.Printf("Content-Type=%s, expected application/json", contentType)
		http.Error(w, "invalid Content-Type, expected application/json", http.StatusUnsupportedMediaType)
		return
	}

	policyFile := os.Getenv("POLICY_FILE")
	if policyFile == "" {
		policyFile = "/etc/governance/policy/policy.yaml"
	}
	
	policyConfig, err := loadPolicy(policyFile)
	if err != nil {
		log.Printf("Error loading policy: %v", err)
		http.Error(w, fmt.Sprintf("error loading policy: %v", err), http.StatusInternalServerError)
		return
	}

	var admissionReview admissionv1.AdmissionReview
	if _, _, err := deserializer.Decode(body, nil, &admissionReview); err != nil {
		log.Printf("Error decoding admission review: %v", err)
		http.Error(w, fmt.Sprintf("could not decode body: %v", err), http.StatusBadRequest)
		return
	}

	admissionResponse := &admissionv1.AdmissionResponse{
		UID: admissionReview.Request.UID,
	}

	var deployment appsv1.Deployment
	err = json.Unmarshal(admissionReview.Request.Object.Raw, &deployment)
	if err != nil {
		log.Printf("Error unmarshaling deployment: %v", err)
		admissionResponse.Allowed = false
		admissionResponse.Result = &metav1.Status{
			Message: fmt.Sprintf("error unmarshaling deployment: %v", err),
		}
	} else {
		tier, err := getTierForNamespace(admissionReview.Request.Namespace, policyConfig)
		if err != nil {
			log.Printf("Error determining policy tier: %v", err)
			admissionResponse.Allowed = false
			admissionResponse.Result = &metav1.Status{
				Message: fmt.Sprintf("error determining policy tier: %v", err),
			}
		} else {
			allowed, message := validateDeployment(&deployment, tier)
			admissionResponse.Allowed = allowed
			if !allowed {
				admissionResponse.Result = &metav1.Status{
					Message: fmt.Sprintf("policy validation failed (tier %d): %s", tier.Tier, message),
				}
			}
		}
	}

	responseAdmissionReview := admissionv1.AdmissionReview{
		TypeMeta: metav1.TypeMeta{
			Kind:       "AdmissionReview",
			APIVersion: "admission.k8s.io/v1",
		},
		Response: admissionResponse,
	}

	resp, err := json.Marshal(responseAdmissionReview)
	if err != nil {
		log.Printf("Error marshaling response: %v", err)
		http.Error(w, fmt.Sprintf("could not encode response: %v", err), http.StatusInternalServerError)
		return
	}
	
	w.Header().Set("Content-Type", "application/json")
	w.Write(resp)
}

func main() {
	http.HandleFunc("/validate", handleValidate)
	
	certFile := "/etc/webhook/certs/tls.crt"
	keyFile := "/etc/webhook/certs/tls.key"
	
	log.Printf("Starting governance policy validator server on port 8443...")
	err := http.ListenAndServeTLS(":8443", certFile, keyFile, nil)
	if err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
