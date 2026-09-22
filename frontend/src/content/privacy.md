# RefineIQ Global Privacy Policy

**Last Updated: September 22, 2026**  
**Effective Date: September 22, 2026**

RefineIQ ("RefineIQ", "we", "us", or "our") is dedicated to safeguarding the privacy and confidentiality of individuals whose personal data we process. This Privacy Policy details how we collect, process, disclose, and protect personal data when you use the RefineIQ automated machine learning platform, application programming interfaces (APIs), and website located at `https://refineiq.vercel.app` (collectively, the "Service").

This Policy applies globally to users worldwide and specifically complies with:
- **Zambia Data Protection Act No. 3 of 2021 (ZDPA)**
- **General Data Protection Regulation (GDPR - Regulation (EU) 2016/679)**
- **United Kingdom Data Protection Act 2018 & UK GDPR**
- **California Consumer Privacy Act as amended by the CPRA (CCPA/CPRA)**
- **Pan-African Data Privacy Frameworks** (Kenya DPA 2019, Nigeria NDPA 2023, South Africa POPIA)

---

## 1. Roles and Responsibilities (Controller vs. Processor)

- **RefineIQ as a Data Controller:** We act as a Data Controller with respect to account registration data, user identity credentials, payment billing records, and direct website analytics collected directly from account holders.
- **RefineIQ as a Data Processor:** When you upload tabular spreadsheets, customer databases, and test datasets into the Refinery, Ingest, Studio, or Deploy modules ("Customer Upload Data"), **you act as the Data Controller**, and RefineIQ acts strictly as a **Data Processor** acting on your written instructions under our [Data Processing Agreement (DPA)](/dpa).

---

## 2. Personal Data We Collect

### A. Information You Provide Directly
- **Identity & Contact Data:** Name, email address, company name, and job title collected when registering via email or OAuth single sign-on (Google Identity, GitHub).
- **Billing & Transaction Data:** Billing country, transaction reference IDs (`TXN-...`), currency selection (USD, EUR, GBP, ZMW), and payment method tokens. *Note: RefineIQ does not store or process raw credit card numbers (PAN) or security codes (CVV) on our servers; payments are processed directly by certified PCI-DSS Level 1 payment processors.*
- **Communication & Feedback:** Text feedback and feature requests submitted through our in-app feedback widgets.

### B. Customer Upload Data (Spreadsheets & Machine Learning Datasets)
- Tabular records containing columns you choose to upload (e.g., customer churn logs, sales metrics, user transaction histories).
- Such records may inadvertently contain Personally Identifiable Information (PII) such as phone numbers, emails, or names. **RefineIQ provides automated Microsoft Presidio PII scanning and redaction** before datasets are dispatched for AutoML model training.

### C. Technical & Usage Telemetry
- IP address, browser type and version, operating system, session timestamps, feature engagement, and API request latency metrics.

---

## 3. How We Use Personal Data & Legal Bases for Processing

Under GDPR (Article 6) and ZDPA (Section 12), we process personal data under the following lawful bases:

| Purpose of Processing | Categories of Data | Lawful Basis |
| :--- | :--- | :--- |
| Providing core AutoML, data cleaning, and model hosting | Account credentials, project metadata, Customer Data | **Contractual Necessity** (performance of service agreement) |
| Identity verification & OAuth authentication | Email, OAuth tokens, user UUID | **Contractual Necessity** & **Legitimate Interests** |
| Processing credit top-ups & billing | Transaction references, billing address | **Contractual Necessity** & **Legal Obligation** (tax/accounting) |
| Automated PII Detection & Anonymization | Uploaded tabular columns | **Legitimate Interests** & Compliance with Data Protection Laws |
| Machine learning model explainability (TreeSHAP) | Feature vectors and target distributions | **Contractual Necessity** |
| Platform security, fraud prevention & abuse detection | IP logs, session tokens, audit events | **Legitimate Interests** & **Legal Obligation** |

### Crucial Commitment on Machine Learning Training Data:
> **RefineIQ does NOT use your uploaded datasets or private model weights to train foundation models, nor do we sell, monetize, or share your proprietary data across customer tenants.** Your models and data remain strictly isolated to your tenant organization.

---

## 4. Subprocessors and Third-Party Data Disclosures

