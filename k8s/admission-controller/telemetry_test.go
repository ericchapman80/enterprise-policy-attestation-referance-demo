package main

import (
	"context"
	"testing"

	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/attribute"
	"go.opentelemetry.io/otel/sdk/trace"
	"go.opentelemetry.io/otel/sdk/trace/tracetest"
)

func TestTracePolicyValidation(t *testing.T) {
	spanRecorder := tracetest.NewSpanRecorder()
	provider := trace.NewTracerProvider(trace.WithSpanProcessor(spanRecorder))
	
	oldProvider := otel.GetTracerProvider()
	otel.SetTracerProvider(provider)
	defer otel.SetTracerProvider(oldProvider)
	
	ctx := context.Background()
	namespace := "test-namespace-DEV"
	deploymentName := "test-deployment"
	tierLevel := 2
	
	ctx, span := TracePolicyValidation(ctx, namespace, deploymentName, tierLevel)
	TraceValidationResult(span, false, "test validation message")
	span.End()
	
	spans := spanRecorder.Ended()
	if len(spans) != 1 {
		t.Fatalf("Expected 1 span, got %d", len(spans))
	}
	
	recordedSpan := spans[0]
	
	if recordedSpan.Name() != PolicyValidationEventName {
		t.Errorf("Expected span name %s, got %s", PolicyValidationEventName, recordedSpan.Name())
	}
	
	attrs := recordedSpan.Attributes()
	expectedAttrs := []attribute.KeyValue{
		attribute.String(AttributeNamespace, namespace),
		attribute.String(AttributeDeploymentName, deploymentName),
		attribute.Int(AttributeTier, tierLevel),
		attribute.Bool(AttributeValidationResult, false),
		attribute.String(AttributeValidationMessage, "test validation message"),
	}
	
	for _, expected := range expectedAttrs {
		found := false
		for _, attr := range attrs {
			if attr.Key == expected.Key {
				if attr.Value.AsString() == expected.Value.AsString() {
					found = true
					break
				}
			}
		}
		if !found {
			t.Errorf("Expected attribute %s with value %s not found", expected.Key, expected.Value.AsString())
		}
	}
}

func TestInitProvider(t *testing.T) {
	ctx := context.Background()
	
	shutdown, err := InitProvider(ctx, "test-service", "non-existent-endpoint:4317")
	
	if err == nil {
		t.Error("Expected error when connecting to non-existent endpoint, but got nil")
		if shutdown != nil {
			shutdown(ctx)
		}
	}
}
