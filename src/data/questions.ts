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
    id: "sec-01",
    domain: "Security and Compliance",
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
    id: "tech-01",
    domain: "Cloud Technology and Services",
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
    id: "bill-01",
    domain: "Billing, Pricing and Support",
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
];

export default questions;
