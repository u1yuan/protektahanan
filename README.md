# Protektahanan

A bilingual, senior-friendly scam-pattern checker. **Works without an API key.** Reference mode is rule-based, not machine learning or live AI. It cannot authenticate a sender or prove safety.

## Run

Node.js 22.12+ required. Install dependencies with `npm install`, then run `npm run dev` and open http://localhost:5173. One process serves the UI and API. `npm run build` creates the production frontend. `npm run preview` serves the production frontend with the API. `npm test` runs the checks.

## Optional live AI

Copy `.env.example` to `.env`. Set `ANALYSIS_MODE=ai` and `GEMINI_API_KEY` server-side, then restart. `GEMINI_MODEL` defaults to `gemini-3.8-flash`. Never use a `VITE_*` variable for secrets. AI mode discloses external processing and returns a recoverable error on provider failure; it never silently substitutes reference results. Real AI has not been verified without credentials.

## Deploy

Import this repository into Vercel as a Vite project. Included `/api/analyze` and `/api/status` Node functions share the local implementation. No environment variables are needed for reference mode. Optional AI credentials belong in Vercel server environment settings. No public deployment is claimed until a URL has been deployed and checked.

## Privacy and limitations

Inputs and findings stay in transient memory. No accounts, database, history, analytics, or message-body logs. Requests go only to this app's server in reference mode; optional AI mode also sends them to Google Gemini. Provider retention is not guaranteed. URLs are parsed as strings; no DNS, page fetches, or redirects. Small curated pattern coverage will miss unfamiliar scams. Official domain matches do not authenticate a message. Reporting prepares a draft; users submit it themselves.

Curated examples, domains, reporting destinations, sources, and verification dates are in `shared/core.ts`. Pattern explanations are editorial examples informed by the linked guidance, not quotations or claims of a known offender. Recheck reporting resources before pitching.

## Verification performed

- `npm run build`: passed TypeScript checking and production bundling.
- `npm test`: 7 tests passed, covering bilingual examples, ordinary/ambiguous messages, deceptive URLs, negative advice, report wording, API validation, and no-store headers.
- Local HTTP round trip: input reached the running API and returned a reference-based assessment. This is not an external AI round trip.
- `node tests/browser.mjs`: passed using headless Microsoft Edge at 360px and desktop widths. Verified the complete input → API → results → language switch → URL evidence → report → new-check flow, text enlargement, no horizontal overflow, empty browser storage, and no JavaScript errors. Screenshots are saved under ignored `artifacts/`.
- No public deployment or live Gemini verification is claimed. A server is required; open http://127.0.0.1:5173 instead of double-clicking the source HTML. Static hosting must serve the built `dist` folder and provide the included API functions.
