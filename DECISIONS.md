# Decisions

### 2026-04-16 — Deploy to AWS Amplify Hosting
**Context:** Need to host LinguaQuest on a free public domain for ElevenHacks #4 hackathon demo.
**Options considered:**
- AWS Amplify Hosting (WEB_COMPUTE) — free tier, native Next.js SSR support, auto-deploy from GitHub, free `.amplifyapp.com` subdomain
- Vercel — free tier, but requires separate account
- S3 + CloudFront — static only, doesn't work with API routes
**Decision:** AWS Amplify Hosting with `platform: WEB_COMPUTE` for SSR. Connected to `levanstein/LinguaQuest` `main` branch via GitHub OAuth.
**Consequences:** Auto-deploys on every push to `main`. Free subdomain at `main.{appId}.amplifyapp.com`. AWS IAM role handles compute; runtime env vars (ELEVENLABS_API_KEY, TURBOPUFFER_API_KEY) set directly in Amplify.
