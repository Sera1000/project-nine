# Project NINE backend (starter)

This is a deliberately minimal Node.js 20+ HTTP backend scaffold. No cloud hosting, AI model, accounts, or persistent memory are connected yet.

## Local run
```sh
cd backend
npm start
```

- `GET /health`: health check
- `POST /api/chat`: validates a JSON `{"message":"hello"}` body and returns HTTP 501 until an AI provider is securely configured.

## Deployment later
Use a Node-compatible cloud host, set `PORT` (often supplied automatically) and `FRONTEND_ORIGIN` to the exact frontend origin. Put API keys in the host's secret settings, **never** in this repository or frontend HTML.

Security: no unauthenticated model proxy is enabled. Before real AI chat, add authentication, per-user rate limits, safe secret handling, and a database with access controls. Browser localStorage chat is not server memory.

Privacy: GitHub repository visibility must be changed separately in GitHub Settings; this scaffold does not change it.
