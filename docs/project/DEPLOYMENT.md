# PitchPulse — Dağıtım Rehberi

## Demo URL'leri

- **Frontend:** https://pitchpulse-three.vercel.app
- **Backend API:** https://pitchpulse-backend-production.up.railway.app/api
- **Health Check:** https://pitchpulse-backend-production.up.railway.app/api/health

## Demo Hesap

| Alan | Değer |
|------|-------|
| E-posta | demo@modastudyo.com |
| Şifre | demo123456 |

## Ortam Değişkenleri

### Backend (Railway)

```
DATABASE_URL=postgresql://pitchpulse:<password>@postgres.railway.internal:5432/pitchpulse
JWT_SECRET=<org-secret>
PORT=8080
FRONTEND_URL=https://pitchpulse-three.vercel.app
```

### Frontend (Vercel)

```
NEXT_PUBLIC_API_URL=https://pitchpulse-backend-production.up.railway.app/api
```

## Portlar (Geliştirme)

- Backend: 4039
- Frontend: 3039

## CI/CD

Son güncelleme: 2026-06-19 — Railway PG env her zaman ayarlanıyor; Vercel domain API'den çözümleniyor.

Push to `main` triggers:
1. Backend tests + integration
2. Frontend build
3. Infrastructure provisioning (Railway + Vercel)

## Org Secrets (GitHub Actions)

- GH_PAT
- RAILWAY_API_TOKEN
- VERCEL_TOKEN
- JWT_SECRET
