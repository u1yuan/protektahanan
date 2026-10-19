# Scam-proof Lolos and Lolas â€” Product Requirements

Status: implementation added. Reference-based mode works without API credentials, per latest user instruction. Optional live AI requires configuration and verification.

## Challenge and objective

Older adults receive scam calls, spoofed texts, and phishing links pretending to be banks, e-wallets, telcos, or relatives. They need a simple way to pause, recognize warning signs, and choose a safer next action.

Build a mobile-friendly web app with big text, simple steps, and plain language. Use AI to explain possible warning signs without claiming to prove authenticity or guarantee protection. The working title names the challenge; it is not a security guarantee.

**The demo must run live. Only the first five teams to finish qualify to pitch in Room QUALIFY.** A small, credible end-to-end demo takes precedence over feature breadth.

## Audience and goals

Primary users are Filipino older adults with varying digital literacy who can paste a message or describe a suspicious call. A helper may assist on the same device; no separate caregiver experience is required.

The MVP succeeds when a user can understand warning signs in Filipino or English, find a safe next action without trusting contact details in the suspicious message, and prepare a report for an official channel. The main journey must require few decisions and remain readable on a phone.

## Core experience

1. **Choose a language.** Filipino is the initial default. An obvious switch offers English throughout the experience.
2. **Enter content.** Paste suspicious text or type a call description. Explain what to enter and ask users to remove sensitive details. Offer clearly labeled fictional examples.
3. **Request a check.** Explain before submission that the text will be sent to an external AI service. An explicit check action starts analysis with a visible loading state.
4. **Read the assessment.** Show a concern category, short explanation, specific warning signs, and prioritized safe next steps in the selected language.
5. **Prepare a report, optionally.** Show a reviewable, copyable summary and an identified official reporting destination. The user opens the channel and submits the report themselves.

### Assessment behavior

Provide plain-language Filipino and English labels for these categories:

| Category                 | Meaning                                                | Required guidance                                                                               |
| ------------------------ | ------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| Strong warning signs     | Clear suspicious patterns appear in the content.       | Explain the patterns; advise pausing before responding, paying, or sharing information.         |
| Uncertain                | Context is insufficient or evidence is ambiguous.      | Explain what cannot be established and how to verify independently.                             |
| No obvious warning signs | The supplied text reveals no clear suspicious pattern. | Explain that this does not prove authenticity; recommend verification before sensitive actions. |

Do not show unsupported accuracy claims, certainty percentages, or a guaranteed-safe verdict. A call description can reveal warning signs but cannot authenticate the caller. Do not invent events, losses, or sender identities.

Verification advice must direct users to independently obtained official contact information, such as an institution's official app or website, rather than links or numbers supplied in the suspicious message.

### Guided reporting

- Prepare a concise summary based only on user-provided facts. Mark missing information as unknown.
- Let users review and copy it before leaving the app. Provide manual selection and copying if clipboard access fails.
- Select destinations from curated official resources verified before the demo. Keep source and verification date with each destination.
- Identify the destination and explain that users must submit through that channel. Copying a summary or opening a link must never display â€œreport submitted.â€
- If no relevant verified destination is available, explain that limitation and provide independent-verification guidance. Never invent an address.

## Functional and technical requirements

### Application and AI boundary

