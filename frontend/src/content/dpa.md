# Data Processing Agreement (DPA)

**Effective Date: September 22, 2026**

This Data Processing Agreement ("**DPA**") supplements and forms an integral part of the RefineIQ Terms of Service ("**Principal Agreement**") entered into by and between:

1. **RefineIQ** ("**Data Processor**" or "**Vendor**"); and
2. The legal entity or individual agreeing to these terms ("**Customer**" or "**Data Controller**").

This DPA applies whenever and to the extent RefineIQ processes Personal Data on behalf of Customer in the course of providing the RefineIQ automated machine learning and data transformation services ("**Services**").

---

## 1. Definitions

1.1. **"Applicable Data Protection Law"** means all global laws and regulations applicable to the processing of Personal Data, including:
- The **General Data Protection Regulation (EU) 2016/679** ("**GDPR**");
- The **UK Data Protection Act 2018** and **UK GDPR**;
- The **Zambia Data Protection Act No. 3 of 2021** ("**ZDPA**");
- The **California Consumer Privacy Act** as amended by the CPRA ("**CCPA**"); and
- Any applicable regional or national privacy laws.

1.2. **"Customer Data"** means any electronic data, datasets, spreadsheets, or records submitted or uploaded to the Services by Customer or its authorized users.

1.3. **"Personal Data"**, **"Data Subject"**, **"Processing"**, **"Controller"**, **"Processor"**, and **"Supervisory Authority"** shall have the meanings attributed to them under Applicable Data Protection Law.

1.4. **"Subprocessor"** means any third-party data processor engaged by RefineIQ who receives or processes Customer Personal Data.

---

## 2. Roles, Scope & Instructions of Processing

2.1. **Role of the Parties:** Customer is the Data Controller of Customer Personal Data, and RefineIQ is the Data Processor acting strictly on behalf of Customer.

2.2. **Customer's Instructions:** RefineIQ shall process Customer Personal Data solely in accordance with Customer's documented written instructions as set forth in the Principal Agreement, this DPA, or through Customer's configuration and operation of the Services (e.g., executing data cleaning jobs, PII masking, AutoML model training, or inference endpoints).

2.3. **Compliance Warranty:** Customer warrants that it has established all requisite lawful grounds, notices, and consents under Applicable Data Protection Law to transfer Personal Data to RefineIQ for processing.

---

## 3. Subprocessors

3.1. **Authorized Subprocessors:** Customer provides general written authorization for RefineIQ to engage the third-party subprocessors listed in **Schedule B** to support cloud infrastructure, computing, and payment settlement.

3.2. **Subprocessor Obligations:** RefineIQ enters into written agreements with each Subprocessor imposing data protection obligations no less restrictive than those imposed on RefineIQ under this DPA.

3.3. **Liability:** RefineIQ remains fully liable to Customer for the performance of its Subprocessors' obligations.

3.4. **Notification of Changes:** RefineIQ shall notify Customer at least thirty (30) days prior to appointing any new or replacement Subprocessor via an update to this DPA or an in-platform notification. Customer may object to such appointment on reasonable data protection grounds within fourteen (14) days of notice.

---

## 4. Technical and Organizational Measures (TOMs)

4.1. RefineIQ shall implement and maintain appropriate technical, physical, and organizational security measures to protect Customer Personal Data against accidental or unlawful destruction, loss, alteration, unauthorized disclosure, or access.

4.2. As detailed in **Schedule C**, RefineIQ enforces:
- **AES-256 encryption at rest** across all storage volumes and databases.
- **TLS 1.3 / 256-bit SSL encryption in transit** for all public API endpoints and web traffic.
- **Tenant Isolation & Row-Level Security (RLS)** ensuring Customer Data cannot be viewed or accessed across organizational boundaries.
- **Automated PII Redaction Engines** (Microsoft Presidio) enabling local sanitization of customer datasets prior to distributed model training.
- Continuous vulnerability management and access control logging.

---

## 5. Security Incident Management & Breach Notification

5.1. **Incident Notification:** In the event of a confirmed **Personal Data Breach** affecting Customer Personal Data processed by RefineIQ or its Subprocessors, RefineIQ shall notify Customer without undue delay, and in any event **within seventy-two (72) hours** of becoming aware of the breach.

5.2. **Information Provided:** Such notification shall specify:
- The nature of the incident and categories of affected Data Subjects.
- The likely consequences and potential risks of the incident.
- Remedial measures implemented or planned by RefineIQ to mitigate adverse effects.