To operate our cloud infrastructure, we share data only with vetted third-party subprocessors who maintain stringent contractual confidentiality and security commitments:

| Subprocessor | Purpose | Location | Transfer Safeguard |
| :--- | :--- | :--- | :--- |
| **Supabase Inc.** | Cloud PostgreSQL Database, Authentication, and Encrypted Storage | United States / EU (AWS) | Standard Contractual Clauses (SCCs), DPA |
| **Vercel Inc.** | Frontend Edge Delivery, CDN, and Global Routing | Global Edge Network | Standard Contractual Clauses (SCCs), DPA |
| **Render Services Inc.** | Serverless Machine Learning Backend Compute (FastAPI, Polars) | United States | Standard Contractual Clauses (SCCs), DPA |
| **Google LLC (AI Studio / Gemini)** | Explainability executive summaries (schema & feature names only, no raw PII rows) | United States | Google Cloud DPA, SCCs |
| **Authorized Payment Processors** | Global Card Processing & African Mobile Money (MTN, Airtel) | Global / Regional PCI-DSS | PCI-DSS Level 1 Certified, Direct Settlement |

---

## 5. International Data Transfers

When personal data originating in the European Economic Area (EEA), United Kingdom, or Zambia is transferred across national borders:
- **EEA/UK Transfers:** We execute European Commission Standard Contractual Clauses (SCCs) and UK International Data Transfer Agreements (IDTA).
- **Zambian Transfers (ZDPA Section 69-71):** Cross-border transfers of personal data originating in Zambia are conducted pursuant to lawful bases, appropriate safeguards, and verification that the recipient jurisdiction maintains adequate data protection standards.

---

## 6. Data Security & Storage Safeguards

We implement defense-in-depth organizational and technical measures:
1. **Encryption in Transit & at Rest:** All web traffic is encrypted via TLS 1.3 / 256-bit SSL encryption. All database volumes and Supabase Storage buckets are encrypted at rest with AES-256.
2. **Row-Level Security (RLS):** Supabase database tables enforce strict tenant-isolation policies; users can never read, modify, or delete records belonging to another account.
3. **Automated PII Redaction:** Integrated Microsoft Presidio detects and masks personal identifiers prior to distributed algorithmic training.
4. **Session Timeout & Inactivity Guards:** Automatic idle session termination guards against unauthorized access on shared workstations.

---

## 7. Data Retention & Erasure

- **Account Data:** Retained as long as your account remains active. Upon written request or account deletion, account identifiers are permanently erased within thirty (30) days.
- **Uploaded Datasets & Models:** Retained until deleted by the user within the platform interface or thirty (30) days after subscription termination.
- **Billing Records:** Retained for statutory periods (typically 5 to 7 years) as mandated by applicable tax and commercial bookkeeping laws.

---

## 8. Your Global Privacy Rights

Depending on your jurisdiction, you possess the following enforceable rights:
- **Right of Access / Portability:** Obtain confirmation of whether your data is processed and request an export of your datasets.
- **Right to Rectification:** Correct inaccurate or outdated profile information.
- **Right to Erasure ("Right to be Forgotten"):** Request permanent deletion of your account and uploaded data.
- **Right to Restrict or Object to Processing:** Object to processing based on legitimate interests.
- **Right to Withdraw Consent:** Revoke consent at any time without affecting past lawful processing.
- **Non-Discrimination (CCPA):** We will never discriminate, alter pricing, or deny service quality if you exercise statutory privacy rights.

To exercise any of these rights, email our Data Privacy Officer at **privacy@refineiq.ai** or submit a request directly through your account Settings.

---

## 9. Regulatory Authorities & Contact Information

If you believe your personal data has been handled inconsistently with applicable law, you have the right to lodge a complaint with your local regulatory authority:
- **Zambia:** Office of the Data Protection Commissioner (ODPC) / INICTA, Lusaka, Zambia.
- **European Union:** Your national Data Protection Authority (DPA) under the EDPB.
- **United Kingdom:** Information Commissioner's Office (ICO) (`ico.org.uk`).
- **United States:** California Privacy Protection Agency (CPPA) or your state Attorney General.

**Data Protection Officer Contact:**  
RefineIQ Legal & Privacy Team  
Email: **privacy@refineiq.ai**  
Website: `https://refineiq.vercel.app`