- Use React + Vite with TypeScript by default for a responsive web interface.
- Defer AI provider and hosting selection until credentials and deployment constraints are known. Real AI integration is required for acceptance.
- Use a provider-independent server interface accepting message text and selected language, and returning a structured concern category, explanation, warning signs, and next steps. The browser must not depend on a provider-specific response format.
- Validate input and AI output on the server. Reject empty or whitespace-only input helpfully. Invalid output must produce a recoverable error, not an invented assessment.
- Keep credentials exclusively server-side, never in browser code or `VITE_*` variables; see [Vite environment guidance](https://github.com/vitejs/vite/blob/main/docs/guide/env-and-mode.md).
- Treat submitted content as data, not instructions. Do not execute embedded commands or automatically fetch suspicious URLs.

### Privacy and failure handling

- Keep inputs and results in transient application memory only. Do not persist them in browser storage, databases, analytics, or application logs. Clear the previous assessment when starting a new check.
- Explain external AI processing before submission. Ask users to remove passwords, PINs, OTPs, account numbers, and other private details. Do not promise zero external-provider retention unless verified.
- Provide distinct plain-language empty-input, loading, timeout, unavailable-service, and invalid-response states. Offer edit or retry actions and preserve input during recoverable failures.
- Prevent duplicate submissions during loading. Never silently replace a failed check with a canned success result.

### Accessibility and language

- Default to Filipino and provide English across controls, assessments, errors, privacy copy, and reporting instructions.
- Use respectful language, short sentences, and one primary action per step.
- Use at least 20px body text, primary touch targets of at least 48px by 48px, and text contrast of at least 4.5:1.
- Support keyboard operation, visible focus, programmatic labels, and accessible loading/result announcements. Communicate categories with text as well as color.
- At a 360px viewport width and at 200% text enlargement, keep the main flow readable and all actions accessible without horizontal scrolling.

## MVP exclusions

No accounts, database, saved report history, automatic call interception, sender authentication, screenshot analysis, automatic reporting, family accounts, or caregiver dashboards. The app does not inspect an inbox or prove whether a URL is safe. These capabilities are not prerequisites for the live demo.

## Acceptance criteria

These are future implementation checks, not completed test results.

| Scenario                        | Pass condition                                                                                                                                   |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Live analysis                   | An entered message completes a real browser-to-server-to-AI round trip and renders a structured assessment.                                      |
| Suspicious content              | Clear warning signs receive relevant explanations and safe next steps without unsupported sender-identity claims.                                |
| Ambiguous content               | Limited context produces honest uncertainty and independent-verification guidance.                                                               |
| Ordinary content                | Results never declare the message guaranteed safe or authenticated.                                                                              |
| Malicious embedded instructions | Submitted instructions cannot override analysis, trigger link fetching, or cause secret disclosure.                                              |
| Both languages                  | Controls, results, errors, privacy copy, and reporting guidance use the selected language.                                                       |
| Accessibility                   | The main journey works on narrow mobile screens, with keyboard input and enlarged text; contrast and touch targets meet the stated requirements. |
| Failure recovery                | Empty input and simulated timeout, unavailable-service, and malformed-output failures show recovery actions without fake assessments.            |
| Reporting                       | The summary reflects supplied facts, supports copying, and points to a verified official destination without implying submission.                |
| Privacy and secrets             | Browser bundles and traffic expose no AI credentials; application storage and logs contain no submitted message bodies or findings.              |

## Live-demo sequence

Prepare four clearly labeled fictional inputs: bank impersonation requesting an OTP, e-wallet impersonation requesting a PIN, a telco-themed urgent payment/link message, and relative impersonation requesting money from an unfamiliar number. Use invented names and non-actionable placeholder links, never real credentials or victim data. Also prepare an ambiguous message and an ordinary message for verification.

1. Open the app in Filipino on a phone-sized viewport.
2. Load a fictional suspicious example and run a real AI check.
3. Explain the warning signs and demonstrate the recommended safe next action.
4. Demonstrate English support.
5. Prepare and copy a report summary, then show its verified official destination without sending a fictional report.
6. Start another check. Keep a recoverable-error demonstration ready if needed.

Before pitching, verify the running app, server credentials, connectivity, both languages, and reporting destinations. Sample inputs are permitted; sample outputs must not be passed off as live analysis. If the AI service is unavailable, show the honest error state; prerecorded or mocked results do not satisfy live-analysis acceptance.

## Decisions and defaults

- Working title: Scam-proof Lolos and Lolas.
- Platform: mobile-friendly React + Vite web app; TypeScript by default.
- Language: Filipino initially, with English available.
- Input: pasted text or a typed call description.
- AI: real analysis through a provider-independent server boundary; provider and hosting remain implementation-time choices.
- Reporting: guided, user-submitted reporting through verified official channels.
- Storage: transient application state; no accounts or database for the MVP.
- Current deliverable: React application, reference checker, optional Gemini adapter, guided reporting, and tests. See README.md for actual setup and verification limitations.