5.3. **Cooperation:** RefineIQ shall provide reasonable assistance and cooperation to enable Customer to fulfill its statutory reporting obligations to Supervisory Authorities and affected individuals under GDPR, UK GDPR, or Section 38 of the Zambia Data Protection Act.

---

## 6. Data Subject Rights & Regulatory Inquiries

6.1. **Assistance with DSARs:** To the extent Customer cannot independently access, export, rectify, or erase Customer Personal Data via the self-service settings of the platform, RefineIQ shall, taking into account the nature of the processing, provide reasonable assistance to Customer to respond to Data Subject Access Requests (DSARs).

6.2. **Direct Requests:** If RefineIQ receives a request directly from a Data Subject concerning Customer Personal Data, RefineIQ will promptly advise the Data Subject to direct their request to Customer.

---

## 7. International Data Transfers & Standard Contractual Clauses

7.1. **Transfer Mechanism:** Where the performance of the Services involves the transfer of Personal Data originating in the EEA, UK, or Switzerland to a country outside these areas that has not received an adequacy decision, the parties hereby agree that the **European Commission Standard Contractual Clauses (Module Two: Controller-to-Processor)** are incorporated herein by reference.

7.2. **UK Transfers:** For transfers subject to UK Data Protection Law, the UK International Data Transfer Addendum to the EU Commission Standard Contractual Clauses shall apply.

7.3. **Zambian Cross-Border Transfers:** Transfers of personal data originating from Zambia comply with Section 69-71 of the ZDPA, verified by appropriate contractual safeguards, cryptographic encryption in transit, and verification of adequate recipient protections.

---

## 8. Deletion or Return of Personal Data

8.1. **Upon Termination:** Within thirty (30) days following termination or expiration of the Principal Agreement, or upon Customer's written request, RefineIQ shall delete or anonymize all Customer Personal Data stored within our production databases and storage systems, except to the extent statutory law mandates continued retention.

8.2. **Self-Service Erasure:** Customer may at any time permanently delete individual datasets, models, or projects directly via the platform interface.

---

## Schedule A: Details of Processing

- **Subject Matter & Nature of Processing:** The provision of autonomous tabular data cleaning, PII redaction, AutoML model training, explainability analysis (TreeSHAP), and real-time prediction micro-endpoint hosting.
- **Duration of Processing:** The term of the Principal Agreement plus the retention period until permanent deletion.
- **Categories of Data Subjects:** Customer's employees, contractors, users, prospects, or consumers whose data is contained in uploaded datasets.
- **Categories of Personal Data:** Identifiers (names, emails, phone numbers), business attributes (spending history, plan tier, transaction timestamps, engagement metrics), and prediction scores.
- **Special Categories of Data:** Customer is strictly prohibited from uploading special categories of data (e.g. biometric data, genetic data, health data) without prior written enterprise agreement and security review.

---

## Schedule B: Authorized Subprocessors

| Subprocessor Name | Role / Processing Purpose | Entity Location | Transfer Mechanism |
| :--- | :--- | :--- | :--- |
| **Supabase Inc.** | PostgreSQL Database, User Auth, and S3-Compatible Encrypted Storage | USA / EU (AWS) | Standard Contractual Clauses (SCCs), DPA |
| **Vercel Inc.** | Edge Delivery, CDN, Frontend Application Serving | Global Edge Network | Standard Contractual Clauses (SCCs), DPA |
| **Render Services Inc.** | Serverless Backend Compute (FastAPI, Polars, ML Workers) | USA | Standard Contractual Clauses (SCCs), DPA |
| **Google LLC (AI Studio)** | Generative AI synthesis for explainability summaries (schema only; no row data) | USA | Google Cloud DPA & SCCs |
| **Authorized Payment Gateways** | Payment authorization, fraud check, and multi-currency billing (Cards & Mobile Money) | Global & Regional PCI-DSS | PCI-DSS Level 1 Certification, Direct Settlement |

---

## Schedule C: Technical & Organizational Measures (TOMs)

1. **Access Controls:** Multi-factor authentication (MFA) required for all internal administrative access; role-based least privilege enforcement.
2. **Cryptographic Protection:** Transport Layer Security (TLS 1.3) across all endpoints; AES-256 encryption at rest for databases and backups.
3. **Data Segregation:** Logical multi-tenant separation enforced via PostgreSQL Row-Level Security (RLS) policies.
4. **Vulnerability Management:** Automated dependency scanning, automated integration testing, and periodic code reviews.
5. **Business Continuity:** Daily automated cloud database snapshots with multi-region redundancy.
