import { Code, Hammer, Shield, TestTube, Package, Rocket, Monitor, CheckSquare } from 'lucide-react';

export interface AssessmentQuestion {
  id: string;
  question: string;
  description: string;
  tools?: string[];
}

export interface AssessmentPillar {
  name: string;
  description: string;
  icon: any;
  tools: string[];
  questions: AssessmentQuestion[];
}

export const assessmentData: AssessmentPillar[] = [
  {
    name: 'Code',
    description: 'Source code management, version control, and branching strategies',
    icon: Code,
    tools: ['Bitbucket', 'Git'],
    questions: [
      {
        id: 'code-001',
        question: 'Is source code stored in Bitbucket with proper version control?',
        description: 'Verify that all source code is properly versioned and stored in Bitbucket repositories with appropriate access controls.',
        tools: ['Bitbucket']
      },
      {
        id: 'code-002',
        question: 'Are branching strategies implemented (GitFlow, GitHub Flow, etc.)?',
        description: 'Check if the team follows established branching strategies for feature development, releases, and hotfixes.',
        tools: ['Bitbucket', 'Git']
      },
      {
        id: 'code-003',
        question: 'Are pull requests mandatory for code integration?',
        description: 'Ensure that all code changes go through pull request review process before merging to main branches.',
        tools: ['Bitbucket']
      },
      {
        id: 'code-004',
        question: 'Are code review policies enforced with minimum reviewer requirements?',
        description: 'Verify that code review policies require minimum number of reviewers and approval before merge.',
        tools: ['Bitbucket']
      },
      {
        id: 'code-005',
        question: 'Is automated merge conflict detection and resolution in place?',
        description: 'Check if the system can detect and handle merge conflicts automatically where possible.',
        tools: ['Bitbucket', 'Git']
      },
      {
        id: 'code-006',
        question: 'Are commit messages following standardized conventions?',
        description: 'Verify that commit messages follow a consistent format and include relevant information for tracking.',
        tools: ['Git']
      }
    ]
  },
  {
    name: 'Build',
    description: 'Automated build processes, compilation, and artifact generation',
    icon: Hammer,
    tools: ['CloudBees Jenkins', 'Artifactory'],
    questions: [
      {
        id: 'build-001',
        question: 'Is automated build triggered on code commits?',
        description: 'Verify that builds are automatically initiated when code is pushed to the repository.',
        tools: ['CloudBees Jenkins', 'Bitbucket']
      },
      {
        id: 'build-002',
        question: 'Are build artifacts stored in Artifactory?',
        description: 'Check if build artifacts are properly stored and versioned in Artifactory for distribution.',
        tools: ['Artifactory']
      },
      {
        id: 'build-003',
        question: 'Is build process consistent across all environments (dev, preprod, prod)?',
        description: 'Ensure that the same build process is used across development, pre-production, and production environments.',
        tools: ['CloudBees Jenkins']
      },
      {
        id: 'build-004',
        question: 'Are build failures immediately notified to development teams?',
        description: 'Verify that build failure notifications are sent promptly to relevant team members.',
        tools: ['CloudBees Jenkins']
      },
      {
        id: 'build-005',
        question: 'Is build history and logs retained for troubleshooting?',
        description: 'Check if build history and detailed logs are maintained for debugging and audit purposes.',
        tools: ['CloudBees Jenkins']
      },
      {
        id: 'build-006',
        question: 'Are parallel builds implemented to optimize build time?',
        description: 'Verify if builds can run in parallel to reduce overall build duration.',
        tools: ['CloudBees Jenkins']
      }
    ]
  },
  {
    name: 'Code Quality',
    description: 'Static code analysis, quality metrics, and technical debt management',
    icon: CheckSquare,
    tools: ['SonarQube'],
    questions: [
      {
        id: 'quality-001',
        question: 'Is SonarQube integrated into the build pipeline?',
        description: 'Verify that SonarQube analysis is part of the automated build process for continuous code quality monitoring.',
        tools: ['SonarQube', 'CloudBees Jenkins']
      },
      {
        id: 'quality-002',
        question: 'Are quality gates configured to prevent poor quality code deployment?',
        description: 'Check if quality gates are set up to block deployments when code quality metrics fall below thresholds.',
        tools: ['SonarQube']
      },
      {
        id: 'quality-003',
        question: 'Are code coverage thresholds enforced (minimum 80%)?',
        description: 'Verify that code coverage requirements are enforced and maintained at acceptable levels.',
        tools: ['SonarQube']
      },
      {
        id: 'quality-004',
        question: 'Is technical debt tracked and managed regularly?',
        description: 'Check if technical debt is monitored, tracked, and regularly addressed by development teams.',
        tools: ['SonarQube']
      },
      {
        id: 'quality-005',
        question: 'Are code smells and bugs automatically identified and reported?',
        description: 'Verify that code smells, bugs, and vulnerabilities are automatically detected and reported.',
        tools: ['SonarQube']
      },
      {
        id: 'quality-006',
        question: 'Are coding standards and best practices enforced?',
        description: 'Check if coding standards are defined, documented, and automatically enforced through tooling.',
        tools: ['SonarQube']
      }
    ]
  },
  {
    name: 'Security',
    description: 'Security scanning, vulnerability management, and compliance',
    icon: Shield,
    tools: ['Fortify', 'NexusIQ', 'CyberArk'],
    questions: [
      {
        id: 'security-001',
        question: 'Is Fortify SAST scanning integrated into the build pipeline?',
        description: 'Verify that Fortify Static Application Security Testing is part of the continuous integration process.',
        tools: ['Fortify', 'CloudBees Jenkins']
      },
      {
        id: 'security-002',
        question: 'Is NexusIQ scanning dependencies for vulnerabilities?',
        description: 'Check if third-party dependencies are scanned for known security vulnerabilities using NexusIQ.',
        tools: ['NexusIQ']
      },
      {
        id: 'security-003',
        question: 'Are secrets managed through CyberArk instead of hardcoded values?',
        description: 'Verify that application secrets and credentials are managed through CyberArk, not hardcoded in source code.',
        tools: ['CyberArk']
      },
      {
        id: 'security-004',
        question: 'Are security vulnerabilities tracked and remediated promptly?',
        description: 'Check if security vulnerabilities are properly tracked, prioritized, and remediated within defined SLAs.',
        tools: ['Fortify', 'NexusIQ']
      },
      {
        id: 'security-005',
        question: 'Is security scanning performed across all environments?',
        description: 'Verify that security scanning is performed consistently across development, pre-production, and production environments.',
        tools: ['Fortify', 'NexusIQ']
      },
      {
        id: 'security-006',
        question: 'Are security policies enforced to block deployments with critical vulnerabilities?',
        description: 'Check if security gates prevent deployment of applications with critical security vulnerabilities.',
        tools: ['Fortify', 'NexusIQ']
      }
    ]
  },
  {
    name: 'Testing',
    description: 'Automated testing strategies, test coverage, and quality assurance',
    icon: TestTube,
    tools: ['CloudBees Jenkins', 'JUnit', 'Selenium'],
    questions: [
      {
        id: 'testing-001',
        question: 'Are unit tests automated and integrated into the build pipeline?',
        description: 'Verify that unit tests run automatically as part of the build process with appropriate coverage.',
        tools: ['CloudBees Jenkins', 'JUnit']
      },
      {
        id: 'testing-002',
        question: 'Are integration tests performed automatically between components?',
        description: 'Check if integration testing is automated to validate interactions between different system components.',
        tools: ['CloudBees Jenkins']
      },
      {
        id: 'testing-003',
        question: 'Is automated UI testing implemented using tools like Selenium?',
        description: 'Verify that user interface testing is automated using appropriate testing frameworks.',
        tools: ['Selenium', 'CloudBees Jenkins']
      },
      {
        id: 'testing-004',
        question: 'Are performance tests automated for critical application paths?',
        description: 'Check if performance testing is automated for key user journeys and system bottlenecks.',
        tools: ['CloudBees Jenkins']
      },
      {
        id: 'testing-005',
        question: 'Is test data management automated and environment-specific?',
        description: 'Verify that test data is properly managed, anonymized, and appropriate for each testing environment.',
        tools: ['CloudBees Jenkins']
      },
      {
        id: 'testing-006',
        question: 'Are test results reported and tracked for trend analysis?',
        description: 'Check if test results are properly reported, tracked, and analyzed for quality trends.',
        tools: ['CloudBees Jenkins']
      }
    ]
  },
  {
    name: 'Package',
    description: 'Package management, dependency management, and artifact versioning',
    icon: Package,
    tools: ['Artifactory', 'Docker'],
    questions: [
      {
        id: 'package-001',
        question: 'Are application packages stored in Artifactory with proper versioning?',
        description: 'Verify that all application packages are stored in Artifactory with semantic versioning.',
        tools: ['Artifactory']
      },
      {
        id: 'package-002',
        question: 'Is Docker containerization implemented for applications?',
        description: 'Check if applications are containerized using Docker for consistent deployment across environments.',
        tools: ['Docker', 'Artifactory']
      },
      {
        id: 'package-003',
        question: 'Are base images scanned for vulnerabilities before use?',
        description: 'Verify that Docker base images are scanned for security vulnerabilities before being used.',
        tools: ['Docker', 'NexusIQ']
      },
      {
        id: 'package-004',
        question: 'Is package promotion automated between environments?',
        description: 'Check if packages are automatically promoted from development through to production environments.',
        tools: ['Artifactory', 'CloudBees Jenkins']
      },
      {
        id: 'package-005',
        question: 'Are dependency updates managed and tested automatically?',
        description: 'Verify that dependency updates are managed systematically with automated testing.',
        tools: ['Artifactory', 'NexusIQ']
      },
      {
        id: 'package-006',
        question: 'Is package integrity verified through checksums and signatures?',
        description: 'Check if package integrity is maintained through cryptographic checksums and digital signatures.',
        tools: ['Artifactory']
      }
    ]
  },
  {
    name: 'Deploy',
    description: 'Deployment automation, infrastructure as code, and release management',
    icon: Rocket,
    tools: ['Ansible', 'CloudBees Jenkins'],
    questions: [
      {
        id: 'deploy-001',
        question: 'Is deployment automated using Ansible across all environments?',
        description: 'Verify that deployments are fully automated using Ansible playbooks for all environments.',
        tools: ['Ansible', 'CloudBees Jenkins']
      },
      {
        id: 'deploy-002',
        question: 'Are infrastructure changes managed as code (Infrastructure as Code)?',
        description: 'Check if infrastructure changes are version controlled and managed through code.',
        tools: ['Ansible', 'Bitbucket']
      },
      {
        id: 'deploy-003',
        question: 'Is blue-green or canary deployment strategy implemented?',
        description: 'Verify that deployment strategies minimize downtime and risk through blue-green or canary approaches.',
        tools: ['Ansible']
      },
      {
        id: 'deploy-004',
        question: 'Are rollback procedures automated and tested?',
        description: 'Check if rollback procedures are automated and regularly tested for quick recovery.',
        tools: ['Ansible', 'CloudBees Jenkins']
      },
      {
        id: 'deploy-005',
        question: 'Is deployment approval workflow implemented for production?',
        description: 'Verify that production deployments require appropriate approvals before execution.',
        tools: ['CloudBees Jenkins']
      },
      {
        id: 'deploy-006',
        question: 'Are deployment configurations environment-specific and externalized?',
        description: 'Check if deployment configurations are externalized and specific to each environment.',
        tools: ['Ansible', 'CyberArk']
      }
    ]
  },
  {
    name: 'Monitoring',
    description: 'Application monitoring, logging, observability, and alerting',
    icon: Monitor,
    tools: ['Dynatrace', 'Opensearch'],
    questions: [
      {
        id: 'monitoring-001',
        question: 'Is Dynatrace monitoring configured for application performance?',
        description: 'Verify that Dynatrace is configured to monitor application performance, user experience, and infrastructure.',
        tools: ['Dynatrace']
      },
      {
        id: 'monitoring-002',
        question: 'Are application logs centralized in Opensearch?',
        description: 'Check if application logs are centrally collected, indexed, and searchable through Opensearch.',
        tools: ['Opensearch']
      },
      {
        id: 'monitoring-003',
        question: 'Are alerting rules configured for critical system metrics?',
        description: 'Verify that appropriate alerts are configured for critical system metrics and thresholds.',
        tools: ['Dynatrace']
      },
      {
        id: 'monitoring-004',
        question: 'Is distributed tracing implemented for microservices?',
        description: 'Check if distributed tracing is implemented to track requests across microservice architectures.',
        tools: ['Dynatrace']
      },
      {
        id: 'monitoring-005',
        question: 'Are dashboards created for real-time system visibility?',
        description: 'Verify that real-time dashboards provide visibility into system health and performance.',
        tools: ['Dynatrace', 'Opensearch']
      },
      {
        id: 'monitoring-006',
        question: 'Is log retention policy implemented for compliance and troubleshooting?',
        description: 'Check if log retention policies are defined and implemented for compliance and operational needs.',
        tools: ['Opensearch']
      }
    ]
  }
];
