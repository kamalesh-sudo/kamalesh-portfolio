# Behavioral_Auth_System Vulnerability Report

Date: 2026-03-05  
Scope: `app/`, `backend/`, `frontend/`  
Assessment type: Authorized application security review

## 1) Admin Account Takeover via `start-session`

- Severity: **Critical**
- Affected code:
  - `app/main.py:199`
  - `app/main.py:213`
  - `app/main.py:227`
  - `app/config.py:33`
  - `app/database.py:512`

### Description
`/api/start-session` can auto-create users. If username equals configured initial admin username (default: `admin`), role becomes `admin`. On fresh deployments, this allows first-come admin takeover.

### PoC
```bash
curl -s -X POST http://127.0.0.1:5000/api/start-session \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"anypass","device_fingerprint":"pt-admin-001"}'
```

### Steps to Reproduce
1. Start server with a fresh database.
2. Send the PoC request.
3. Observe response contains `success: true` and admin role/token.
4. Use returned token to call admin endpoint (`/api/admin/users`) and confirm access.

### Remediation
1. Remove user auto-provisioning from `/api/start-session`.
2. Remove username-based role promotion.
3. Bootstrap admin through one-time secure setup only.
4. Add regression test: regular user cannot self-promote to admin by username.

---

## 2) Password Policy Bypass through `start-session`

- Severity: **High**
- Affected code:
  - `app/main.py:195`
  - `app/main.py:196`
  - `app/main.py:213`
  - `app/schemas.py:8`
  - `app/database.py:512`

### Description
`/api/register` enforces password length >= 6, but `/api/start-session` can create users with weak passwords (e.g., length 1), bypassing policy.

### PoC
```bash
curl -s -X POST http://127.0.0.1:5000/api/start-session \
  -H "Content-Type: application/json" \
  -d '{"username":"weak_user","password":"1","device_fingerprint":"pt-weak-001"}'
```

### Steps to Reproduce
1. Attempt `/api/register` with password `1` and confirm rejection.
2. Attempt `/api/start-session` with password `1`.
3. Observe account creation and token issuance.

### Remediation
1. Enforce one shared password policy on all account creation/login entry points.
2. Raise minimum password complexity and length in schema/service layer.
3. Disallow account creation in session-start/login flow.

---

## 3) Client-Controlled `risk_score` in Login Decisions

- Severity: **High**
- Affected code:
  - `app/main.py:250`
  - `app/main.py:276`
  - `app/main.py:305`
  - `frontend/login/login.js:363`

### Description
Server relies on client-supplied `risk_score` for security decisions. An attacker can tamper this value to bypass high-risk protections.

### PoC
```bash
curl -s -X POST http://127.0.0.1:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user1","password":"secret123","risk_score":1.0,"device_fingerprint":"pt-risk-001"}'

curl -s -X POST http://127.0.0.1:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user1","password":"secret123","risk_score":0.0,"device_fingerprint":"pt-risk-001"}'
```

### Steps to Reproduce
1. Use same valid credentials and same device fingerprint.
2. Send login with high `risk_score` and note denial.
3. Send login with low `risk_score` and note acceptance.
4. Confirm only user-controlled field changed.

### Remediation
1. Remove client-provided `risk_score` from auth decision logic.
2. Compute risk server-side from trusted telemetry/session state.
3. Sign and bind risk context to session if needed.

---

## 4) WebSocket Authentication Fallback to Static `AUTH_TOKEN`

- Severity: **High**
- Affected code:
  - `app/realtime.py:18`
  - `app/realtime.py:117`
  - `app/realtime.py:124`
  - `app/realtime.py:157`

### Description
When JWT verification fails, websocket auth may still pass using static `AUTH_TOKEN`. In that path, identity is weakly bound and message `userId` handling can be abused.

### PoC
```json
{"token":"<AUTH_TOKEN>"}
{"type":"behavioral_data","userId":"test_user","sessionId":"pt-ws-001","keystrokeData":[],"mouseData":[]}
```

### Steps to Reproduce
1. Ensure `AUTH_TOKEN` is set in runtime.
2. Connect websocket to `/ws/behavioral`.
3. Authenticate with static token (not JWT).
4. Send behavioral message with selected `userId`.
5. Observe whether server processes events without JWT-bound identity.

### Remediation
1. Remove static token fallback in production.
2. Require valid JWT for websocket auth.
3. Enforce strict binding between JWT subject and message identity.
4. Add tests for websocket auth bypass attempts.

---

## 5) Unauthenticated File Upload Endpoint

- Severity: **Medium**
- Affected code:
  - `app/main.py:166`

### Description
`/api/upload` accepts file uploads without authentication. This can be abused for storage exhaustion and unauthorized file hosting.

### PoC
```bash
curl -s -X POST http://127.0.0.1:5000/api/upload -F "file=@README.md"
```

### Steps to Reproduce
1. Send upload request without `Authorization` header.
2. Observe successful upload response.
3. Repeat uploads to evaluate abuse potential.

### Remediation
1. Require authentication/authorization on upload routes.
2. Add per-user/IP rate limits and storage quotas.
3. Restrict MIME types and perform content validation/scanning.
4. Store uploads outside publicly executable/static paths.

---

## Verification Notes

1. Findings are code-referenced and reproducible in an authorized test environment.
2. Execute tests in isolated staging only.
3. Preserve request/response evidence for triage and patch validation.
