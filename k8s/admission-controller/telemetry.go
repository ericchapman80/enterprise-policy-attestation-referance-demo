package main

import (
	"context"
	"fmt"
	"log"
	"time"

	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/attribute"
	"go.opentelemetry.io/otel/exporters/otlp/otlptrace"
	"go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracegrpc"
	"go.opentelemetry.io/otel/sdk/resource"
	sdktrace "go.opentelemetry.io/otel/sdk/trace"
	semconv "go.opentelemetry.io/otel/semconv/v1.17.0"
	"go.opentelemetry.io/otel/trace"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

const (
	AttributeNamespace          = "namespace"
	AttributeDeploymentName     = "deployment.name"
	AttributeTier               = "policy.tier"
	AttributeEnvironment        = "environment"
	AttributeValidationResult   = "validation.result"
	AttributeValidationMessage  = "validation.message"
	AttributeCodeCoverage       = "policy.code_coverage"
	AttributeCriticalVulns      = "policy.critical_vulnerabilities"
	AttributeHighVulns          = "policy.high_vulnerabilities"
	AttributeBuildProvenance    = "policy.build_provenance"
	AttributeSBOM               = "policy.sbom"
	AttributeSecurityScan       = "policy.security_scan"
)

func InitProvider(ctx context.Context, serviceName, endpoint string) (func(context.Context) error, error) {
	res, err := resource.New(ctx,
		resource.WithAttributes(
			semconv.ServiceName(serviceName),
		),
	)
	if err != nil {
		return nil, fmt.Errorf("failed to create resource: %w", err)
	}

	ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	conn, err := grpc.DialContext(ctx, endpoint,
		grpc.WithTransportCredentials(insecure.NewCredentials()),
		grpc.WithBlock(),
	)
	if err != nil {
		return nil, fmt.Errorf("failed to create gRPC connection to collector: %w", err)
	}

	traceExporter, err := otlptrace.New(ctx, otlptracegrpc.NewClient(
		otlptracegrpc.WithGRPCConn(conn),
	))
	if err != nil {
		return nil, fmt.Errorf("failed to create trace exporter: %w", err)
	}

	bsp := sdktrace.NewBatchSpanProcessor(traceExporter)
	tracerProvider := sdktrace.NewTracerProvider(
		sdktrace.WithSampler(sdktrace.AlwaysSample()),
		sdktrace.WithResource(res),
		sdktrace.WithSpanProcessor(bsp),
	)
	otel.SetTracerProvider(tracerProvider)

	return tracerProvider.Shutdown, nil
}

const PolicyValidationEventName = "policy.validation"

func TracePolicyValidation(ctx context.Context, namespace, deploymentName string, tier int, attrs ...attribute.KeyValue) (context.Context, trace.Span) {
	tracer := otel.Tracer("governance-validator")
	ctx, span := tracer.Start(ctx, PolicyValidationEventName)
	
	baseAttrs := []attribute.KeyValue{
		attribute.String(AttributeNamespace, namespace),
		attribute.String(AttributeDeploymentName, deploymentName),
		attribute.Int(AttributeTier, tier),
	}
	
	span.SetAttributes(append(baseAttrs, attrs...)...)
	return ctx, span
}

func TraceValidationResult(span trace.Span, allowed bool, message string) {
	span.SetAttributes(
		attribute.Bool(AttributeValidationResult, allowed),
		attribute.String(AttributeValidationMessage, message),
	)
}
