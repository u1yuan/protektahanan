# Protektahanan design prototype

Approved teal and mint design, responsive message/call input, Filipino/English controls, fictional result preview, and reviewable report summaries. Generated concept: [design/mvp-mockup.png](design/mvp-mockup.png).

Run locally with `python -m http.server 5173`, then open http://localhost:5173. No dependencies or build step. JavaScript syntax check: `node --check app.js`.

This is an interactive design prototype, not the completed live-AI MVP. The Check action expects `POST /api/analyze` with `{text, language}` and a response containing `category` (`strong`, `uncertain`, `none`), `explanation`, `warningSigns`, and `nextSteps`. No server/provider is configured. Failures show a recovery message and preserve input. Sample results are explicitly labeled and never substitute for a failed live check.

Remaining before a live pitch: provider-independent server with validated input/output, server-side credentials, verified official reporting channels, real AI round trip, and full accessibility/privacy verification. Inputs and results use memory only. No browser storage or analytics. The static development server logs request paths/statuses, not submitted bodies.

The generated image was created with the built-in image generation tool. Prompt direction: a high-fidelity Protektahanan desktop input screen and mobile result screen; ocean teal #124D45, mint #E7F2E9, large readable Filipino labels, calm privacy guidance, older Filipino couple illustration, and clearly labeled fictional results.
