# DevOps and DevSecOps Assessment Portal

A comprehensive assessment platform for evaluating DevOps and DevSecOps practices across eight key pillars with integrated toolchain support.

## Features

- **Eight-Pillar Assessment Framework**
  - Code (Source code management with Bitbucket)
  - Build (Automated builds with CloudBees Jenkins)
  - Code Quality (Static analysis with SonarQube)
  - Security (SAST with Fortify, SCA with NexusIQ, secrets with CyberArk)
  - Testing (Automated testing integration)
  - Package (Artifact management with Artifactory)
  - Deploy (Infrastructure automation with Ansible)
  - Monitoring (Observability with Dynatrace, logging with Opensearch)

- **Comprehensive Assessment**
  - Yes/No questionnaire responses
  - Evidence file attachment for each question
  - Multi-environment support (dev, preprod, prod)
  - Progress tracking and scoring
  - Assessment history and trending

- **Enterprise-Ready**
  - OpenShift deployment support
  - Argo CD GitOps integration
  - Kubernetes manifests
  - Helm charts
  - Security best practices

## Getting Started

### Prerequisites

- Node.js 18+
- Docker (for containerization)
- OpenShift cluster (for production deployment)
- Argo CD (for GitOps deployment)

### Local Development

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd devops-assessment-portal
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start development server
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Building for Production

1. Build the application
   ```bash
   npm run build
   ```

2. Preview production build
   ```bash
   npm run preview
   ```

## Deployment

### Docker Deployment

1. Build Docker image
   ```bash
   docker build -t devops-assessment-portal:latest .
   ```

2. Run container
   ```bash
   docker run -p 3000:3000 devops-assessment-portal:latest
   ```

### OpenShift Deployment

1. Create project
   ```bash
   oc new-project devops-assessment-portal
   ```

2. Apply manifests
   ```bash
   oc apply -f deployment/kubernetes/
   ```

### Argo CD Deployment

1. Apply Argo CD application
   ```bash
   kubectl apply -f deployment/argocd/application.yaml
   ```

2. Sync the application
   ```bash
   argocd app sync devops-assessment-portal
   ```

### Helm Deployment

1. Install with Helm
   ```bash
   helm install devops-assessment-portal ./deployment/helm/
   ```

## Assessment Pillars

### 1. Code
- Bitbucket integration for source code management
- Version control best practices
- Branching strategies (GitFlow, GitHub Flow)
- Pull request workflows
- Code review policies

### 2. Build
- CloudBees Jenkins automation
- Artifact storage in Artifactory
- Consistent build processes
- Build failure notifications
- Parallel build optimization

### 3. Code Quality
- SonarQube integration
- Quality gates enforcement
- Code coverage thresholds (80%+)
- Technical debt management
- Coding standards enforcement

### 4. Security
- Fortify SAST scanning
- NexusIQ SCA dependency scanning
- CyberArk secrets management
- Vulnerability tracking and remediation
- Security policy enforcement

### 5. Testing
- Unit test automation
- Integration testing
- UI testing with Selenium
- Performance testing
- Test data management

### 6. Package
- Artifactory package management
- Docker containerization
- Vulnerability scanning of base images
- Package promotion automation
- Dependency management

### 7. Deploy
- Ansible automation
- Infrastructure as Code
- Blue-green/canary deployment
- Automated rollback procedures
- Environment-specific configurations

### 8. Monitoring
- Dynatrace application performance monitoring
- Opensearch centralized logging
- Alerting and notification rules
- Distributed tracing
- Real-time dashboards

## API Integration

The portal integrates with the following tools:

- **Bitbucket**: Source code repository management
- **Artifactory**: Binary repository management
- **SonarQube**: Code quality analysis
- **Fortify**: Static application security testing
- **NexusIQ**: Software composition analysis
- **CloudBees Jenkins**: Continuous integration/delivery
- **CyberArk**: Secrets and privileged access management
- **Ansible**: Infrastructure automation
- **Dynatrace**: Application performance monitoring
- **Opensearch**: Search and analytics engine

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Security

This application follows security best practices:

- Container security with non-root user
- Network policies for traffic restriction
- Secrets management externalization
- Security context enforcement
- Regular security scanning

## License

NA

## Support

For support and questions, please contact the DevOps team at devops@company.com.
