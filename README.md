# Commerce Product Detail Demo: Automated Governance Reference Implementation

This reference implementation demonstrates policy as code and automated attestations for a micro front-end commerce application. It showcases how teams can implement governance controls that validate build provenance, security, and quality standards as they iterate toward production.

## Purpose and Value

This project serves as a practical example of how development teams can:

1. **Implement Policy as Code**: Enforce organizational standards automatically through code rather than manual processes
2. **Validate Build Provenance**: Ensure artifacts are built from trusted sources with verifiable build history
3. **Maintain Security Standards**: Prevent deployment of components with critical vulnerabilities
4. **Enforce Quality Controls**: Maintain code coverage thresholds and functional testing requirements

By implementing these controls, organizations can accelerate delivery while maintaining governance requirements, creating a balance between speed and compliance.

## Features

- **React Frontend with TypeScript**: Modern, type-safe UI implementation
- **FastAPI Backend with Mock Data**: Lightweight API with realistic product data
- **Product Detail Page**: Mimics a real-world e-commerce experience
- **Build Provenance Validation**: Using GitHub's sigstore for artifact attestations
- **Security Scanning**: Snyk integration to detect and prevent critical vulnerabilities
- **Code Coverage Enforcement**: 80% code coverage requirement for new code
- **Functional Testing**: Evidence of end-to-end testing for critical user flows

## Architecture

The application follows a microservice architecture pattern:

```
┌─────────────────┐      ┌─────────────────┐
│                 │      │                 │
│  React Frontend │◄────►│ FastAPI Backend │
│                 │      │                 │
└─────────────────┘      └─────────────────┘
        │                        │
        │                        │
        ▼                        ▼
┌───────────────────────────────────┐
│                                   │
│      GitHub Actions Workflows     │
│                                   │
│  ┌─────────┐ ┌────────┐ ┌─────┐  │
│  │ Build   │ │Security│ │Tests│  │
│  │ Checks  │ │ Scans  │ │     │  │
│  └─────────┘ └────────┘ └─────┘  │
│                                   │
└───────────────────────────────────┘
```

## Project Structure

- `/frontend` - React frontend application with TypeScript
  - `/frontend-app` - Main frontend application code
    - `/src` - Source code
      - `/components` - Reusable UI components
      - `/pages` - Page components
      - `/api` - API client code
      - `/lib` - Utility functions
- `/backend` - FastAPI backend API
  - `/backend-api` - Main backend application code
    - `/app` - Application code
      - `main.py` - Entry point
      - `models.py` - Data models
      - `database.py` - Mock database implementation
    - `/tests` - Test files
- `/.github/workflows` - GitHub Actions workflows for CI/CD and governance

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js 18+
- Python 3.10+
- Poetry (Python dependency management)
- Git

### Running Locally

```bash
# Clone the repository
git clone <repository-url>
cd commerce-demo

# Start the application with Docker Compose
docker-compose up
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

### Development Environment Setup

#### Frontend Development

```bash
# Navigate to frontend directory
cd frontend/frontend-app

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm run test

# Check test coverage
npm run test:coverage
```

#### Backend Development

```bash
# Navigate to backend directory
cd backend/backend-api

# Install dependencies
poetry install

# Start development server
poetry run uvicorn app.main:app --reload

# Run tests
poetry run pytest

# Check test coverage
poetry run pytest --cov=app
```

## Automated Governance Implementation

This project demonstrates automated governance using GitHub Actions with the following key components:

### 1. Build Provenance Validation

We use GitHub's sigstore integration to create and verify artifact attestations, ensuring that all artifacts are built from trusted sources.

```yaml
- name: Generate attestation
  uses: actions/attest-build-provenance@v1
  with:
    subject-path: ./artifact.tar
```

The build provenance attestation includes:
- Source code repository information
- Build environment details
- Timestamps and build parameters
- Cryptographic signatures

### 2. Security Scanning

Snyk integration scans dependencies and container images for vulnerabilities:

```yaml
- name: Run Snyk to check for vulnerabilities
  uses: snyk/actions/node@master
  with:
    args: --severity-threshold=critical
  env:
    SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
```

Policy enforcement prevents merges when critical vulnerabilities are detected.

### 3. Code Coverage Requirements

Jest and pytest configurations enforce 80% code coverage for new code:

```yaml
- name: Check code coverage
  run: |
    npm run test:coverage
    if [[ $(jq '.total.lines.pct' coverage/coverage-summary.json) -lt 80 ]]; then
      echo "Code coverage below 80%"
      exit 1
    fi
```

### 4. Functional Testing Evidence

Playwright tests validate critical user flows and generate evidence of testing:

```yaml
- name: Run functional tests
  run: npx playwright test
  
- name: Upload test results
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: playwright-report/
```

The `/e2e-tests` directory contains comprehensive end-to-end tests that cover:

- **Product Listing Page**: Tests for displaying products, filtering, and navigation
- **Product Detail Page**: Tests for viewing details, selecting variants, and adding to cart
- **API Integration**: Tests for backend API endpoints and data validation

These tests provide evidence of functional testing and verify the interaction between frontend and backend components. Screenshots are captured during test execution as additional evidence.

## Benefits and Outcomes

Implementing automated governance in this reference application demonstrates:

1. **Reduced Manual Reviews**: Automated checks replace time-consuming manual reviews
2. **Faster Feedback Cycles**: Developers receive immediate feedback on compliance issues
3. **Consistent Policy Enforcement**: Policies are applied uniformly across all changes
4. **Auditable Compliance**: Clear evidence of compliance for audit purposes
5. **Improved Security Posture**: Early detection of security vulnerabilities

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
