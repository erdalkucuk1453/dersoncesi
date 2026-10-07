# DersÖncesi – Akıllı Derse Hazırlık Platformu

> **"Derse sıfırdan başlama. Ön bilgini oluştur, derse hazır gel."**  
> **"Ders başlamadan önce sınıfının ne kadar hazır olduğunu gör."**

**DersÖncesi**, Millî Eğitim Bakanlığı (MEB) **Türkiye Yüzyılı Maarif Modeli** öğretim programlarına (%100 MEB müfredatına sadık) tam uyumlu olarak geliştirilmiş; ortaokul (5, 6, 7 ve 8. sınıf) öğrencilerinin yeni bir konuya ilişkin temel ön bilgiyi edinmelerini ve öğretmenlerin sınıf hazır bulunuşluk düzeyini dersten önce analiz etmelerini sağlayan akıllı web platformudur.

Bu uygulama klasik bir ödev sitesi veya salt test çözme platformu değildir. Temel pedagojik amacı: **Öğrenciye konuyu dersten önce tamamen öğretmek değil; sınıfta öğretmenin anlatacağı yeni konuyu rahatça takip edebilmesi için gerekli kavramsal hazır bulunuşluğu oluşturmaktır.**

---

## 🎯 Temel Özellikler

1. **%100 Resmî MEB Maarif Modeli Müfredatı:**
   - [MEB TYMM Temel Eğitim Programı](https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim) referans alınmıştır.
   - 5, 6, 7 ve 8. sınıf Türkçe, Matematik, Fen Bilimleri, İngilizce, Sosyal Bilgiler, T.C. İnkılap Tarihi ve Atatürkçülük (yalnızca 8. sınıf) ve Din Kültürü ve Ahlak Bilgisi derslerini kapsar.
   - Resmî MEB kodları (`FEN.7.1.1`, `MAT.7.1.1` vb.) ve süreç bileşenleri korunur; asla sahte/uydurma kazanım barındırmaz.

2. **Öğretmen Kontrol Kilidi (Mandatory Teacher Approval):**
   - Sistem tarafından MEB çıktılarına bağlı olarak oluşturulan hiçbir içerik doğrudan öğrenciye yayınlanmaz.
   - Önce `DRAFT` (Taslak) durumunda kalır. Öğretmen özeti okur, soruları düzenler/ekler/siler ve **"Onayla ve Yayınla"** butonuyla süreci başlatır.

3. **6 Aşamalı "Derse Hazırlık Yolu":**
   - **Aşama 1: Konuya Giriş** (Yarın derste ne öğreneceğiz? Motivasyon cümlesi)
   - **Aşama 2: Kısa Konu Özeti** (3–5 dakikalık sade metin, temel terimler, basit örnek, "Bunu Bilmen Yeterli" bölümü)
   - **Aşama 3: "Okudum ve Anladım"** (Zorunlu onay kilidi; zaman damgası kaydı)
   - **Aşama 4: Ön Bilgi Kontrol Çalışması** (Çoktan seçmeli, Doğru/Yanlış, Boşluk doldurma, Eşleştirme soru motoru)
   - **Aşama 5: Anında Puanlama & Eşik Denetimi** (Örn: %70 başarı kriteri)
   - **Aşama 6: "Derse Hazırsın!" / "Tekrar Bakmanı Öneriyoruz"** (Cezalandırıcı olmayan dil, yanlış yapılan kavrama yönlendirme ve tekrar hakkı)

4. **Yarınki Derse Hazırlık Raporu & Canlı Öğrenme Takibi:**
   - Sınıf hazır bulunuşluk oranı (Örn: %68)
   - En çok zorlanılan sorular ve hata yüzdeleri (Örn: Soru 4 -> %46 hata)
   - Öğretmene ertesi günkü ders başlangıcı için nokta atışı pedagojik öneri.

5. **KVKK Uyumlu ve Güvenli:**
   - Minimum veri ilkesi: T.C. kimlik numarası, açık adres veya telefon toplanmaz.
   - Rol Bazlı Erişim Denetimi (RBAC: `TEACHER`, `STUDENT`), bcryptjs parola şifreleme ve güvenli JWT HttpOnly çerez oturumu.

---

## 🛠️ Kullanılan Teknolojiler

- **Frontend:** Next.js (App Router), React 19, TypeScript, Tailwind CSS, Lucide React, Canvas-Confetti
- **Backend & API:** Next.js Server Actions & Route Handlers, JWT (`jose`), `bcryptjs`
- **Veritabanı & ORM:** Prisma ORM
  - *Geliştirme / Yerel Ortam:* SQLite (`file:./dev.db` - Sıfır ek kurulumla çalışır)
  - *Production / Vercel:* PostgreSQL (Neon / Supabase / Vercel Postgres)
