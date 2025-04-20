# Commerce Product Detail Demo: Voiceover Narrative

## Introduction (30 seconds)

Welcome to our demonstration of automated governance in action. Today, we'll explore how policy as code and automated attestations can be implemented in a real-world application development workflow.

This reference implementation showcases a commerce product detail page with a modern React frontend and FastAPI backend. More importantly, it demonstrates how teams can implement governance controls that validate build provenance, security, and quality standards as they iterate toward production.

## Application Overview (1 minute)

Let's start by looking at the application itself. This is a typical e-commerce product detail page that displays:

- Product images and information
- Pricing details including sale prices
- Product variants like size and color options
- Customer reviews and ratings

While simple in appearance, this application represents the type of microservice that would be part of a larger e-commerce platform. It's an ideal candidate to demonstrate governance controls because it:

1. Has clear security requirements (handling customer data)
2. Requires quality assurance (accurate product information)
3. Needs reliable build provenance (ensuring trusted code deployment)

## Governance Challenges (1 minute)

Before we dive into the implementation, let's consider the challenges that organizations face when implementing governance:

1. **Manual Processes**: Traditional governance relies on manual reviews and approvals, creating bottlenecks
2. **Late Detection**: Issues are often discovered late in the development cycle, leading to costly rework
3. **Inconsistent Enforcement**: Manual processes lead to inconsistent policy application
4. **Limited Visibility**: Lack of clear evidence for compliance and audit purposes
5. **Developer Friction**: Governance is often seen as slowing down development

Our reference implementation addresses these challenges through automated governance.

## Automated Governance Implementation (3 minutes)

Let's examine how we've implemented automated governance in this application:

### 1. Build Provenance Validation

We use GitHub's sigstore integration to create and verify artifact attestations. This ensures that all artifacts are built from trusted sources with a verifiable build history.

[SHOW BUILD PROVENANCE WORKFLOW]

This workflow:
- Generates cryptographic signatures for build artifacts
- Records the build environment and parameters
- Validates that builds come from trusted internal sources
- Creates attestations that can be verified later in the pipeline

### 2. Security Scanning

We've integrated Snyk to scan dependencies and container images for vulnerabilities:

[SHOW SECURITY SCANNING WORKFLOW]

Our policy prevents merges when critical vulnerabilities are detected, ensuring that security issues are addressed early in the development cycle.

### 3. Code Coverage Requirements

We enforce 80% code coverage for new code using Jest for the frontend and pytest for the backend:

[SHOW CODE COVERAGE WORKFLOW]

This ensures that new features and changes are adequately tested, maintaining code quality as the application evolves.

### 4. Functional Testing Evidence

We use Playwright to validate critical user flows and generate evidence of testing:

[SHOW FUNCTIONAL TESTING WORKFLOW]

These tests verify that the application works as expected from the user's perspective, complementing our unit tests.

## Demonstration of Governance in Action (2 minutes)

Now, let's see these governance controls in action by making a change to our application:

[DEMONSTRATE MAKING A CHANGE THAT TRIGGERS GOVERNANCE CHECKS]

1. We'll add a new feature to display product recommendations
2. Submit a pull request to trigger our governance workflows
3. Observe how the workflows validate our change
4. Address any issues that arise
5. Complete the merge once all checks pass

## Benefits and Outcomes (1 minute)

By implementing automated governance in this reference application, we've demonstrated:

1. **Reduced Manual Reviews**: Automated checks replace time-consuming manual reviews
2. **Faster Feedback Cycles**: Developers receive immediate feedback on compliance issues
3. **Consistent Policy Enforcement**: Policies are applied uniformly across all changes
4. **Auditable Compliance**: Clear evidence of compliance for audit purposes
5. **Improved Security Posture**: Early detection of security vulnerabilities

## Conclusion and Next Steps (30 seconds)

This reference implementation provides a starting point for implementing automated governance in your own applications. By adopting these practices, you can:

1. Accelerate delivery while maintaining governance requirements
2. Create a balance between speed and compliance
3. Improve security and quality across your application portfolio

We encourage you to explore the code repository, adapt these patterns to your own needs, and start implementing automated governance in your development workflows.

Thank you for joining us for this demonstration. Are there any questions?
