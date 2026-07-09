import type { Question } from "@/lib/types";

/**
 * Original sample questions written for Cloud Quest Arcade.
 *
 * These are hand-authored practice items covering AWS Cloud Practitioner
 * (CLF-C02) themes. They are NOT reproduced from any official exam, question
 * bank, or third-party content. Explanations are paraphrased general knowledge
 * intended for learning.
 */
export const questions: Question[] = [
  {
    id: "cc-01",
    domain: "Cloud Concepts",
    difficulty: "easy",
    prompt:
      "A startup wants to avoid buying servers up front and instead pay only for the compute it actually uses. Which cloud benefit does this best describe?",
    options: [
      { id: "a", text: "Pay-as-you-go pricing" },
      { id: "b", text: "Multi-factor authentication" },
      { id: "c", text: "Vertical scaling" },
      { id: "d", text: "Data residency" },
    ],
    correctOptionId: "a",
    explanation:
      "Paying only for resources consumed, with no large up-front hardware purchase, is the pay-as-you-go (consumption-based) pricing benefit of cloud computing.",
  },
  {
    id: "cc-02",
    domain: "Cloud Concepts",
    difficulty: "easy",
    prompt:
      "Which term describes automatically adding or removing capacity so an application matches current demand?",
    options: [
      { id: "a", text: "Elasticity" },
      { id: "b", text: "Durability" },
      { id: "c", text: "Encryption" },
      { id: "d", text: "Colocation" },
    ],
    correctOptionId: "a",
    explanation:
      "Elasticity is the ability to grow or shrink resources automatically to match workload demand, avoiding both over- and under-provisioning.",
  },
  {
    id: "cc-03",
    domain: "Cloud Concepts",
    difficulty: "easy",
    prompt:
      "A company deploys its app across several isolated data-center groups in one region to survive a single facility failure. What are these isolated groups called?",
    options: [
      { id: "a", text: "Edge locations" },
      { id: "b", text: "Availability Zones" },
      { id: "c", text: "Placement groups" },
      { id: "d", text: "Subntelements" },
    ],
    correctOptionId: "b",
    explanation:
      "A Region is made up of multiple Availability Zones—physically separate groups of data centers—so spreading across AZs improves fault tolerance.",
  },
  {
    id: "cc-04",
    domain: "Cloud Concepts",
    difficulty: "medium",
    prompt:
      "Which cloud deployment model connects on-premises infrastructure with cloud resources over a private, dedicated network?",
    options: [
      { id: "a", text: "Public cloud only" },
      { id: "b", text: "Hybrid cloud" },
      { id: "c", text: "Multi-cloud" },
      { id: "d", text: "Community cloud" },
    ],
    correctOptionId: "b",
    explanation:
      "A hybrid cloud deployment links on-premises data centers with cloud services, typically via private connectivity such as AWS Direct Connect or VPN.",
  },
  {
    id: "cc-05",
    domain: "Cloud Concepts",
    difficulty: "medium",
    prompt:
      "A company wants to use AWS for disaster recovery but keep its primary data center. Which cloud adoption strategy does this describe?",
    options: [
      { id: "a", text: "Lift and shift" },
      { id: "b", text: "Hybrid" },
      { id: "c", text: "Cloud native" },
      { id: "d", text: "Single-vendor exit" },
    ],
    correctOptionId: "b",
    explanation:
      "Running an on-premises primary site alongside AWS DR resources is a hybrid adoption strategy.",
  },
  {
    id: "cc-06",
    domain: "Cloud Concepts",
    difficulty: "medium",
    prompt:
      "Which pillar of the AWS Well-Architected Framework focuses on recovering from disruptions and dynamically acquiring computing resources to meet demand?",
    options: [
      { id: "a", text: "Operational Excellence" },
      { id: "b", text: "Reliability" },
      { id: "c", text: "Security" },
      { id: "d", text: "Sustainability" },
    ],
    correctOptionId: "b",
    explanation:
      "The Reliability pillar covers the ability of a system to recover from infrastructure or service disruptions and to dynamically acquire resources to meet demand.",
  },
  {
    id: "cc-07",
    domain: "Cloud Concepts",
    difficulty: "hard",
    prompt:
      "A global retailer needs low-latency access for static images across continents and wants to minimize data transfer costs. Which combination should they use?",
    options: [
      { id: "a", text: "S3 in a single Region with Transfer Acceleration" },
      { id: "b", text: "S3 with CloudFront and Origin Access Control" },
      { id: "c", text: "EBS volumes replicated across Regions" },
      { id: "d", text: "DynamoDB global tables only" },
    ],
    correctOptionId: "b",
    explanation:
      "CloudFront caches content at edge locations near users, lowering latency and egress costs, while Origin Access Control keeps the S3 bucket private.",
  },
  {
    id: "cc-08",
    domain: "Cloud Concepts",
    difficulty: "hard",
    prompt:
      "An application needs to scale to zero when idle but still start within milliseconds on demand. Which compute model fits best?",
    options: [
      { id: "a", text: "EC2 Auto Scaling with minimum 1 instance" },
      { id: "b", text: "AWS Fargate with minimum task count" },
      { id: "c", text: "AWS Lambda" },
      { id: "d", text: "Amazon Lightsail" },
    ],
    correctOptionId: "c",
    explanation:
      "Lambda is event-driven serverless compute that scales to zero when idle and can initialize quickly enough for many on-demand workloads.",
  },
  {
    id: "cc-09",
    domain: "Cloud Concepts",
    difficulty: "medium",
    prompt:
      "Which statement best describes the AWS global infrastructure relationship between Regions, Availability Zones, and edge locations?",
    options: [
      { id: "a", text: "Regions contain Availability Zones; edge locations are separate points of presence outside Regions" },
      { id: "b", text: "Availability Zones contain Regions; edge locations store primary data" },
      { id: "c", text: "Edge locations contain Regions; Availability Zones are optional" },
      { id: "d", text: "Regions and edge locations are the same thing" },
    ],
    correctOptionId: "a",
    explanation:
      "A Region is a geographic area containing multiple Availability Zones. Edge locations are separate endpoints that cache data closer to users for lower latency.",
  },
  {
    id: "cc-10",
    domain: "Cloud Concepts",
    difficulty: "hard",
    prompt:
      "A company wants to split traffic between two Regions for disaster recovery with manual failover. Which Route 53 routing policy supports this with health checks?",
    options: [
      { id: "a", text: "Simple routing" },
      { id: "b", text: "Latency-based routing" },
      { id: "c", text: "Weighted routing" },
      { id: "d", text: "Failover routing" },
    ],
    correctOptionId: "d",
    explanation:
      "Failover routing policy directs traffic to a primary resource and switches to a secondary when the primary fails health checks, enabling active-passive disaster recovery.",
  },
  {
    id: "sec-01",
    domain: "Security and Compliance",
    difficulty: "easy",
    prompt:
      "Under the AWS shared responsibility model, who is responsible for patching the guest operating system on an EC2 instance you launched?",
    options: [
      { id: "a", text: "AWS, entirely" },
      { id: "b", text: "The customer" },
      { id: "c", text: "The internet service provider" },
      { id: "d", text: "No one; it is automatic for all services" },
    ],
    correctOptionId: "b",
    explanation:
      "AWS manages the underlying hardware and hypervisor, but for EC2 the customer is responsible for the guest OS, including patches and configuration.",
  },
  {
    id: "sec-02",
    domain: "Security and Compliance",
    difficulty: "easy",
    prompt:
      "Which practice most directly reduces risk if a user's password is stolen?",
    options: [
      { id: "a", text: "Storing the password in a spreadsheet" },
      { id: "b", text: "Enabling multi-factor authentication (MFA)" },
      { id: "c", text: "Sharing one root account with the whole team" },
      { id: "d", text: "Disabling logging to save cost" },
    ],
    correctOptionId: "b",
    explanation:
      "MFA requires a second factor beyond the password, so a stolen password alone is not enough for an attacker to sign in.",
  },
  {
    id: "sec-03",
    domain: "Security and Compliance",
    difficulty: "easy",
    prompt:
      "What is the recommended way to grant an application running on EC2 permission to read from an S3 bucket?",
    options: [
      { id: "a", text: "Hard-code access keys in the source code" },
      { id: "b", text: "Attach an IAM role to the EC2 instance" },
      { id: "c", text: "Email the credentials to the developers" },
      { id: "d", text: "Make the bucket fully public" },
    ],
    correctOptionId: "b",
    explanation:
      "IAM roles provide temporary, automatically rotated credentials to the instance, avoiding long-lived hard-coded keys.",
  },
  {
    id: "sec-04",
    domain: "Security and Compliance",
    difficulty: "medium",
    prompt:
      "Which AWS service provides centralized access management for multiple AWS accounts and applications with single sign-on?",
    options: [
      { id: "a", text: "AWS IAM" },
      { id: "b", text: "AWS IAM Identity Center" },
      { id: "c", text: "Amazon Cognito" },
      { id: "d", text: "AWS Organizations" },
    ],
    correctOptionId: "b",
    explanation:
      "IAM Identity Center (formerly AWS SSO) provides single sign-on access to AWS accounts and business applications from one place.",
  },
  {
    id: "sec-05",
    domain: "Security and Compliance",
    difficulty: "medium",
    prompt:
      "A security team wants to receive an alert when an EC2 instance is attempting to make unauthorized SSH connections. Which managed threat-detection service should they enable?",
    options: [
      { id: "a", text: "Amazon Inspector" },
      { id: "b", text: "AWS GuardDuty" },
      { id: "c", text: "AWS Shield" },
      { id: "d", text: "AWS WAF" },
    ],
    correctOptionId: "b",
    explanation:
      "Amazon GuardDuty is a threat detection service that continuously monitors for unauthorized and malicious activity using anomaly detection and threat intelligence.",
  },
  {
    id: "sec-06",
    domain: "Security and Compliance",
    difficulty: "medium",
    prompt:
      "Which service automatically evaluates resources against security best practices and generates findings for misconfigurations?",
    options: [
      { id: "a", text: "AWS Config" },
      { id: "b", text: "AWS Security Hub" },
      { id: "c", text: "Amazon Detective" },
      { id: "d", text: "AWS Audit Manager" },
    ],
    correctOptionId: "b",
    explanation:
      "AWS Security Hub aggregates findings from services like GuardDuty, Inspector, and Macie, and runs automated checks against security standards.",
  },
  {
    id: "sec-07",
    domain: "Security and Compliance",
    difficulty: "hard",
    prompt:
      "A company needs to control which API actions a developer can perform on specific DynamoDB tables, and they want the permissions to be centrally managed across accounts. Which solution should they use?",
    options: [
      { id: "a", text: "Resource-based policies on each table" },
      { id: "b", text: "IAM policies with condition keys and AWS Organizations SCPs" },
      { id: "c", text: "S3 bucket policies only" },
      { id: "d", text: "VPC NACLs" },
    ],
    correctOptionId: "b",
    explanation:
      "IAM identity-based policies grant permissions to users, while SCPs can restrict the maximum permissions across an organization. Together they provide centrally managed, account-scoped control.",
  },
  {
    id: "sec-08",
    domain: "Security and Compliance",
    difficulty: "hard",
    prompt:
      "A team needs to rotate encryption keys automatically and enforce a key policy that prevents the root user from deleting keys. Which service should they use?",
    options: [
      { id: "a", text: "AWS Secrets Manager" },
      { id: "b", text: "AWS KMS" },
      { id: "c", text: "AWS Certificate Manager" },
      { id: "d", text: "Amazon Macie" },
    ],
    correctOptionId: "b",
    explanation:
      "AWS KMS provides centralized key management, automatic rotation, and fine-grained key policies that control who can use or delete keys.",
  },
  {
    id: "sec-09",
    domain: "Security and Compliance",
    difficulty: "medium",
    prompt:
      "Which AWS service helps you assess, audit, and evaluate the configuration of AWS resources for compliance?",
    options: [
      { id: "a", text: "AWS CloudTrail" },
      { id: "b", text: "AWS Config" },
      { id: "c", text: "Amazon CloudWatch" },
      { id: "d", text: "AWS X-Ray" },
    ],
    correctOptionId: "b",
    explanation:
      "AWS Config records resource configurations and changes over time, enabling compliance auditing and change evaluation.",
  },
  {
    id: "sec-10",
    domain: "Security and Compliance",
    difficulty: "hard",
    prompt:
      "A company must demonstrate that specific security controls are operating effectively for a compliance audit. Which AWS service provides automated evidence collection for frameworks such as PCI, GDPR, and HIPAA?",
    options: [
      { id: "a", text: "AWS Artifact" },
      { id: "b", text: "AWS Audit Manager" },
      { id: "c", text: "AWS Config" },
      { id: "d", text: "Amazon GuardDuty" },
    ],
    correctOptionId: "b",
    explanation:
      "AWS Audit Manager automates evidence collection to help prove compliance with standards and regulations, reducing manual audit work.",
  },
  {
    id: "tech-01",
    domain: "Cloud Technology and Services",
    difficulty: "easy",
    prompt:
      "Which AWS service provides scalable object storage for files, backups, and static website assets?",
    options: [
      { id: "a", text: "Amazon S3" },
      { id: "b", text: "Amazon RDS" },
      { id: "c", text: "AWS Lambda" },
      { id: "d", text: "Amazon Route 53" },
    ],
    correctOptionId: "a",
    explanation:
      "Amazon S3 (Simple Storage Service) is object storage designed for durable, scalable storage of files and static assets.",
  },
  {
    id: "tech-02",
    domain: "Cloud Technology and Services",
    difficulty: "easy",
    prompt:
      "A team wants to run code in response to events without provisioning or managing servers. Which service fits best?",
    options: [
      { id: "a", text: "Amazon EC2" },
      { id: "b", text: "AWS Lambda" },
      { id: "c", text: "Amazon EBS" },
      { id: "d", text: "AWS Direct Connect" },
    ],
    correctOptionId: "b",
    explanation:
      "AWS Lambda is a serverless compute service that runs your code in response to events and scales automatically without server management.",
  },
  {
    id: "tech-03",
    domain: "Cloud Technology and Services",
    difficulty: "easy",
    prompt:
      "Which service is a managed relational database supporting engines such as PostgreSQL and MySQL?",
    options: [
      { id: "a", text: "Amazon DynamoDB" },
      { id: "b", text: "Amazon RDS" },
      { id: "c", text: "Amazon S3 Glacier" },
      { id: "d", text: "Amazon CloudFront" },
    ],
    correctOptionId: "b",
    explanation:
      "Amazon RDS is a managed relational database service that handles patching, backups, and failover for engines like PostgreSQL and MySQL.",
  },
  {
    id: "tech-04",
    domain: "Cloud Technology and Services",
    difficulty: "medium",
    prompt:
      "Which service provides a fully managed message broker for decoupling distributed systems and enabling asynchronous communication?",
    options: [
      { id: "a", text: "Amazon SQS" },
      { id: "b", text: "Amazon EventBridge" },
      { id: "c", text: "Amazon MQ" },
      { id: "d", text: "AWS Step Functions" },
    ],
    correctOptionId: "c",
    explanation:
      "Amazon MQ is a managed message broker service that supports ActiveMQ and RabbitMQ, making it easier to migrate existing message brokers to the cloud.",
  },
  {
    id: "tech-05",
    domain: "Cloud Technology and Services",
    difficulty: "medium",
    prompt:
      "A company needs to route traffic to the closest healthy endpoint across multiple Regions. Which Route 53 routing type should they use?",
    options: [
      { id: "a", text: "Simple routing" },
      { id: "b", text: "Geolocation routing" },
      { id: "c", text: "Latency-based routing" },
      { id: "d", text: "Weighted routing" },
    ],
    correctOptionId: "c",
    explanation:
      "Latency-based routing uses AWS network performance data to route users to the Region that provides the lowest latency.",
  },
  {
    id: "tech-06",
    domain: "Cloud Technology and Services",
    difficulty: "medium",
    prompt:
      "Which AWS service lets you provision and manage infrastructure as code using JSON or YAML templates?",
    options: [
      { id: "a", text: "AWS CloudFormation" },
      { id: "b", text: "AWS OpsWorks" },
      { id: "c", text: "AWS Elastic Beanstalk" },
      { id: "d", text: "Amazon CodeDeploy" },
    ],
    correctOptionId: "a",
    explanation:
      "AWS CloudFormation automates infrastructure provisioning using declarative templates, enabling repeatable and version-controlled deployments.",
  },
  {
    id: "tech-07",
    domain: "Cloud Technology and Services",
    difficulty: "hard",
    prompt:
      "A company wants to run containers on AWS without managing the underlying EC2 instances. Which two services can accomplish this?",
    options: [
      { id: "a", text: "Amazon ECS with Fargate and Amazon EKS with Fargate" },
      { id: "b", text: "Amazon EC2 and AWS Batch" },
      { id: "c", text: "AWS Lambda and Amazon Lightsail" },
      { id: "d", text: "Amazon RDS and DynamoDB" },
    ],
    correctOptionId: "a",
    explanation:
      "Both ECS and EKS support Fargate, a serverless compute engine for containers that removes the need to manage EC2 instances.",
  },
  {
    id: "tech-08",
    domain: "Cloud Technology and Services",
    difficulty: "hard",
    prompt:
      "A team needs to grant a third-party vendor temporary read-only access to an S3 bucket for exactly 12 hours without sharing credentials. What is the most secure approach?",
    options: [
      { id: "a", text: "Create an IAM user with a permanent access key and share it" },
      { id: "b", text: "Generate a presigned URL with a 12-hour expiration" },
      { id: "c", text: "Make the bucket public" },
      { id: "d", text: "Attach an IAM role to the S3 bucket" },
    ],
    correctOptionId: "b",
    explanation:
      "A presigned URL grants time-limited access to a specific object without requiring an IAM user or changing bucket policies.",
  },
  {
    id: "tech-09",
    domain: "Cloud Technology and Services",
    difficulty: "hard",
    prompt:
      "A company runs a stateless API on EC2 and wants automated replacement of unhealthy instances with zero manual intervention. Which combination should they use?",
    options: [
      { id: "a", text: "EC2 Auto Scaling with an Elastic Load Balancer and health checks" },
      { id: "b", text: "S3 event notifications" },
      { id: "c", text: "AWS Direct Connect" },
      { id: "d", text: "Route 53 alias records only" },
    ],
    correctOptionId: "a",
    explanation:
      "An Elastic Load Balancer performs health checks and Auto Scaling replaces unhealthy instances, providing automated high availability for EC2 workloads.",
  },
  {
    id: "tech-10",
    domain: "Cloud Technology and Services",
    difficulty: "medium",
    prompt:
      "Which AWS service provides a visual workflow to orchestrate serverless functions and AWS services in order?",
    options: [
      { id: "a", text: "AWS Step Functions" },
      { id: "b", text: "Amazon SWF" },
      { id: "c", text: "Amazon SNS" },
      { id: "d", text: "AWS CodePipeline" },
    ],
    correctOptionId: "a",
    explanation:
      "AWS Step Functions lets you coordinate multiple AWS services into visual workflows, making it easier to build and update serverless applications.",
  },
  {
    id: "bill-01",
    domain: "Billing, Pricing and Support",
    difficulty: "easy",
    prompt:
      "Which tool helps you visualize, understand, and forecast your AWS spending over time?",
    options: [
      { id: "a", text: "AWS Cost Explorer" },
      { id: "b", text: "Amazon Inspector" },
      { id: "c", text: "AWS Shield" },
      { id: "d", text: "Amazon Athena" },
    ],
    correctOptionId: "a",
    explanation:
      "AWS Cost Explorer lets you view and forecast usage and spending trends with graphs and filters.",
  },
  {
    id: "bill-02",
    domain: "Billing, Pricing and Support",
    difficulty: "easy",
    prompt:
      "A company commits to a consistent amount of compute usage for one to three years in exchange for a lower price. Which pricing model is this?",
    options: [
      { id: "a", text: "On-Demand" },
      { id: "b", text: "Spot Instances" },
      { id: "c", text: "Savings Plans / Reserved pricing" },
      { id: "d", text: "Free Tier" },
    ],
    correctOptionId: "c",
    explanation:
      "Committing to steady usage over 1–3 years for a discount describes Savings Plans and Reserved Instances, which trade flexibility for lower rates.",
  },
  {
    id: "bill-03",
    domain: "Billing, Pricing and Support",
    difficulty: "easy",
    prompt:
      "Which AWS Support plan tier first introduces a Technical Account Manager (TAM)?",
    options: [
      { id: "a", text: "Basic" },
      { id: "b", text: "Developer" },
      { id: "c", text: "Business" },
      { id: "d", text: "Enterprise" },
    ],
    correctOptionId: "d",
    explanation:
      "A designated Technical Account Manager is provided with the Enterprise Support plan (and Enterprise On-Ramp), not with Basic, Developer, or Business.",
  },
  {
    id: "bill-04",
    domain: "Billing, Pricing and Support",
    difficulty: "medium",
    prompt:
      "A company needs to track AWS spending against a monthly budget and receive alerts when actual or forecasted spend exceeds 80%. Which service should they configure?",
    options: [
      { id: "a", text: "AWS Cost Explorer" },
      { id: "b", text: "AWS Budgets" },
      { id: "c", text: "AWS Organizations" },
      { id: "d", text: "AWS Service Catalog" },
    ],
    correctOptionId: "b",
    explanation:
      "AWS Budgets lets you set custom budgets and receive alerts when costs or usage exceed (or are forecasted to exceed) your thresholds.",
  },
  {
    id: "bill-05",
    domain: "Billing, Pricing and Support",
    difficulty: "medium",
    prompt:
      "Which AWS tool recommends cost optimizations by identifying underutilized or idle resources?",
    options: [
      { id: "a", text: "AWS Cost Anomaly Detection" },
      { id: "b", text: "AWS Compute Optimizer" },
      { id: "c", text: "AWS Pricing Calculator" },
      { id: "d", text: "AWS Organizations" },
    ],
    correctOptionId: "b",
    explanation:
      "AWS Compute Optimizer analyzes resource configurations and utilization to recommend optimal resources for cost and performance.",
  },
  {
    id: "bill-06",
    domain: "Billing, Pricing and Support",
    difficulty: "medium",
    prompt:
      "A company has five AWS accounts and wants a consolidated bill but also wants to restrict one account from launching expensive services. Which feature enables this?",
    options: [
      { id: "a", text: "IAM users with permissions boundaries" },
      { id: "b", text: "AWS Organizations with service control policies (SCPs)" },
      { id: "c", text: "S3 bucket policies" },
      { id: "d", text: "VPC subnet route tables" },
    ],
    correctOptionId: "b",
    explanation:
      "AWS Organizations lets you consolidate billing across accounts, and SCPs define the maximum permissions available in member accounts.",
  },
  {
    id: "bill-07",
    domain: "Billing, Pricing and Support",
    difficulty: "hard",
    prompt:
      "A workload runs 24/7 with predictable, steady-state usage. Which pricing model typically delivers the lowest cost?",
    options: [
      { id: "a", text: "On-Demand" },
      { id: "b", text: "Savings Plans or Reserved Instances" },
      { id: "c", text: "Spot Instances" },
      { id: "d", text: "Dedicated Hosts" },
    ],
    correctOptionId: "b",
    explanation:
      "For steady, predictable workloads, Savings Plans and Reserved Instances offer the largest discounts compared to On-Demand pricing.",
  },
  {
    id: "bill-08",
    domain: "Billing, Pricing and Support",
    difficulty: "hard",
    prompt:
      "A company sees a sudden spike in their AWS bill for data transfer but cannot identify the source. Which service helps detect unusual spending patterns automatically?",
    options: [
      { id: "a", text: "AWS Cost Explorer" },
      { id: "b", text: "AWS Cost Anomaly Detection" },
      { id: "c", text: "AWS Trusted Advisor" },
      { id: "d", text: "AWS Pricing Calculator" },
    ],
    correctOptionId: "b",
    explanation:
      "AWS Cost Anomaly Detection uses machine learning to identify unusual spending patterns and alerts you so you can investigate quickly.",
  },
  {
    id: "bill-09",
    domain: "Billing, Pricing and Support",
    difficulty: "hard",
    prompt:
      "Which AWS Support plan provides access to the full set of Trusted Advisor checks plus 24/7 technical support by phone, chat, and email with a 1-hour response for critical issues?",
    options: [
      { id: "a", text: "Developer" },
      { id: "b", text: "Business" },
      { id: "c", text: "Enterprise" },
      { id: "d", text: "Basic" },
    ],
    correctOptionId: "b",
    explanation:
      "The Business Support plan includes full Trusted Advisor checks and 24/7 support with a 1-hour response for critical system impairments.",
  },
  {
    id: "bill-10",
    domain: "Billing, Pricing and Support",
    difficulty: "medium",
    prompt:
      "What is the primary benefit of consolidated billing in AWS Organizations?",
    options: [
      { id: "a", text: "All accounts share a single password" },
      { id: "b", text: "Combined usage across accounts can unlock volume discounts" },
      { id: "c", text: "All accounts get the same support plan automatically" },
      { id: "d", text: "Billing is limited to one payment method per account" },
    ],
    correctOptionId: "b",
    explanation:
      "Consolidated billing pools usage across linked accounts, which can help qualify for volume pricing discounts such as Savings Plans or S3 tiered pricing.",
  },
];

export default questions;
