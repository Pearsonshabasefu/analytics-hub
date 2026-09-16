# Terms and Conditions of Service

**Last Updated: September 10, 2026**  
**Effective Date: September 10, 2026**

Welcome to **RefineIQ** ("Company", "we", "us", or "our"). These Terms and Conditions of Service ("Terms") govern your access to and use of the RefineIQ platform, website, application programming interfaces (APIs), and related software services (collectively, the "Service").

By creating an account, accessing, or utilizing the Service, you ("Customer", "User", or "you") acknowledge that you have read, understood, and agree to be legally bound by these Terms. If you are accepting these Terms on behalf of an enterprise, company, or legal entity, you represent and warrant that you possess full legal authority to bind such entity.

---

## 1. Description of Service

RefineIQ provides a cloud-native B2B data science automation and automated machine learning (AutoML) platform. The Service enables authorized users to ingest tabular datasets, execute autonomous data cleaning, mask personally identifiable information (PII), train and benchmark machine learning algorithms, deploy prediction micro-endpoints, and observe inference drift.

---

## 2. Accounts, Authentication & Access

2.1. **Eligibility:** You must be at least 18 years of age and legally competent to enter into binding contracts in your jurisdiction.

2.2. **Account Security:** You access the Service through single sign-on (SSO) or passwordless Magic Link email authentication. You are exclusively responsible for maintaining the confidentiality of your credentials and API tokens (`ah_live_*`). You assume full liability for all activities conducted under your account credentials.

2.3. **Unauthorized Access:** You agree to notify RefineIQ immediately upon discovering any unauthorized use of your credentials or breach of security.

---

## 3. Subscriptions, Operations Compute Units (OCUs) & Billing

3.1. **Pricing Structure:** The Service operates on a hybrid model comprising seat-based subscription tiers and usage-based **Operations Compute Units (OCUs)** consumed during automated data transformations, distributed model training runs, and inference serving.

3.2. **Payment Processing:** All payments, subscriptions, and one-time OCU top-ups are processed securely through our authorized payment gateway partners, including **Flutterwave**. By initiating transactions, you authorize RefineIQ and Flutterwave to charge your designated payment instrument in your selected currency.

3.3. **OCU Metering & Depletion:**
- Each AutoML training cycle, data transformation job, and model deployment draws against your available OCU balance.
- You may configure a "Max Spend per Run" guardrail within your workspace settings.
- If your OCU balance is exhausted, background training and serverless deployment operations may be suspended until credits are replenished.

3.4. **Auto Top-Up:** If you enable the optional Auto Top-Up feature in your settings, you authorize automatic replenishment of 50 OCUs whenever your balance falls below 10 OCUs.

3.5. **Refund Policy:** Except where expressly required by applicable statutory law, all fees, subscription charges, and purchased OCU credit packs are strictly non-refundable and non-transferable.

---

## 4. Customer Data Ownership & Intellectual Property

4.1. **Customer Ownership:** As between the parties, you retain 100% exclusive ownership, right, title, and interest in and to all raw datasets, files, database records, and proprietary business metrics that you upload or transmit to the Service ("Customer Data"), as well as the trained model weight artifacts derived specifically from your data.

4.2. **License to Operate:** You grant RefineIQ a limited, revocable, non-exclusive, worldwide license to process, parse, store, and compute upon your Customer Data solely to the extent necessary to deliver, maintain, and safeguard the Service for you.

4.3. **Platform Intellectual Property:** RefineIQ and its licensors retain all intellectual property rights, trademarks, patents, proprietary algorithms, user interface designs, and documentation comprising the platform. You may not reverse engineer, decompile, or copy platform source code.

---

## 5. Privacy Shield & Automated PII Redaction

5.1. **Automated Redaction:** The Service incorporates Microsoft Presidio technology ("Privacy Shield") designed to identify and mask sensitive personal data (including email addresses, telephone numbers, and personal identifiers) prior to algorithmic training.

5.2. **Customer Compliance Responsibility:** You represent and warrant that you possess all requisite legal consents, permissions, and lawful bases under applicable data protection legislation (including GDPR, CCPA, and regional equivalents) to upload Customer Data to the Service.

5.3. **AI Architecture Guardrails:** RefineIQ enforces an architectural boundary: raw customer data rows are processed within your isolated execution environment. Only abstracted metadata, column names, and aggregated statistical summaries are referenced for AI assistant briefings.

---

## 6. AI Output Disclaimer & Model Reliability

6.1. **Probabilistic Nature of AI:** You acknowledge that machine learning models, statistical algorithms, and automated recommendations generated by the Service are probabilistic in nature. RefineIQ does not guarantee that model predictions, classifications, or forecasts will be error-free, uninterrupted, or predictive of real-world outcomes.

6.2. **Human Oversight:** The Service is intended as an accelerator for data scientists and analysts. You are exclusively responsible for auditing, evaluating, validating, and testing model outputs and prediction endpoints prior to deploying them into production environments or relying on them for mission-critical business decisions.

6.3. **No Professional Advisory:** RefineIQ does not provide certified financial, medical, legal, or investment advice.

---

## 7. Acceptable Use Policy

You agree not to use the Service to:
- Process, store, or transmit illegal content, state secrets, or non-consensual biometric data;
- Perform unauthorized security vulnerability scans, denial of service attacks, or penetration tests;
- Circumvent OCU consumption metering or tamper with billing endpoints;
- Distribute malware, cryptominers, or unauthorized automated scrapers;
- Train models intended for discriminatory credit profiling, unlawful surveillance, or weapons guidance.

---

## 8. Limitation of Liability

TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW:
- IN NO EVENT SHALL ANALYTICS HUB, ITS DIRECTORS, OFFICERS, EMPLOYEES, OR AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA LOSS, BUSINESS INTERRUPTION, OR INACCURATE MACHINE LEARNING PREDICTIONS.
- THE TOTAL AGGREGATE LIABILITY OF ANALYTICS HUB FOR ALL CLAIMS ARISING OUT OF OR RELATING TO THESE TERMS OR THE SERVICE SHALL NOT EXCEED THE TOTAL AMOUNT ACTUALLY PAID BY YOU TO ANALYTICS HUB IN THE TWELVE (12) MONTHS IMMEDIATELY PRECEDING THE EVENT GIVING RISE TO LIABILITY.

---

## 9. Warranties & Disclaimers

THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS, WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT.

---

## 10. Termination & Suspension

10.1. **Termination by You:** You may terminate your account and cancel your subscription at any time via the workspace Settings panel.

10.2. **Suspension by RefineIQ:** We reserve the right to suspend or terminate your access immediately if you breach these Terms, fail to pay accrued fees, or engage in activity that threatens platform integrity.

10.3. **Inactivity on Free Tiers:** Projects operating under free infrastructure quotas may be automatically archived following extended periods of inactivity in accordance with cloud provider policies.

---

## 11. Governing Law & Dispute Resolution

These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, United States, without regard to its conflict of law principles. Any dispute, claim, or controversy arising out of or relating to these Terms shall be resolved through binding confidential arbitration administered by the American Arbitration Association (AAA).

---

## 12. Modifications to Terms

We reserve the right to update or modify these Terms periodically. We will provide notice of material modifications by updating the "Last Updated" date at the top of this page. Your continued use of the Service following the posting of revised Terms constitutes acceptance of the changes.

---

## 13. Contact Information

If you have questions, inquiries, or notices regarding these Terms, please contact our legal and product team:

- **Entity:** RefineIQ
- **Email:** legal@refineiq.ai
- **Feedback & Compliance:** Via the in-app Magic Ear 👂 widget or workspace settings.
