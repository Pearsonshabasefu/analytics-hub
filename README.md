# Refine IQ (MVP)

> The AI-native workspace for secure, high-speed data analytics.

## Overview

Refine IQ is an AI-native data platform designed for solo experts and small teams. It replaces hours of manual data preparation and model configuration with an automated, agentic workflow. We prioritize **Privacy (PII Masking)** and **Financial Predictability (OCU Cost Forecasts)** so you can focus on insights, not infrastructure.

**Tagline:** _"The Intelligence in Your Data, Unleashed"_

## The 7-Step Workflow

| Step | Name | What happens |
|------|------|-------------|
| 1 | **Entry** | Seamless Magic Link / OAuth authentication |
| 2 | **Project Launcher** | Name your project, AI pre-configures defaults |
| 3 | **Data Ingestion** | Drag & drop CSV, or connect Snowflake/BigQuery/S3 |
| 4 | **Refinery** | Automated audit + PII Privacy Shield + one-click fixes |
| 5 | **Model Studio** | AutoML race, Gemini Guide, OCU budget forecasting |
| 6 | **Deployment** | One-click API generation + production monitoring |
| 7 | **Watchtower** | Drift alerts, performance decay tracking |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend UI | React 18 + Tailwind CSS v4 + Vite |
| Backend | FastAPI (Python, async) + uv |
| Intelligence | Gemini 2.5 Flash API |
| Data Engine | Polars + Microsoft Presidio (PII) |
| Database | Supabase (PostgreSQL + Auth + RLS + Storage) |
| Compute | Modal (Serverless GPU) |
| Hosting | Vercel |
| Version Control | GitHub |

## Quick Start

### Prerequisites
- Node.js 22+
- Python 3.14+
- [uv](https://docs.astral.sh/uv/) Python package manager

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
uv sync
uv run uvicorn app.main:app --reload
```

### Database
```bash
cd supabase
npx supabase start
npx supabase db push
```

## Environment Setup

Copy `.env.example` to `.env` in both `frontend/` and `backend/` directories and fill in your keys.

## Project Structure

```
analytics-hub/
├── frontend/          # React + Tailwind v4 (Vite)
├── backend/           # FastAPI + uv (Python)
├── supabase/          # Database migrations + config
└── .github/           # CI/CD workflows
```

## Privacy & Security

Refine IQ includes a built-in **Privacy Shield**. Before data reaches the Model Studio, it is scanned and masked for PII (Emails, Phone Numbers, Credit Cards) using Microsoft Presidio to ensure your workflows remain compliant with 2026 data standards.

All API keys are stored in Supabase Vault (encrypted). Row Level Security (RLS) ensures users can never access each other's data.

## Feedback

Found a bug? Use the **Magic Ear** widget in the bottom-right corner of the application or open a GitHub Issue.

Built with ❤️ for the data science community.
