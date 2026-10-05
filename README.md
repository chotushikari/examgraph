# Examgraph

Examgraph turns a college unit PDF into a mind-map-first, exam-optimised study workspace. It uses a single Groq request for PDF-to-Unit generation; all learning state stays in the browser's localStorage.

## Stack

- Next.js App Router and TypeScript
- Tailwind CSS with small shadcn-style UI primitives
- React Flow for the knowledge map
- Zustand persistence for local-only progress
- `pdf-parse` for server-side text extraction
- Groq Chat Completions API for structured inference

## Setup

Prerequisites: Node.js 20+ and a Groq API key.

```bash
npm install
copy .env.local.example .env.local
# Add GROQ_API_KEY=... to .env.local
npm run dev
```

Open `http://localhost:3000`, upload a text-based college-unit PDF, and wait for the unit graph. Do not commit `.env.local` or expose your API key.

## How it differs from ordinary AI notes tools

Examgraph is built for serious exam preparation rather than casual summarisation:

- **Mind-map-first navigation:** every generated subtopic is a selectable React Flow node with priority, status, and confidence.
- **Exam-pattern content:** study packages include question types, marks, frequency, model answer outlines, diagrams, traps, memory cues, and self-tests.
- **Mastery rather than opened-state:** completion requires a user confirmation after at least 80% concept-block coverage; readiness prioritises high-weight topics 3×.
- **Modes for the real study cycle:** Deep, Cram, and Revision modes change the map and study content emphasis.
- **Personal notes layer:** notes are saved locally per unit and subtopic and surface prominently in revision mode.

## Constraints

The MVP accepts text PDFs up to 20 MB. Scanned/image-only PDFs need OCR before upload. Very large text payloads are rejected rather than silently truncated, because source fidelity matters. The API uses Groq model `llama-3.3-70b-versatile`; change the model in `src/app/api/parse-unit/route.ts` if your Groq account has different model access.

## Future work

Multiple saved units, authenticated accounts, persistent server storage, OCR, source-page citations per block, richer prerequisite validation, spaced repetition, and image-aware diagram extraction are natural next steps.
