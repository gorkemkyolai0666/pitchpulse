# PitchPulse — Ürün Gereksinim Dokümanı

## Vizyon

PitchPulse, Türkiye'deki bağımsız kayıt stüdyoları için geliştirilmiş dijital yönetim platformudur. Stüdyoların sanatçı ilişkilerini, seans planlamasını, ekipman envanterini ve mix/master teslimatlarını tek bir yerden yönetmelerini sağlar.

## Hedef Kitle

- Bağımsız kayıt stüdyoları
- Home studio operatörleri
- Ses mühendisleri ve prodüktörler
- Podcast prodüksiyon stüdyoları

## Sektör

Müzik prodüksiyon / kayıt stüdyosu hizmetleri

## Tasarım Yönü

**Futuristic / Technical**
- Renk paleti: Neon Purple (#a855f7), Neon Cyan (#06b6d4), Void (#0a0a0f)
- Tipografi: Space Grotesk (body) + JetBrains Mono (display)
- Gradient butonlar, glow kartlar, koyu navigasyon
- Koyu/Açık mod desteği

## Temel Özellikler (MVP)

### 1. Sanatçı Yönetimi
- Sanatçı/grup kayıt (ad, tür, iletişim)
- Notlar ve arama

### 2. Stüdyo Odaları
- Oda türleri (live, vocal, mix, mastering, podcast)
- Saatlik ücret ve kapasite

### 3. Ekipman Envanteri
- Mikrofon, arayüz, monitör, preamp takibi
- Seri numarası ve durum bilgisi

### 4. Seans Yönetimi
- Kayıt, mix, mastering, prova, podcast seansları
- Mühendis atama ve durum takibi

### 5. Teslimat Yönetimi
- Mix, master, stems, demo teslimatları
- Fiyat ve teslim tarihi takibi

### 6. Dashboard
- Toplam sanatçı, bugünkü seanslar, bekleyen teslimatlar
- Yaklaşan seanslar listesi

## Teknik Stack

- **Backend:** NestJS, Prisma ORM, PostgreSQL
- **Frontend:** Next.js 14, TypeScript, Tailwind CSS
- **Auth:** JWT tabanlı kimlik doğrulama
- **Deploy:** Railway (backend + DB), Vercel (frontend)

## İş Modeli

B2B SaaS — stüdyo odası bazında aylık abonelik

## Portlar

- Backend: 4039
- Frontend: 3039

## Demo Hesap

- E-posta: demo@modastudyo.com
- Şifre: demo123456
