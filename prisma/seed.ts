import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 8. Sınıf MEB Çerçeve Yıllık Plan Veritabanı Kurulumu Başlatılıyor...");

  // Parola hashleme
  const teacherPasswordHash = await bcrypt.hash("ogretmen123", 10);
  const studentPasswordHash = await bcrypt.hash("ogrenci123", 10);

  // Eski 5, 6, 7. sınıf kazanımlarını temizle
  try {
    await prisma.curriculumOutcome.deleteMany({
      where: {
        grade: { not: 8 },
      },
    });
    console.log("✓ Sadece 8. sınıf kazanımları tutulacak şekilde eski alt sınıf kayıtları temizlendi.");
  } catch (err) {
    console.log("Not: Eski kayıt temizleme atlandı veya tablo boş.");
  }

  // 1. MEB 8. SINIF ÇERÇEVE YILLIK PLAN KAZANIMLARI (Yüklenen Planlardan Birebir)
  const outcomesData = [
    // ==========================================
    // 1. DİN KÜLTÜRÜ VE AHLAK BİLGİSİ (8. SINIF)
    // ==========================================
    {
      subject: "Din Kültürü ve Ahlak Bilgisi",
      grade: 8,
      unitOrTheme: "1. KADER İNANCI",
      outcomeCode: "DİN.8.1.1",
      outcomeText: "Kader ve kaza inancını ayet ve hadislerle açıklar.",
      processComponents: "Allah'ın (cc) her şeyi bir ölçüye göre yaratması, Sünnetullah kavramı kapsamında fiziksel, biyolojik ve toplumsal yasalar.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "Din Kültürü ve Ahlak Bilgisi",
      grade: 8,
      unitOrTheme: "1. KADER İNANCI",
      outcomeCode: "DİN.8.1.2",
      outcomeText: "İnsanın ilmi, iradesi, sorumluluğu ile kader arasında ilişki kurar.",
      processComponents: "Küllî irade (Allah'ın mutlak iradesi) ve cüzî irade (insanın seçme özgürlüğü) ayrımı ve eylemlerden sorumluluk.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "Din Kültürü ve Ahlak Bilgisi",
      grade: 8,
      unitOrTheme: "1. KADER İNANCI",
      outcomeCode: "DİN.8.1.3",
      outcomeText: "Kaza ve kader ile ilgili kavramları analiz eder.",
      processComponents: "Ecel, ömür, rızık, tevekkül, başarı, başarısızlık, sağlık ve hastalık kavramları kaderle ilişkilendirilir.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "Din Kültürü ve Ahlak Bilgisi",
      grade: 8,
      unitOrTheme: "1. KADER İNANCI",
      outcomeCode: "DİN.8.1.4",
      outcomeText: "Toplumda kader ve kaza ile ilgili yaygın olan yanlış anlayışları sorgular.",
      processComponents: "Alın yazısı, kara talih, baht, kısmetsizlik gibi kalıp yargılar ve gerekli tedbirlerin alınmaması eleştirel gözle sorgulanır.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "Din Kültürü ve Ahlak Bilgisi",
      grade: 8,
      unitOrTheme: "1. KADER İNANCI",
      outcomeCode: "DİN.8.1.5",
      outcomeText: "Hz. Musa’nın (a.s.) hayatını ana hatlarıyla tanır.",
      processComponents: "Hz. Harun (as), Firavun ile tevhid mücadelesi, A'raf, Taha ve Kasas surelerindeki ayetler ışığında ele alınır.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "Din Kültürü ve Ahlak Bilgisi",
      grade: 8,
      unitOrTheme: "1. KADER İNANCI",
      outcomeCode: "DİN.8.1.6",
      outcomeText: "Ayetelkürsi’yi okur, anlamını söyler.",
      processComponents: "Ayetelkürsi'nin fazileti, ayette verilen tevhid mesajları ve nerelerde okunduğu.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "Din Kültürü ve Ahlak Bilgisi",
      grade: 8,
      unitOrTheme: "2. ZEKÂT VE SADAKA",
      outcomeCode: "DİN.8.2.1",
      outcomeText: "İslam’ın paylaşma ve yardımlaşmaya verdiği önemi ayet ve hadisler ışığında yorumlar.",
      processComponents: "İslam'da yardımlaşmanın önemi, kardeşlik bağı ve toplumsal dayanışma.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "Din Kültürü ve Ahlak Bilgisi",
      grade: 8,
      unitOrTheme: "2. ZEKÂT VE SADAKA",
      outcomeCode: "DİN.8.2.2",
      outcomeText: "Zekât ve sadaka ibadetini ayet ve hadislerle açıklar.",
      processComponents: "Nisap miktarı, zekât verecek ve zekât verilecek kimseler, öşür ve sadaka-i cariye.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "Din Kültürü ve Ahlak Bilgisi",
      grade: 8,
      unitOrTheme: "2. ZEKÂT VE SADAKA",
      outcomeCode: "DİN.8.2.3",
      outcomeText: "Zekât, infak ve sadakanın bireysel ve toplumsal önemini fark eder.",
      processComponents: "İnfak kültürü, cimrilikten arınma, fakirlik ve sosyal eşitsizliklerin giderilmesinde rolü.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "Din Kültürü ve Ahlak Bilgisi",
      grade: 8,
      unitOrTheme: "2. ZEKÂT VE SADAKA",
      outcomeCode: "DİN.8.2.4",
      outcomeText: "Hz. Şuayb’in (as) hayatını ana hatlarıyla tanır.",
      processComponents: "Medyen halkı, ölçü ve tartıda hile yapmama duyarlılığı ve dürüst ticaret ahlakı.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "Din Kültürü ve Ahlak Bilgisi",
      grade: 8,
      unitOrTheme: "2. ZEKÂT VE SADAKA",
      outcomeCode: "DİN.8.2.5",
      outcomeText: "Maun suresini okur, anlamını söyler.",
      processComponents: "Yetim ve yoksulu gözetme, gösterişten (riya) sakınma ve namazın ahlaki sorumluluğu.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "Din Kültürü ve Ahlak Bilgisi",
      grade: 8,
      unitOrTheme: "3. DİN VE HAYAT",
      outcomeCode: "DİN.8.3.1",
      outcomeText: "Din, birey ve toplum arasındaki ilişkiyi yorumlar.",
      processComponents: "İslam dininin inanç, ibadet ve ahlak esaslarının bireysel ve toplumsal huzura katkısı.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "Din Kültürü ve Ahlak Bilgisi",
      grade: 8,
      unitOrTheme: "3. DİN VE HAYAT",
      outcomeCode: "DİN.8.3.2",
      outcomeText: "İslam dininin can, nesil, akıl, mal ve din emniyetiyle ilgili hedeflerini analiz eder.",
      processComponents: "Zarurat-ı hamse: İş sağlığı (can), haksız kazanç ve israf (mal), zararlı alışkanlıklar (akıl), aile kurumu (nesil).",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "Din Kültürü ve Ahlak Bilgisi",
      grade: 8,
      unitOrTheme: "3. DİN VE HAYAT",
      outcomeCode: "DİN.8.3.3",
      outcomeText: "Hz. Yusuf’un (a.s.) örnek hayatından ilkeler çıkarır.",
      processComponents: "Kuyu, saray ve zindan imtihanları, iffet, doğruluk, sabır ve affedicilik.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "Din Kültürü ve Ahlak Bilgisi",
      grade: 8,
      unitOrTheme: "3. DİN VE HAYAT",
      outcomeCode: "DİN.8.3.4",
      outcomeText: "Asr suresini okur, anlamını söyler.",
      processComponents: "Zamanın önemi, hüsrandan kurtulmanın 4 şartı: İman, salih amel, hakkı tavsiye ve sabrı tavsiye.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "Din Kültürü ve Ahlak Bilgisi",
      grade: 8,
      unitOrTheme: "4. HZ. MUHAMMED’İN ÖRNEKLİĞİ",
      outcomeCode: "DİN.8.4.1",
      outcomeText: "Hz. Muhammed’in (sav) doğruluğu ve güvenilir kişiliği ile peygamberlerin özellikleri arasında ilişki kurar.",
      processComponents: "Muhammedü'l-Emin sıfatı, sıdk, emanet, doğruluktan hiçbir zaman ayrılmama.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "Din Kültürü ve Ahlak Bilgisi",
      grade: 8,
      unitOrTheme: "4. HZ. MUHAMMED’İN ÖRNEKLİĞİ",
      outcomeCode: "DİN.8.4.2",
      outcomeText: "Hz. Muhammed’in (sav) merhametli ve affedici oluşunu davranışlarında yansıtır.",
      processComponents: "Taif yolculuğunda merhameti, Mekke fethindeki genel af, çocuklara ve hayvanlara şefkati.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "Din Kültürü ve Ahlak Bilgisi",
      grade: 8,
      unitOrTheme: "4. HZ. MUHAMMED’İN ÖRNEKLİĞİ",
      outcomeCode: "DİN.8.4.3",
      outcomeText: "Hz. Muhammed’in (sav) istişareye verdiği önemi ortaya koyan olaylardan çıkarımlarda bulunur.",
      processComponents: "Bedir, Uhud ve Hendek savaşlarındaki danışma meclisleri ve ortak akıl prensibi.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "Din Kültürü ve Ahlak Bilgisi",
      grade: 8,
      unitOrTheme: "4. HZ. MUHAMMED’İN ÖRNEKLİĞİ",
      outcomeCode: "DİN.8.4.4",
      outcomeText: "Hz. Muhammed’in davasındaki cesaret ve kararlılığını örnek olaylarla açıklar.",
      processComponents: "'Güneşi sağ elime, ayı sol elime verseler de davamdan vazgeçmem' kararlılığı.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "Din Kültürü ve Ahlak Bilgisi",
      grade: 8,
      unitOrTheme: "5. KUR’AN-I KERİM VE ÖZELLİKLERİ",
      outcomeCode: "DİN.8.5.1",
      outcomeText: "İslam dininin temel kaynaklarını tanır.",
      processComponents: "Kur'an-ı Kerim ve Hz. Muhammed'in sünneti, sünnetin dindeki açıklayıcı konumu.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "Din Kültürü ve Ahlak Bilgisi",
      grade: 8,
      unitOrTheme: "5. KUR’AN-I KERİM VE ÖZELLİKLERİ",
      outcomeCode: "DİN.8.5.2",
      outcomeText: "Ayetlerden hareketle Kur’an’ın ana konularını sınıflandırır.",
      processComponents: "İnanç, ibadet, ahlak, sosyal hayat (muamelat) ve kıssalar.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "Din Kültürü ve Ahlak Bilgisi",
      grade: 8,
      unitOrTheme: "5. KUR’AN-I KERİM VE ÖZELLİKLERİ",
      outcomeCode: "DİN.8.5.3",
      outcomeText: "Kur’an-ı Kerim’in temel özelliklerini değerlendirir.",
      processComponents: "Hidayet kaynağı oluşu, insanı düşünmeye ve aklını kullanmaya teşvik etmesi.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "Din Kültürü ve Ahlak Bilgisi",
      grade: 8,
      unitOrTheme: "5. KUR’AN-I KERİM VE ÖZELLİKLERİ",
      outcomeCode: "DİN.8.5.4",
      outcomeText: "Hz. Nuh’un (a.s.) tevhide davetini özetler.",
      processComponents: "Yunus, Hud ve Nuh surelerindeki ayetler ışığında gemi inşası ve tevhid çağrısı.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },

    // ==========================================
    // 2. FEN BİLİMLERİ (8. SINIF)
    // ==========================================
    {
      subject: "Fen Bilimleri",
      grade: 8,
      unitOrTheme: "1.ÜNİTE: MEVSİMLER VE İKLİM",
      outcomeCode: "F.8.1.1.1",
      outcomeText: "Mevsimlerin oluşumuna yönelik tahminlerde bulunur.",
      processComponents: "Dünya'nın dönme ekseni eğikliği (23° 27'), Güneş etrafında dolanma düzlemi ve birim yüzeye düşen ışık enerjisi.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "Fen Bilimleri",
      grade: 8,
      unitOrTheme: "1.ÜNİTE: MEVSİMLER VE İKLİM",
      outcomeCode: "F.8.1.2.1",
      outcomeText: "İklim ve hava olayları arasındaki farkı açıklar.",
      processComponents: "Kısa süreli atmosferik hava olayları ile geniş bölgede uzun yıllar boyunca süregelen iklim farkı.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "Fen Bilimleri",
      grade: 8,
      unitOrTheme: "1.ÜNİTE: MEVSİMLER VE İKLİM",
      outcomeCode: "F.8.1.2.2",
      outcomeText: "İklim biliminin (klimatoloji) bir bilim dalı olduğunu ve iklim bilimci (klimatolog) adını açıklar.",
      processComponents: "Meteoroloji ve meteorolog ile klimatoloji ve klimatolog arasındaki çalışma alanı farkı.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "Fen Bilimleri",
      grade: 8,
      unitOrTheme: "2.ÜNİTE: DNA VE GENETİK KOD",
      outcomeCode: "F.8.2.1.1",
      outcomeText: "Nükleotid, gen, DNA ve kromozom kavramlarını açıklayarak aralarında ilişki kurar.",
      processComponents: "Karmaşıktan basite: Kromozom > DNA > Gen > Nükleotid (KEDİGENİ). Nükleotid yapısı: Fosfat + Deoksiriboz Şeker + Organik Baz.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "Fen Bilimleri",
      grade: 8,
      unitOrTheme: "2.ÜNİTE: DNA VE GENETİK KOD",
      outcomeCode: "F.8.2.1.2",
      outcomeText: "DNA’nın yapısını model üzerinde gösterir.",
      processComponents: "Çift zincirli sarmal yapı, Adenin ile Timin, Guanin ile Sitozin eşleşmesi kuralı.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "Fen Bilimleri",
      grade: 8,
      unitOrTheme: "2.ÜNİTE: DNA VE GENETİK KOD",
      outcomeCode: "F.8.2.1.3",
      outcomeText: "DNA’nın kendini nasıl eşlediğini ifade eder.",
      processComponents: "Fermuar gibi açılma, sitoplazmadan çekirdeğe serbest nükleotid girişi ve 2 özdeş DNA molekülü oluşması.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "Fen Bilimleri",
      grade: 8,
      unitOrTheme: "2.ÜNİTE: DNA VE GENETİK KOD",
      outcomeCode: "F.8.2.2.1",
      outcomeText: "Kalıtım ile ilgili kavramları tanımlar.",
      processComponents: "Gen, fenotip, genotip, saf döl (homozigot), melez döl (heterozigot), baskın gen (dominant) ve çekinik gen (resesif).",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "Fen Bilimleri",
      grade: 8,
      unitOrTheme: "2.ÜNİTE: DNA VE GENETİK KOD",
      outcomeCode: "F.8.2.2.2",
      outcomeText: "Tek karakter çaprazlamaları ile ilgili problemler çözerek sonuçlar hakkında yorum yapar.",
      processComponents: "Mendel bezelye çaprazlamaları (mor-beyaz çiçek vb.), genotip ve fenotip oranları, insanda cinsiyet oluşumu (XX, XY).",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "Fen Bilimleri",
      grade: 8,
      unitOrTheme: "2.ÜNİTE: DNA VE GENETİK KOD",
      outcomeCode: "F.8.2.2.3",
      outcomeText: "Akraba evliliklerinin genetik sonuçlarını tartışır.",
      processComponents: "Çekinik genlerle taşınan kalıtsal hastalıkların bir araya gelme olasılığının artması.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "Fen Bilimleri",
      grade: 8,
      unitOrTheme: "2.ÜNİTE: DNA VE GENETİK KOD",
      outcomeCode: "F.8.2.3.1",
      outcomeText: "Örneklerden yola çıkarak mutasyonu açıklar.",
      processComponents: "DNA gen dizilimindeki kalıcı değişimler (Albinoluk, hemofili, altı parmaklılık, Van kedisi gözleri).",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "Fen Bilimleri",
      grade: 8,
      unitOrTheme: "2.ÜNİTE: DNA VE GENETİK KOD",
      outcomeCode: "F.8.2.3.2",
      outcomeText: "Örneklerden yola çıkarak modifikasyonu açıklar.",
      processComponents: "Çevresel faktörlerle gen işleyişinde meydana gelen kalıtsal olmayan değişimler (Çuha çiçeği, arı sütü ile kraliçe arı, kas geliştirme).",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "Fen Bilimleri",
      grade: 8,
      unitOrTheme: "2.ÜNİTE: DNA VE GENETİK KOD",
      outcomeCode: "F.8.2.4.1",
      outcomeText: "Canlıların yaşadıkları çevreye uyumlarını gözlem yaparak açıklar.",
      processComponents: "Adaptasyonların kalıtsal olduğu, yaşama ve üreme şansını artırdığı (Kutup ayısı kürk rengi, kaktüsün su depolaması, kamuflaj).",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "Fen Bilimleri",
      grade: 8,
      unitOrTheme: "2.ÜNİTE: DNA VE GENETİK KOD",
      outcomeCode: "F.8.2.5.1",
      outcomeText: "Genetik mühendisliğini ve biyoteknolojiyi ilişkilendirir.",
      processComponents: "Islah, aşılama, gen aktarımı, klonlama (Dolly), gen tedavisi ve insülin hormonu üretimi örnekleri.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "Fen Bilimleri",
      grade: 8,
      unitOrTheme: "3.ÜNİTE: BASINÇ",
      outcomeCode: "F.8.3.1.1",
      outcomeText: "Katı basıncını etkileyen değişkenleri deneyerek keşfeder.",
      processComponents: "Basınç birimi Pascal (Pa), basıncın uygulanan dik kuvvetle doğru, temas yüzey alanıyla ters orantılı olduğu.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "Fen Bilimleri",
      grade: 8,
      unitOrTheme: "3.ÜNİTE: BASINÇ",
      outcomeCode: "F.8.3.1.2",
      outcomeText: "Sıvı basıncını etkileyen değişkenleri tahmin eder ve tahminlerini test eder.",
      processComponents: "Sıvı basıncının derinlik (h) ve sıvı yoğunluğu (d) ile doğru orantılı olduğu; açık hava basıncı (Torriçelli deneyi).",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "Fen Bilimleri",
      grade: 8,
      unitOrTheme: "3.ÜNİTE: BASINÇ",
      outcomeCode: "F.8.3.1.3",
      outcomeText: "Katı, sıvı ve gazların basınç özelliklerinin günlük yaşam ve teknolojideki uygulamalarına örnekler verir.",
      processComponents: "Pascal prensibi, hidrolik frenler, itfaiye merdivenleri, berber koltukları ve uçağın kanat yapısı.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "Fen Bilimleri",
      grade: 8,
      unitOrTheme: "4.ÜNİTE: MADDE VE ENDÜSTRİ",
      outcomeCode: "F.8.4.1.1",
      outcomeText: "Periyodik sistemde, grup ve periyotların nasıl oluşturulduğunu açıklar.",
      processComponents: "Artan atom numarasına göre dizilim, periyot (katman sayısı), grup (son katmandaki değerlik elektron sayısı).",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "Fen Bilimleri",
      grade: 8,
      unitOrTheme: "4.ÜNİTE: MADDE VE ENDÜSTRİ",
      outcomeCode: "F.8.4.1.2",
      outcomeText: "Elementleri periyodik tablo üzerinde metal, yarımetal ve ametal olarak sınıflandırır.",
      processComponents: "Metallerin ısı/elektrik iletkenliği, ametallerin matlığı, soygazların (8A) kararlı yapısı.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "Fen Bilimleri",
      grade: 8,
      unitOrTheme: "4.ÜNİTE: MADDE VE ENDÜSTRİ",
      outcomeCode: "F.8.4.2.1",
      outcomeText: "Fiziksel ve kimyasal değişim arasındaki farkları, çeşitli olayları gözlemleyerek açıklar.",
      processComponents: "Kırılma, erime, buharlaşma (fiziksel); yanma, paslanma, mayalanma, çürüme (kimyasal - yeni madde oluşumu).",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "Fen Bilimleri",
      grade: 8,
      unitOrTheme: "4.ÜNİTE: MADDE VE ENDÜSTRİ",
      outcomeCode: "F.8.4.3.1",
      outcomeText: "Bileşiklerin kimyasal tepkime sonucunda oluştuğunu bilir.",
      processComponents: "Kütlenin korunumu kanunu: Giren maddelerin kütleleri toplamı çıkan ürünlerin kütleleri toplamına eşittir.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "Fen Bilimleri",
      grade: 8,
      unitOrTheme: "4.ÜNİTE: MADDE VE ENDÜSTRİ",
      outcomeCode: "F.8.4.4.1",
      outcomeText: "Asit ve bazların genel özelliklerini ifade eder.",
      processComponents: "Asitler: Tadı ekşi, pH < 7, suya H+ iyonu verir; Bazlar: Tadı acı, kaygan, pH > 7, suya OH- iyonu verir.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "Fen Bilimleri",
      grade: 8,
      unitOrTheme: "4.ÜNİTE: MADDE VE ENDÜSTRİ",
      outcomeCode: "F.8.4.4.4",
      outcomeText: "Maddelerin asitlik ve bazlık durumlarına ilişkin pH değerlerini kullanarak çıkarımda bulunur.",
      processComponents: "pH ölçeği (0-14): 7 nötr (saf su), 0'a yaklaştıkça asitlik artar, 14'e yaklaştıkça bazlık artar.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "Fen Bilimleri",
      grade: 8,
      unitOrTheme: "4.ÜNİTE: MADDE VE ENDÜSTRİ",
      outcomeCode: "F.8.4.5.1",
      outcomeText: "Isınmanın maddenin cinsine, kütlesine ve/veya sıcaklık değişimine bağlı olduğunu deney yaparak keşfeder.",
      processComponents: "Öz ısı (c) kavramı: Öz ısısı küçük olan maddeler çabuk ısınır ve çabuk soğur.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "Fen Bilimleri",
      grade: 8,
      unitOrTheme: "5.ÜNİTE: BASİT MAKİNELER",
      outcomeCode: "F.8.5.1.1",
      outcomeText: "Basit makinelerin sağladığı avantajları örnekler üzerinden açıklar.",
      processComponents: "Sabit makara, hareketli makara, palanga, kaldıraç, eğik düzlem ve çıkrık. Basit makinelerde işten ve enerjiden kazanç YOKTUR, kuvvetten veya yoldan kazanç vardır.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "Fen Bilimleri",
      grade: 8,
      unitOrTheme: "6.ÜNİTE: ENERJİ DÖNÜŞÜMLERİ VE ÇEVRE BİLİMİ",
      outcomeCode: "F.8.6.1.1",
      outcomeText: "Besin zincirindeki üretici, tüketici, ayrıştırıcılara örnekler verir.",
      processComponents: "Ekoloji piramidi: Üreticiden tüketiciye aktarılan enerji azalır (%10 kuralı), biyolojik birikim artar.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "Fen Bilimleri",
      grade: 8,
      unitOrTheme: "6.ÜNİTE: ENERJİ DÖNÜŞÜMLERİ VE ÇEVRE BİLİMİ",
      outcomeCode: "F.8.6.2.1",
      outcomeText: "Bitkilerde besin üretiminde fotosentezin önemini fark eder.",
      processComponents: "Kloroplast organelinde karbondioksit + su + ışık enerjisi kullanılarak besin (glikoz) ve oksijen üretilir.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "Fen Bilimleri",
      grade: 8,
      unitOrTheme: "6.ÜNİTE: ENERJİ DÖNÜŞÜMLERİ VE ÇEVRE BİLİMİ",
      outcomeCode: "F.8.6.2.3",
      outcomeText: "Canlılarda solunumun önemini belirtir.",
      processComponents: "Hücresel solunum (oksijenli ve oksijensiz solunum) ile besin parçalanarak hücrenin enerji birimi olan ATP üretilir.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "Fen Bilimleri",
      grade: 8,
      unitOrTheme: "7.ÜNİTE: ELEKTRİK YÜKLERİ VE ELEKTRİK ENERJİSİ",
      outcomeCode: "F.8.7.1.2",
      outcomeText: "Elektrik yüklerini sınıflandırarak aynı ve farklı cins elektrik yüklerinin birbirlerine etkisini açıklar.",
      processComponents: "Pozitif ve negatif yükler. Aynı cins yükler birbirini iter (+ / +, - / -), farklı cins yükler birbirini çeker (+ / -).",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "Fen Bilimleri",
      grade: 8,
      unitOrTheme: "7.ÜNİTE: ELEKTRİK YÜKLERİ VE ELEKTRİK ENERJİSİ",
      outcomeCode: "F.8.7.2.1",
      outcomeText: "Cisimleri, sahip oldukları elektrik yükleri bakımından sınıflandırır.",
      processComponents: "Nötr cisim (pozitif ve negatif yük sayıları eşit olan cisim), elektroskop yapısı ve yük testi.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },

    // ==========================================
    // 3. MATEMATİK (8. SINIF)
    // ==========================================
    {
      subject: "Matematik",
      grade: 8,
      unitOrTheme: "M.8.1. SAYILAR VE İŞLEMLER",
      outcomeCode: "M.8.1.1.1",
      outcomeText: "Verilen pozitif tam sayıların pozitif tam sayı çarpanlarını bulur, asal çarpanlarını üslü ifadelerin çarpımı şeklinde yazar.",
      processComponents: "Çarpan ağacı ve asal bölen listesi yöntemleri, pozitif bölenlerin sayısı.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "Matematik",
      grade: 8,
      unitOrTheme: "M.8.1. SAYILAR VE İŞLEMLER",
      outcomeCode: "M.8.1.1.2",
      outcomeText: "İki doğal sayının en büyük ortak bölenini (EBOB) ve en küçük ortak katını (EKOK) hesaplar, ilgili problemleri çözer.",
      processComponents: "Parçalama/bölme durumlarında EBOB, birleştirme/katlama durumlarında EKOK kullanımı.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "Matematik",
      grade: 8,
      unitOrTheme: "M.8.1. SAYILAR VE İŞLEMLER",
      outcomeCode: "M.8.1.1.3",
      outcomeText: "Verilen iki doğal sayının aralarında asal olup olmadığını belirler.",
      processComponents: "1'den başka ortak pozitif böleni olmayan sayılar (ör: 8 ve 15 aralarında asaldır).",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "Matematik",
      grade: 8,
      unitOrTheme: "M.8.1. SAYILAR VE İŞLEMLER",
      outcomeCode: "M.8.1.2.1",
      outcomeText: "Tam sayıların, tam sayı kuvvetlerini hesaplar.",
      processComponents: "Negatif üs kavramı: a^(-n) = 1 / a^n, sıfırıncı kuvvet ve parantezli negatif taban kuralları.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "Matematik",
      grade: 8,
      unitOrTheme: "M.8.1. SAYILAR VE İŞLEMLER",
      outcomeCode: "M.8.1.2.2",
      outcomeText: "Üslü ifadelerle ilgili temel kuralları anlar, birbirine denk ifadeler oluşturur.",
      processComponents: "Tabanlar aynıysa çarparken üsler toplanır, bölerken üsler çıkarılır. Üssün üssü çarpılır.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "Matematik",
      grade: 8,
      unitOrTheme: "M.8.1. SAYILAR VE İŞLEMLER",
      outcomeCode: "M.8.1.2.5",
      outcomeText: "Çok büyük ve çok küçük sayıları bilimsel gösterimle ifade eder ve karşılaştırır.",
      processComponents: "a x 10^n biçiminde 1 <= |a| < 10 şartı ile gösterim.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "Matematik",
      grade: 8,
      unitOrTheme: "M.8.1. SAYILAR VE İŞLEMLER",
      outcomeCode: "M.8.1.3.1",
      outcomeText: "Tamkare pozitif tam sayılarla bu sayıların karekökleri arasındaki ilişkiyi belirler.",
      processComponents: "Alanı verilen karenin bir kenar uzunluğunu bulma ile karekök alma ilişkisi (√144 = 12).",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "Matematik",
      grade: 8,
      unitOrTheme: "M.8.1. SAYILAR VE İŞLEMLER",
      outcomeCode: "M.8.1.3.2",
      outcomeText: "Tam kare olmayan kareköklü bir sayının hangi iki doğal sayı arasında olduğunu belirler.",
      processComponents: "√31 sayısının √25=5 ile √36=6 arasında ve 6'ya daha yakın olduğunu bulma.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "Matematik",
      grade: 8,
      unitOrTheme: "M.8.1. SAYILAR VE İŞLEMLER",
      outcomeCode: "M.8.1.3.3",
      outcomeText: "Kareköklü bir ifadeyi a√b şeklinde yazar ve a√b şeklindeki ifadede katsayıyı kök içine alır.",
      processComponents: "√72 = √(36x2) = 6√2, kök dışına çıkarma ve kök içine karesini alarak sokma.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "Matematik",
      grade: 8,
      unitOrTheme: "M.8.1. SAYILAR VE İŞLEMLER",
      outcomeCode: "M.8.1.3.4",
      outcomeText: "Kareköklü ifadelerde çarpma ve bölme işlemlerini yapar.",
      processComponents: "Katsayılar katsayılarla, kök içleri kök içleriyle çarpılır ve bölünür.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "Matematik",
      grade: 8,
      unitOrTheme: "M.8.1. SAYILAR VE İŞLEMLER",
      outcomeCode: "M.8.1.3.8",
      outcomeText: "Gerçek sayıları tanır, rasyonel ve irrasyonel sayılarla ilişkilendirir.",
      processComponents: "Kökten çıkamayan sayılar (√2, √3) ve π sayısı irrasyoneldir. Rasyonel ve irrasyoneller gerçek sayıları oluşturur.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "Matematik",
      grade: 8,
      unitOrTheme: "M.8.5. OLASILIK",
      outcomeCode: "M.8.5.1.4",
      outcomeText: "Olasılık değerinin 0 ile 1 arasında (0 ve 1 dâhil) olduğunu anlar.",
      processComponents: "İmkânsız olayın olasılığı 0, kesin olayın olasılığı 1'dir. Bir olayın olma olasılığı + olmama olasılığı = 1.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "Matematik",
      grade: 8,
      unitOrTheme: "M.8.2. CEBİR",
      outcomeCode: "M.8.2.1.3",
      outcomeText: "Özdeşlikleri modellerle açıklar.",
      processComponents: "(a+b)^2 = a^2 + 2ab + b^2, (a-b)^2 = a^2 - 2ab + b^2 ve iki kare farkı a^2 - b^2 = (a-b)(a+b).",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "Matematik",
      grade: 8,
      unitOrTheme: "M.8.2. CEBİR",
      outcomeCode: "M.8.2.1.4",
      outcomeText: "Cebirsel ifadeleri çarpanlara ayırır.",
      processComponents: "Ortak çarpan parantezine alma, iki kare farkı ve tam kare ifadelerin çarpanlara ayrılması.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "Matematik",
      grade: 8,
      unitOrTheme: "M.8.2. CEBİR",
      outcomeCode: "M.8.2.2.6",
      outcomeText: "Doğrunun eğimini modellerle açıklar, doğrusal denklemleri ve grafiklerini eğimle ilişkilendirir.",
      processComponents: "Eğim = Dikey uzunluk / Yatay uzunluk. Sağa yatık doğruların eğimi pozitif, sola yatık negatif.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "Matematik",
      grade: 8,
      unitOrTheme: "M.8.3. GEOMETRİ VE ÖLÇME",
      outcomeCode: "M.8.3.1.2",
      outcomeText: "Üçgenin iki kenar uzunluğunun toplamı veya farkı ile üçüncü kenarının uzunluğunu ilişkilendirir.",
      processComponents: "Üçgen eşitsizliği kuralı: |a - b| < c < a + b. Şartı sağlamayan kenarlarla üçgen çizilemez.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "Matematik",
      grade: 8,
      unitOrTheme: "M.8.3. GEOMETRİ VE ÖLÇME",
      outcomeCode: "M.8.3.1.5",
      outcomeText: "Pisagor bağıntısını oluşturur, ilgili problemleri çözer.",
      processComponents: "Dik açılı üçgende dik kenarların kareleri toplamı hipotenüsün karesine eşittir: a^2 + b^2 = c^2 (3-4-5, 5-12-13 üçgenleri).",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },

    // ==========================================
    // 4. T.C. İNKILAP TARİHİ VE ATATÜRKÇÜLÜK (8. SINIF)
    // ==========================================
    {
      subject: "T.C. İnkılap Tarihi ve Atatürkçülük",
      grade: 8,
      unitOrTheme: "1. ÜNİTE: BİR KAHRAMAN DOĞUYOR",
      outcomeCode: "İTA.8.1.1",
      outcomeText: "Avrupa’daki gelişmelerin yansımaları bağlamında Osmanlı Devleti’nin yirminci yüzyılın başlarındaki siyasi ve sosyal durumunu kavrar.",
      processComponents: "Sanayi İnkılabı, sömürgecilik, Fransız İhtilali, milliyetçilik akımı, Tanzimat ve Meşrutiyet dönemleri ve fikir akımları (Osmanlıcılık, İslamcılık, Türkçülük, Batıcılık).",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "T.C. İnkılap Tarihi ve Atatürkçülük",
      grade: 8,
      unitOrTheme: "1. ÜNİTE: BİR KAHRAMAN DOĞUYOR",
      outcomeCode: "İTA.8.1.2",
      outcomeText: "Mustafa Kemal’in çocukluk ve öğrenim hayatından hareketle onun kişilik özelliklerinin oluşumu hakkında çıkarımlarda bulunur.",
      processComponents: "Selanik ve Manastır ortamı; Mahalle Mektebi, Şemsi Efendi Mektebi, Selanik Mülkiye Rüştiyesi, Selanik Askeri Rüştiyesi, Manastır Askeri İdadisi, Harp Okulu, Harp Akademisi.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "T.C. İnkılap Tarihi ve Atatürkçülük",
      grade: 8,
      unitOrTheme: "1. ÜNİTE: BİR KAHRAMAN DOĞUYOR",
      outcomeCode: "İTA.8.1.3",
      outcomeText: "Gençlik döneminde Mustafa Kemal’in fikir hayatını etkileyen önemli kişileri ve olayları kavrar.",
      processComponents: "Ziya Gökalp (milliyetçilik), Namık Kemal (vatan şairi), Tevfik Fikret (batıcılık), Mehmet Emin Yurdakul ve 1897 Türk-Yunan Savaşı.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "T.C. İnkılap Tarihi ve Atatürkçülük",
      grade: 8,
      unitOrTheme: "1. ÜNİTE: BİR KAHRAMAN DOĞUYOR",
      outcomeCode: "İTA.8.1.4",
      outcomeText: "Mustafa Kemal’in askerlik hayatı ile ilgili olayları ve olguları onun kişilik özellikleri ile ilişkilendirir.",
      processComponents: "Şam 5. Ordu (Vatan ve Hürriyet Cemiyeti), 31 Mart Olayı (Hareket Ordusu Kurmay Başkanı), Trablusgarp Savaşı (Derne-Tobruk teşkilatçılığı) ve Balkan Savaşları.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "T.C. İnkılap Tarihi ve Atatürkçülük",
      grade: 8,
      unitOrTheme: "2. ÜNİTE: MİLLÎ UYANIŞ: BAĞIMSIZLIK YOLUNDA ATILAN ADIMLAR",
      outcomeCode: "İTA.8.2.1",
      outcomeText: "Birinci Dünya Savaşı’nın sebeplerini ve savaşın başlamasına yol açan gelişmeleri kavrar.",
      processComponents: "Hammadde ve pazar yarışı, silahlanma, İttifak ve İtilaf bloklaşmaları, Saraybosna suikastı.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "T.C. İnkılap Tarihi ve Atatürkçülük",
      grade: 8,
      unitOrTheme: "2. ÜNİTE: MİLLÎ UYANIŞ: BAĞIMSIZLIK YOLUNDA ATILAN ADIMLAR",
      outcomeCode: "İTA.8.2.2",
      outcomeText: "Birinci Dünya Savaşı’nda Osmanlı Devleti’nin durumu hakkında çıkarımlarda bulunur.",
      processComponents: "Kafkas (Sarıkamış), Çanakkale (Anafartalar zaferi), Kanal, Irak (Kut'ül-Amare) cepheleri ve 1915 Tehcir Kanunu.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "T.C. İnkılap Tarihi ve Atatürkçülük",
      grade: 8,
      unitOrTheme: "2. ÜNİTE: MİLLÎ UYANIŞ: BAĞIMSIZLIK YOLUNDA ATILAN ADIMLAR",
      outcomeCode: "İTA.8.2.3",
      outcomeText: "Mondros Ateşkes Antlaşması’nın imzalanması ve uygulanması karşısında tutumları analiz eder.",
      processComponents: "Mondros'un 7. ve 24. işgal maddeleri, İstanbul Hükümeti'nin teslimiyetçi tavrı, Mustafa Kemal'in 'Geldikleri gibi giderler' kararlılığı.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "T.C. İnkılap Tarihi ve Atatürkçülük",
      grade: 8,
      unitOrTheme: "2. ÜNİTE: MİLLÎ UYANIŞ: BAĞIMSIZLIK YOLUNDA ATILAN ADIMLAR",
      outcomeCode: "İTA.8.2.5",
      outcomeText: "Millî Mücadele’nin hazırlık döneminde Mustafa Kemal’in yaptığı çalışmaları analiz eder.",
      processComponents: "Samsun'a çıkış (19 Mayıs 1919), Havza Genelgesi, Amasya Genelgesi ('Milletin bağımsızlığını yine milletin azim ve kararı kurtaracaktır'), Erzurum Kongresi, Sivas Kongresi.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "T.C. İnkılap Tarihi ve Atatürkçülük",
      grade: 8,
      unitOrTheme: "2. ÜNİTE: MİLLÎ UYANIŞ: BAĞIMSIZLIK YOLUNDA ATILAN ADIMLAR",
      outcomeCode: "İTA.8.2.6",
      outcomeText: "Misakımillî’nin kabulünü ve Büyük Millet Meclisinin açılışını ilkelerle ilişkilendirir.",
      processComponents: "Son Osmanlı Mebusan Meclisi ve Misakımillî kararları, 23 Nisan 1920 TBMM'nin açılması ve milli egemenliğin tecellisi.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "T.C. İnkılap Tarihi ve Atatürkçülük",
      grade: 8,
      unitOrTheme: "3. ÜNİTE: MİLLÎ BİR DESTAN: YA İSTİKLAL YA ÖLÜM!",
      outcomeCode: "İTA.8.3.1",
      outcomeText: "Millî Mücadele Dönemi’nde Doğu Cephesi ve Güney Cephesi’nde meydana gelen gelişmeleri kavrar.",
      processComponents: "Kazım Karabekir ve Gümrü Antlaşması, Güney Cephesi Kuva-yı Milliye kahramanları (Sütçü İmam, Şahin Bey, Ali Saip Bey).",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "T.C. İnkılap Tarihi ve Atatürkçülük",
      grade: 8,
      unitOrTheme: "3. ÜNİTE: MİLLÎ BİR DESTAN: YA İSTİKLAL YA ÖLÜM!",
      outcomeCode: "İTA.8.3.2",
      outcomeText: "Millî Mücadele Dönemi’nde Batı Cephesi’nde meydana gelen gelişmeleri kavrar.",
      processComponents: "Düzenli ordunun kuruluşu, I. İnönü, II. İnönü, Kütahya-Eskişehir Muharebeleri, İstiklal Marşı'nın kabulü, Londra Konferansı, Moskova Antlaşması.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "T.C. İnkılap Tarihi ve Atatürkçülük",
      grade: 8,
      unitOrTheme: "3. ÜNİTE: MİLLÎ BİR DESTAN: YA İSTİKLAL YA ÖLÜM!",
      outcomeCode: "İTA.8.3.4",
      outcomeText: "Tekalif-i Millîye Emirleri doğrultusunda yapılan uygulamaları analiz eder.",
      processComponents: "Topyekûn milli seferberlik, Türk milletinin ordusuna giyecek, yiyecek, binek hayvanı ve cephane desteği sağlaması.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "T.C. İnkılap Tarihi ve Atatürkçülük",
      grade: 8,
      unitOrTheme: "3. ÜNİTE: MİLLÎ BİR DESTAN: YA İSTİKLAL YA ÖLÜM!",
      outcomeCode: "İTA.8.3.5",
      outcomeText: "Sakarya Meydan Savaşı'nın kazanılmasında ve Büyük Taarruz'da Mustafa Kemal’in rolünü kavrar.",
      processComponents: "'Hattı müdafaa yoktur sathı müdafaa vardır', Başkomutanlık Meydan Muharebesi, Gazi unvanı ve Mareşal rütbesi.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "T.C. İnkılap Tarihi ve Atatürkçülük",
      grade: 8,
      unitOrTheme: "3. ÜNİTE: MİLLÎ BİR DESTAN: YA İSTİKLAL YA ÖLÜM!",
      outcomeCode: "İTA.8.3.6",
      outcomeText: "Lozan Antlaşması’nın sağladığı kazanımları analiz eder.",
      processComponents: "24 Temmuz 1923: Kapitülasyonların kesin kaldırılması, yeni Türk Devleti'nin uluslararası alanda bağımsızlığının tescili.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "T.C. İnkılap Tarihi ve Atatürkçülük",
      grade: 8,
      unitOrTheme: "4.ÜNİTE: ATATÜRKÇÜLÜK VE ÇAĞDAŞLAŞAN TÜRKİYE",
      outcomeCode: "İTA.8.4.1",
      outcomeText: "Çağdaşlaşan Türkiye’nin temeli olan Atatürk ilkelerini açıklar.",
      processComponents: "Cumhuriyetçilik, Milliyetçilik, Halkçılık, Devletçilik, Laiklik ve İnkılapçılık ilkelerinin anlam ve bütünlüğü.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "T.C. İnkılap Tarihi ve Atatürkçülük",
      grade: 8,
      unitOrTheme: "4.ÜNİTE: ATATÜRKÇÜLÜK VE ÇAĞDAŞLAŞAN TÜRKİYE",
      outcomeCode: "İTA.8.4.2",
      outcomeText: "Siyasi alanda meydana gelen gelişmeleri kavrar.",
      processComponents: "Saltanatın kaldırılması (1922), Ankara'nın başkent olması, Cumhuriyetin ilanı (29 Ekim 1923), Halifeliğin kaldırılması (3 Mart 1924).",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "T.C. İnkılap Tarihi ve Atatürkçülük",
      grade: 8,
      unitOrTheme: "4.ÜNİTE: ATATÜRKÇÜLÜK VE ÇAĞDAŞLAŞAN TÜRKİYE",
      outcomeCode: "İTA.8.4.3",
      outcomeText: "Hukuk alanında meydana gelen gelişmelerin toplumsal hayata yansımalarını kavrar.",
      processComponents: "17 Şubat 1926 Türk Medeni Kanunu ile kadın-erkek eşitliği, tek eşlilik ve kadınların sosyal/ekonomik hakları.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "T.C. İnkılap Tarihi ve Atatürkçülük",
      grade: 8,
      unitOrTheme: "4.ÜNİTE: ATATÜRKÇÜLÜK VE ÇAĞDAŞLAŞAN TÜRKİYE",
      outcomeCode: "İTA.8.4.4",
      outcomeText: "Eğitim ve kültür alanında yapılan inkılapları ve gelişmeleri kavrar.",
      processComponents: "Tevhid-i Tedrisat Kanunu, Harf İnkılabı, Millet Mektepleri, Türk Tarih Kurumu ve Türk Dil Kurumu'nun kuruluşu.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },

    // ==========================================
    // 5. İNGİLİZCE (8. SINIF)
    // ==========================================
    {
      subject: "İngilizce",
      grade: 8,
      unitOrTheme: "1 Friendship",
      outcomeCode: "E8.1.L1",
      outcomeText: "Students will be able to understand short conversations on accepting/refusing offers and apologizing.",
      processComponents: "Accepting/refusing invitations, giving explanations and reasons, true friend qualities (honest, reliable, supportive).",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "İngilizce",
      grade: 8,
      unitOrTheme: "2 Teen Life",
      outcomeCode: "E8.2.L1",
      outcomeText: "Students will be able to understand phrases and expressions about regular activities and preferences of teenagers.",
      processComponents: "Expressing likes and dislikes, music and fashion preferences, daily teen routines and hobbies.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "İngilizce",
      grade: 8,
      unitOrTheme: "3 In The Kitchen",
      outcomeCode: "E8.3.R1",
      outcomeText: "Students will be able to understand short texts and descriptions about recipes and cooking processes.",
      processComponents: "Describing a process using sequencers (First, Second, Then, After that, Finally), kitchen tools and ingredients.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "İngilizce",
      grade: 8,
      unitOrTheme: "4 On The Phone",
      outcomeCode: "E8.4.L2",
      outcomeText: "Students will be able to follow phone conversations and understand phone etiquette.",
      processComponents: "Making calls, asking for people, holding the line, leaving and taking messages on the phone.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "İngilizce",
      grade: 8,
      unitOrTheme: "5 The Internet",
      outcomeCode: "E8.5.R1",
      outcomeText: "Students will be able to identify main ideas in texts about internet habits and online safety.",
      processComponents: "Internet terminology (browse, download, attachment, account, connection), safety rules online.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "İngilizce",
      grade: 8,
      unitOrTheme: "6 Adventures",
      outcomeCode: "E8.6.L1",
      outcomeText: "Students will be able to understand discussions and compare extreme sports and adventures.",
      processComponents: "Expressing preferences ('would rather / prefer'), comparing extreme sports (rafting, paragliding, bungee jumping).",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "İngilizce",
      grade: 8,
      unitOrTheme: "7 Tourism",
      outcomeCode: "E8.7.R1",
      outcomeText: "Students will be able to extract specific information about tourist attractions and historical architecture.",
      processComponents: "Describing places, all-inclusive resorts vs historic sites, expressing opinions on holiday experiences.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "İngilizce",
      grade: 8,
      unitOrTheme: "8 Chores",
      outcomeCode: "E8.8.L1",
      outcomeText: "Students will be able to express obligations, duties, and responsibilities at home and school.",
      processComponents: "Household chores (doing the laundry, washing dishes, vacuuming), must / have to rules.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "İngilizce",
      grade: 8,
      unitOrTheme: "9 Science",
      outcomeCode: "E8.9.R1",
      outcomeText: "Students will be able to understand short texts about scientific inventions and current lab projects.",
      processComponents: "Talking about past scientific breakthroughs (Archimedes, Newton, Edison) and current laboratory experiments.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "İngilizce",
      grade: 8,
      unitOrTheme: "10 Natural Forces",
      outcomeCode: "E8.10.L1",
      outcomeText: "Students will be able to identify natural disasters and make predictions about the planet's future.",
      processComponents: "Earthquakes, avalanches, floods, droughts, water shortages, climate change solutions and predictions.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },

    // ==========================================
    // 6. TÜRKÇE (8. SINIF)
    // ==========================================
    {
      subject: "Türkçe",
      grade: 8,
      unitOrTheme: "Fiilimsiler (Eylemsiler)",
      outcomeCode: "TÜRK.8.1.1",
      outcomeText: "Fiilimsilerin cümledeki işlevlerini ve türlerini (isim-fiil, sıfat-fiil, zarf-fiil) ayırt eder.",
      processComponents: "İsim-fiil (-ma/-me, -ış/-iş, -mak/-mek), sıfat-fiil (-an, -ası, -mez, -ar, -dik, -ecek, -miş) ve zarf-fiil ekleri ve çekimli fiilden farkı.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "Türkçe",
      grade: 8,
      unitOrTheme: "Cümlenin Ögeleri",
      outcomeCode: "TÜRK.8.2.1",
      outcomeText: "Cümlenin temel ve yardımcı ögelerini doğru tespit eder.",
      processComponents: "Temel ögeler: Yüklem ve Özne. Yardımcı ögeler: Belirtili/Belirtisiz Nesne, Yer Tamlayıcısı (Dolaylı Tümleç), Zarf Tamlayıcısı.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "Türkçe",
      grade: 8,
      unitOrTheme: "Sözcükte ve Cümlede Anlam",
      outcomeCode: "TÜRK.8.3.1",
      outcomeText: "Bağlamdan yararlanarak sözcük ve deyimlerin anlamını tahmin eder, örtülü anlamı kavrar.",
      processComponents: "Gerçek, mecaz ve terim anlam; deyim ve atasözleri; neden-sonuç, amaç-sonuç, koşul-sonuç cümleleri.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "Türkçe",
      grade: 8,
      unitOrTheme: "Paragrafta Anlam ve Metin Türleri",
      outcomeCode: "TÜRK.8.4.1",
      outcomeText: "Metnin ana fikrini, yardımcı fikirlerini ve metin türlerini analiz eder.",
      processComponents: "Paragraf yapısı, ana düşünce ve edebi metin türleri (deneme, makale, fıkra, söyleşi, biyografi).",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
  ];

  // Kazanımları güvenli upsert ile ekle
  for (const item of outcomesData) {
    await prisma.curriculumOutcome.upsert({
      where: { outcomeCode: item.outcomeCode },
      create: item,
      update: {
        outcomeText: item.outcomeText,
        processComponents: item.processComponents,
        unitOrTheme: item.unitOrTheme,
        grade: item.grade,
        subject: item.subject,
      },
    });
  }
  console.log(`✓ ${outcomesData.length} adet 8. Sınıf MEB Çerçeve Yıllık Plan Öğrenme Çıktısı başarıyla yüklendi.`);

  // 2. Demo Öğretmen (Upsert)
  const teacher = await prisma.user.upsert({
    where: { email: "ogretmen@demo.com" },
    create: {
      name: "Ahmet Yıldız",
      email: "ogretmen@demo.com",
      passwordHash: teacherPasswordHash,
      role: "TEACHER",
    },
    update: {},
  });

  // 3. Demo Öğrenciler (Upsert)
  const student1 = await prisma.user.upsert({
    where: { email: "ogrenci@demo.com" },
    create: {
      name: "Zeynep Yılmaz",
      email: "ogrenci@demo.com",
      passwordHash: studentPasswordHash,
      role: "STUDENT",
    },
    update: {},
  });

  const student2 = await prisma.user.upsert({
    where: { email: "ali@demo.com" },
    create: {
      name: "Ali Demir",
      email: "ali@demo.com",
      passwordHash: studentPasswordHash,
      role: "STUDENT",
    },
    update: {},
  });

  const student3 = await prisma.user.upsert({
    where: { email: "ayse@demo.com" },
    create: {
      name: "Ayşe Kaya",
      email: "ayse@demo.com",
      passwordHash: studentPasswordHash,
      role: "STUDENT",
    },
    update: {},
  });

  const student4 = await prisma.user.upsert({
    where: { email: "mehmet@demo.com" },
    create: {
      name: "Mehmet Çelik",
      email: "mehmet@demo.com",
      passwordHash: studentPasswordHash,
      role: "STUDENT",
    },
    update: {},
  });

  const student5 = await prisma.user.upsert({
    where: { email: "elif@demo.com" },
    create: {
      name: "Elif Şahin",
      email: "elif@demo.com",
      passwordHash: studentPasswordHash,
      role: "STUDENT",
    },
    update: {},
  });

  // 4. 8. SINIF ŞUBELERİ (8/A, 8/B, 8/C)
  const class8A = await prisma.class.upsert({
    where: { joinCode: "8A-FEN01" },
    create: {
      name: "8/A",
      grade: 8,
      subject: "Fen Bilimleri",
      joinCode: "8A-FEN01",
      teacherId: teacher.id,
    },
    update: {
      grade: 8,
      name: "8/A",
    },
  });

  const class8B = await prisma.class.upsert({
    where: { joinCode: "8B-MAT02" },
    create: {
      name: "8/B",
      grade: 8,
      subject: "Matematik",
      joinCode: "8B-MAT02",
      teacherId: teacher.id,
    },
    update: {
      grade: 8,
      name: "8/B",
    },
  });

  const class8C = await prisma.class.upsert({
    where: { joinCode: "8C-INK03" },
    create: {
      name: "8/C",
      grade: 8,
      subject: "T.C. İnkılap Tarihi ve Atatürkçülük",
      joinCode: "8C-INK03",
      teacherId: teacher.id,
    },
    update: {
      grade: 8,
      name: "8/C",
    },
  });

  // Öğrencileri 8/A sınıfına ekle
  const students = [student1, student2, student3, student4, student5];
  for (const s of students) {
    await prisma.classMember.upsert({
      where: {
        classId_studentId: { classId: class8A.id, studentId: s.id },
      },
      create: { classId: class8A.id, studentId: s.id },
      update: {},
    });
  }

  // 8/B ve 8/C'ye de kayıt
  await prisma.classMember.upsert({
    where: { classId_studentId: { classId: class8B.id, studentId: student1.id } },
    create: { classId: class8B.id, studentId: student1.id },
    update: {},
  });
  await prisma.classMember.upsert({
    where: { classId_studentId: { classId: class8C.id, studentId: student1.id } },
    create: { classId: class8C.id, studentId: student1.id },
    update: {},
  });

  // 5. Demo 8. Sınıf Görevi (8/A Fen Bilimleri - Mevsimlerin Oluşumu)
  const existingMevsimAssignment = await prisma.assignment.findFirst({
    where: { classId: class8A.id, topic: "Mevsimlerin Oluşumu ve Dünya'nın Eksen Eğikliği" },
  });

  if (!existingMevsimAssignment) {
    const fenOutcome = await prisma.curriculumOutcome.findUnique({ where: { outcomeCode: "F.8.1.1.1" } });

    const assignmentMevsim = await prisma.assignment.create({
      data: {
        teacherId: teacher.id,
        classId: class8A.id,
        subject: "Fen Bilimleri",
        grade: 8,
        unitOrTheme: "1.ÜNİTE: MEVSİMLER VE İKLİM",
        topic: "Mevsimlerin Oluşumu ve Dünya'nın Eksen Eğikliği",
        minimumScore: 70,
        maxAttempts: 2,
        deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        status: "PUBLISHED",
        publishedAt: new Date(),
      },
    });

    if (fenOutcome) {
      await prisma.assignmentOutcome.create({
        data: {
          assignmentId: assignmentMevsim.id,
          outcomeId: fenOutcome.id,
        },
      });
    }

    // Zengin Özet İçeriği
    await prisma.studyContent.create({
      data: {
        assignmentId: assignmentMevsim.id,
        title: "8. Sınıf Fen Bilimleri: Mevsimlerin Oluşumu Ön Hazırlık Rehberi",
        introduction:
          "Yarınki derste Dünya'nın eksen eğikliği ve Güneş etrafındaki dolanma hareketinin mevsimleri nasıl meydana getirdiğini inceleyeceğiz. İşte sınıfa gelmeden önce bilmen gereken temel gerçekler!",
        summary:
          "Mevsimlerin oluşmasının temel sebebi Dünya'nın eksen eğikliği (23° 27') ve Güneş etrafında dolanma hareketidir. Dünya'nın Güneş'e olan uzaklığının mevsimlerle hiçbir ilgisi yoktur! Güneş ışınları dik açıyla geldiğinde birim yüzeye düşen enerji fazla olur ve yaz mevsimi yaşanır. Eğik açıyla geldiğinde ise kış mevsimi yaşanır. Kuzey ve Güney Yarım Küre'de aynı anda birbirine zıt mevsimler yaşanır.",
        keyConcepts: JSON.stringify([
          { term: "Dönme Ekseni Eğikliği (23° 27')", desc: "Mevsimlerin oluşumundaki ana sebep" },
          { term: "Geliş Açısı", desc: "Dik gelen ışınlar çok ısıtır, eğik gelen az ısıtır" },
          { term: "Birim Yüzeye Düşen Enerji", desc: "Dar alanda yoğunlaşan ışık enerjisi" },
        ]),
        mustKnow:
          "1) Mevsimlerin temel sebebi eksen eğikliği ve Güneş etrafında dolanmadır.\n2) Güneş'e mesafe mevsim belirlemez.\n3) 21 Haziran Kuzey KY yaz, 21 Aralık kış başlangıcıdır.",
        example:
          "El fenerini masaya tam dik tuttuğunda küçük bir alan çok parlak ve sıcak olur; feneri eğik tuttuğunda ise ışık geniş bir alana yayılır ama sıcaklık azalır. Yaz ve kış farkı tam olarak budur!",
        teacherApproved: true,
        approvalStatus: "TEACHER_APPROVED",
      },
    });

    // 5 Okuduğunu Anlama ve Ön Bilgi Sorusu
    const q1 = await prisma.question.create({
      data: {
        assignmentId: assignmentMevsim.id,
        questionType: "MULTIPLE_CHOICE",
        questionText: "Mevsimlerin oluşumunda etkili olan iki temel faktör hangisinde doğru olarak verilmiştir?",
        optionsJson: JSON.stringify([
          "A) Dünya'nın eksen eğikliği ve Güneş etrafında dolanması",
          "B) Dünya'nın Güneş'e olan mesafesinin değişmesi",
          "C) Ay'ın evreleri ve gelgit olayları",
          "D) Dünya'nın kendi ekseni etrafında dönmesi"
        ]),
        correctAnswer: "A",
        explanation: "Mevsimler eksen eğikliği ve Güneş etrafında dolanma hareketi sonucunda meydana gelir.",
        points: 20,
        order: 1,
      },
    });

    const q2 = await prisma.question.create({
      data: {
        assignmentId: assignmentMevsim.id,
        questionType: "TRUE_FALSE",
        questionText: "Dünya'nın Güneş'e en yakın olduğu tarih kış mevsimine denk gelir; yani mevsimlerin oluşumunda Güneş'e olan mesafe belirleyici DEĞİLDİR.",
        optionsJson: JSON.stringify(["Doğru", "Yanlış"]),
        correctAnswer: "Doğru",
        explanation: "Mevsimlerin sebebi uzaklık değil, eksen eğikliğine bağlı ışınların geliş açısıdır.",
        points: 20,
        order: 2,
      },
    });

    const q3 = await prisma.question.create({
      data: {
        assignmentId: assignmentMevsim.id,
        questionType: "FILL_BLANK",
        questionText: "Güneş ışınları bir bölgeye dik açıyla geldiğinde birim yüzeye düşen ısı enerjisi miktarı _________ olur.",
        optionsJson: null,
        correctAnswer: "fazla",
        explanation: "Dik gelen ışınlar enerjiyi dar bir alanda yoğunlaştırdığı için birim alana düşen enerji fazla olur.",
        points: 20,
        order: 3,
      },
    });

    const q4 = await prisma.question.create({
      data: {
        assignmentId: assignmentMevsim.id,
        questionType: "MULTIPLE_CHOICE",
        questionText: "Kuzey Yarım Küre'de 21 Haziran tarihinde yaz mevsimi başlarken Güney Yarım Küre'de hangi mevsim başlar?",
        optionsJson: JSON.stringify(["A) İlkbahar", "B) Sonbahar", "C) Kış", "D) Yaz"]),
        correctAnswer: "C",
        explanation: "Yarım kürelerde her zaman birbirinin zıttı mevsimler yaşanır.",
        points: 20,
        order: 4,
      },
    });

    const q5 = await prisma.question.create({
      data: {
        assignmentId: assignmentMevsim.id,
        questionType: "MATCHING",
        questionText: "Mevsim geçiş tarihlerini özellikleriyle eşleştiriniz:",
        optionsJson: JSON.stringify([
          { left: "21 Haziran", right: "Kuzey Yarım Küre'de en uzun gündüz (Yaz başlangıcı)" },
          { left: "21 Aralık", right: "Kuzey Yarım Küre'de en uzun gece (Kış başlangıcı)" },
          { left: "21 Mart & 23 Eylül", right: "Gece ve gündüz sürelerinin eşitliği (Ekinoks)" }
        ]),
        correctAnswer: JSON.stringify({
          "21 Haziran": "Kuzey Yarım Küre'de en uzun gündüz (Yaz başlangıcı)",
          "21 Aralık": "Kuzey Yarım Küre'de en uzun gece (Kış başlangıcı)",
          "21 Mart & 23 Eylül": "Gece ve gündüz sürelerinin eşitliği (Ekinoks)"
        }),
        explanation: "21 Haziran ve 21 Aralık gün dönümü, 21 Mart ve 23 Eylül ise ekinoks tarihleridir.",
        points: 20,
        order: 5,
      },
    });

    // Zeynep: Görevi tamamladı (100 puan, Derse Hazır)
    const sa1 = await prisma.studentAssignment.create({
      data: {
        assignmentId: assignmentMevsim.id,
        studentId: student1.id,
        status: "READY_FOR_CLASS",
        summaryOpenedAt: new Date(Date.now() - 35 * 60 * 1000),
        summaryConfirmedAt: new Date(Date.now() - 30 * 60 * 1000),
        completedAt: new Date(Date.now() - 20 * 60 * 1000),
      },
    });

    const att1 = await prisma.attempt.create({
      data: {
        studentAssignmentId: sa1.id,
        attemptNumber: 1,
        score: 100,
        isPassed: true,
        startedAt: new Date(Date.now() - 30 * 60 * 1000),
        submittedAt: new Date(Date.now() - 20 * 60 * 1000),
      },
    });

    await prisma.answer.createMany({
      data: [
        { attemptId: att1.id, questionId: q1.id, studentAnswer: "A", isCorrect: true, score: 20 },
        { attemptId: att1.id, questionId: q2.id, studentAnswer: "Doğru", isCorrect: true, score: 20 },
        { attemptId: att1.id, questionId: q3.id, studentAnswer: "fazla", isCorrect: true, score: 20 },
        { attemptId: att1.id, questionId: q4.id, studentAnswer: "C", isCorrect: true, score: 20 },
        { attemptId: att1.id, questionId: q5.id, studentAnswer: q5.correctAnswer, isCorrect: true, score: 20 },
      ],
    });

    // Ali: 60 puan (Tekrar Gerekli)
    const sa2 = await prisma.studentAssignment.create({
      data: {
        assignmentId: assignmentMevsim.id,
        studentId: student2.id,
        status: "NEEDS_REVIEW",
        summaryOpenedAt: new Date(Date.now() - 45 * 60 * 1000),
        summaryConfirmedAt: new Date(Date.now() - 41 * 60 * 1000),
        completedAt: new Date(Date.now() - 28 * 60 * 1000),
      },
    });

    const att2 = await prisma.attempt.create({
      data: {
        studentAssignmentId: sa2.id,
        attemptNumber: 1,
        score: 60,
        isPassed: false,
        startedAt: new Date(Date.now() - 41 * 60 * 1000),
        submittedAt: new Date(Date.now() - 28 * 60 * 1000),
      },
    });

    await prisma.answer.createMany({
      data: [
        { attemptId: att2.id, questionId: q1.id, studentAnswer: "A", isCorrect: true, score: 20 },
        { attemptId: att2.id, questionId: q2.id, studentAnswer: "Yanlış", isCorrect: false, score: 0 },
        { attemptId: att2.id, questionId: q3.id, studentAnswer: "fazla", isCorrect: true, score: 20 },
        { attemptId: att2.id, questionId: q4.id, studentAnswer: "A", isCorrect: false, score: 0 },
        { attemptId: att2.id, questionId: q5.id, studentAnswer: q5.correctAnswer, isCorrect: true, score: 20 },
      ],
    });
  }

  // 6. Demo 8. Sınıf Görevi 2 (8/C İnkılap Tarihi - Mustafa Kemal'in Öğrenim Hayatı)
  const existingInkAssignment = await prisma.assignment.findFirst({
    where: { classId: class8C.id, topic: "Mustafa Kemal'in Çocukluk ve Öğrenim Hayatı" },
  });

  if (!existingInkAssignment) {
    const inkOutcome = await prisma.curriculumOutcome.findUnique({ where: { outcomeCode: "İTA.8.1.2" } });

    const assignmentInk = await prisma.assignment.create({
      data: {
        teacherId: teacher.id,
        classId: class8C.id,
        subject: "T.C. İnkılap Tarihi ve Atatürkçülük",
        grade: 8,
        unitOrTheme: "1. ÜNİTE: BİR KAHRAMAN DOĞUYOR",
        topic: "Mustafa Kemal'in Çocukluk ve Öğrenim Hayatı",
        minimumScore: 70,
        maxAttempts: 2,
        deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        status: "PUBLISHED",
        publishedAt: new Date(),
      },
    });

    if (inkOutcome) {
      await prisma.assignmentOutcome.create({
        data: {
          assignmentId: assignmentInk.id,
          outcomeId: inkOutcome.id,
        },
      });
    }

    await prisma.studyContent.create({
      data: {
        assignmentId: assignmentInk.id,
        title: "8. Sınıf İnkılap Tarihi: Mustafa Kemal'in Öğrenim Hayatı Ön Hazırlık",
        introduction:
          "Mustafa Kemal'in yetiştiği Selanik şehri ve gittiği okullar onun fikir hayatını ve liderlik vasfını şekillendirmiştir. Dersten önce bu okulları kronolojik sırayla bilmen konuyu çok rahat takip etmeni sağlayacak!",
        summary:
          "Mustafa Kemal Mahalle Mektebi'nde geleneksel, Şemsi Efendi Mektebi'nde modern eğitime başladı. Selanik Askeri Rüştiyesi'nde matematik öğretmeni ona 'Kemal' adını verdi. Manastır Askeri İdadisi'nde tarih ve edebiyat sevgisi gelişti. İstanbul Harp Akademisi'nden Kurmay Yüzbaşı rütbesiyle mezun olup ilk görev yeri Şam'a atandı.",
        keyConcepts: JSON.stringify([
          { term: "Selanik", desc: "Çok kültürlü liman kenti" },
          { term: "Şemsi Efendi", desc: "İlk modern okulu" },
          { term: "Selanik Askeri Rüştiyesi", desc: "Kemal adını aldığı okul" },
          { term: "Manastır Askeri İdadisi", desc: "Fikir hayatının olgunlaştığı lise" },
        ]),
        mustKnow:
          "1) 'Kemal' adı Selanik Askeri Rüştiyesi'nde verildi.\n2) Tarih ve vatan sevgisi Manastır'da güçlendi.\n3) Harp Akademisi'nden Kurmay Yüzbaşı olarak mezun oldu.",
        example:
          "Nasıl ki bir tohum uygun toprakta serpilirse; Selanik'in zengin kültürel yapısı ve gittiği okulların disiplini de Mustafa Kemal'in dahi bir komutan olarak yetişmesini sağlamıştır.",
        teacherApproved: true,
        approvalStatus: "TEACHER_APPROVED",
      },
    });

    const iq1 = await prisma.question.create({
      data: {
        assignmentId: assignmentInk.id,
        questionType: "MULTIPLE_CHOICE",
        questionText: "Mustafa Kemal'e 'Kemal' adını hangi okulda hangi dersin öğretmeni vermiştir?",
        optionsJson: JSON.stringify([
          "A) Selanik Askeri Rüştiyesi - Matematik öğretmeni",
          "B) Şemsi Efendi Mektebi - Tarih öğretmeni",
          "C) Manastır Askeri İdadisi - Fransızca öğretmeni",
          "D) Harp Okulu - Edebiyat öğretmeni"
        ]),
        correctAnswer: "A",
        explanation: "Selanik Askeri Rüştiyesi matematik öğretmeni Yüzbaşı Mustafa Bey olgunluk anlamında Kemal adını vermiştir.",
        points: 25,
        order: 1,
      },
    });

    const iq2 = await prisma.question.create({
      data: {
        assignmentId: assignmentInk.id,
        questionType: "TRUE_FALSE",
        questionText: "Mustafa Kemal Harp Akademisi'nden 'Kurmay Yüzbaşı' rütbesiyle mezun olarak ilk görev yeri olan Şam'a atanmıştır.",
        optionsJson: JSON.stringify(["Doğru", "Yanlış"]),
        correctAnswer: "Doğru",
        explanation: "Mustafa Kemal Harp Akademisi'ni kurmay yüzbaşı olarak bitirmiş ve Şam 5. Ordu'ya görevlendirilmiştir.",
        points: 25,
        order: 2,
      },
    });

    const iq3 = await prisma.question.create({
      data: {
        assignmentId: assignmentInk.id,
        questionType: "FILL_BLANK",
        questionText: "Mustafa Kemal modern eğitim veren _________ Mektebi'ne babası Ali Rıza Efendi'nin isteğiyle başlamıştır.",
        optionsJson: null,
        correctAnswer: "Şemsi Efendi",
        explanation: "Babası yenilikçi ve modern eğitim veren Şemsi Efendi Mektebi'ni tercih etmiştir.",
        points: 25,
        order: 3,
      },
    });

    const iq4 = await prisma.question.create({
      data: {
        assignmentId: assignmentInk.id,
        questionType: "MULTIPLE_CHOICE",
        questionText: "Mustafa Kemal'in vatan ve millet sevgisinin perçinlendiği, Ömer Naci ile tanışıp edebiyata ilgi duyduğu lise dönemi okulu hangisidir?",
        optionsJson: JSON.stringify([
          "A) Selanik Mülkiye Rüştiyesi",
          "B) Manastır Askeri İdadisi",
          "C) Mahalle Mektebi",
          "D) Şam Askeri Kışlası"
        ]),
        correctAnswer: "B",
        explanation: "Manastır Askeri İdadisi lise dönemidir ve fikir hayatının olgunlaşmasında büyük rol oynamıştır.",
        points: 25,
        order: 4,
      },
    });
  }

  console.log("🚀 8. Sınıf MEB Çerçeve Yıllık Plan Veritabanı Başarıyla Güncellendi!");
}

main()
  .catch((e) => {
    console.error("Hata:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