- **Dağıtım:** Vercel & GitHub

---

## 🚀 Yerel Kurulum (Local Setup)

### 1. Depoyu Klonlayın
```bash
git clone https://github.com/kullanici-adi/dersoncesi.git
cd dersoncesi
```

### 2. Bağımlılıkları Yükleyin
```bash
npm install
```

### 3. Çevre Değişkenlerini Ayarlayın
`.env.example` dosyasını kopyalayarak `.env` oluşturun:
```bash
cp .env.example .env
```
*(Windows PowerShell için: `Copy-Item .env.example .env`)*

İçerik varsayılan olarak yerel SQLite veritabanına ayarlıdır:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="ders-oncesi-guvenli-jwt-anahtari-2026-super-secret-key-32-chars-long"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Veritabanını Senkronize Edin ve Tohumlayın (Seed)
```bash
# Tabloları oluştur
npx prisma db push

# MEB Maarif Modeli kazanımlarını ve demo hesapları yükle
npm run db:seed
```

### 5. Geliştirme Sunucusunu Başlatın
```bash
npm run dev
```
Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresine gidin.

---

## 🔑 Demo Hesaplar (Tek Tıkla Giriş Destekli)

Uygulamanın giriş ekranında (`/auth/login`) bulunan tek tıkla demo butonları ile şifre yazmadan anında test edebilirsiniz:

| Rol | E-posta | Şifre | Açıklama |
|:---|:---|:---|:---|
| **Öğretmen** | `ogretmen@demo.com` | `ogretmen123` | 2 sınıfı (7/A, 8/B), yayında ve taslak görevleri tanımlı |
| **Öğrenci** | `ogrenci@demo.com` | `ogrenci123` | Zeynep Yılmaz – 7/A ve 8/B öğrencisi, görevleri atanmış |
| **Öğrenci 2** | `ali@demo.com` | `ogrenci123` | Ali Demir – Tekrar gerekli durumundaki öğrenci |
| **Öğrenci 3** | `ayse@demo.com` | `ogrenci123` | Ayşe Kaya – Konu özeti okuyor durumunda |
| **Öğrenci 4** | `mehmet@demo.com` | `ogrenci123` | Mehmet Çelik – Başlamadı durumunda |
| **Öğrenci 5** | `elif@demo.com` | `ogrenci123` | Elif Şahin – Derse hazır durumunda |

---

## 🧪 Testleri Çalıştırma

Tüm 17 adımlı uçtan uca öğretmen/öğrenci akışını ve yetkilendirme doğrulamalarını test etmek için:

```bash
npx tsx test-flow.ts
```

---

## 📦 Projeyi Derleme (Build)

```bash
npm run build
```
Derleme işlemi Prisma istemcisini oluşturur ve tüm Next.js sayfalarını hatasız biçimde optimize eder.

---

## 🌐 Vercel Deployment

1. Projeyi GitHub reponuza push edin:
   ```bash
   git add .
   git commit -m "DersÖncesi Platformu hazir"
   git push origin main
   ```
2. [Vercel Dashboard](https://vercel.com) üzerinde **Add New Project** diyerek reponuzu bağlayın.
3. Vercel üzerinde PostgreSQL veritabanı (Vercel Postgres, Neon veya Supabase) oluşturun ve Environment Variables alanına ekleyin:
   - `DATABASE_URL`: `postgresql://user:password@host:5432/dersoncesi?sslmode=require`
   - `JWT_SECRET`: Güçlü rastgele 32+ karakterlik gizli anahtar
   - `NEXT_PUBLIC_APP_URL`: Vercel domain adresiniz (örn: `https://dersoncesi.vercel.app`)
4. Production PostgreSQL bağlantısında `prisma/schema.prisma` dosyasındaki `provider = "sqlite"` satırını `provider = "postgresql"` olarak güncelleyip push edin veya Vercel build komutunu çalıştırın.
5. Dağıtım sonrasında tohum verilerini yüklemek için:
   ```bash
   npx prisma db push
   npx tsx prisma/seed.ts
   ```

---

## 📄 Lisans ve Telif

Bu proje Millî Eğitim Bakanlığı Türkiye Yüzyılı Maarif Modeli vizyonu doğrultusunda eğitimde hazır bulunuşluğu artırmak amacıyla geliştirilmiştir. Resmî öğretim programı kazanımları T.C. Millî Eğitim Bakanlığı'na aittir.
