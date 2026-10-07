import { CurriculumOutcome } from "@prisma/client";

export interface GeneratedStudyDraft {
  title: string;
  introduction: string;
  summary: string;
  keyConcepts: { term: string; desc: string }[];
  example: string;
  mustKnow: string;
  questions: {
    questionType: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "FILL_BLANK" | "MATCHING" | "SHORT_ANSWER";
    questionText: string;
    optionsJson?: string | null;
    correctAnswer: string;
    explanation: string;
    points: number;
    order: number;
  }[];
}

interface KnowledgeModule {
  topicTitle: string;
  introduction: string;
  summary: string;
  keyConcepts: { term: string; desc: string }[];
  example: string;
  mustKnow: string;
  questions: {
    questionType: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "FILL_BLANK" | "MATCHING" | "SHORT_ANSWER";
    questionText: string;
    optionsJson?: string | null;
    correctAnswer: string;
    explanation: string;
    points: number;
  }[];
}

// 8. SINIF MEB YILLIK ÇERÇEVE PLANLARINA ÖZEL PEDAGOJİK BİLGİ BANKASI
const CURRICULUM_KNOWLEDGE_BASE: Record<string, KnowledgeModule> = {
  // ==========================================
  // T.C. İNKILAP TARİHİ VE ATATÜRKÇÜLÜK (8. SINIF)
  // ==========================================
  "İTA.8.1.2": {
    topicTitle: "Mustafa Kemal'in Çocukluk ve Öğrenim Hayatı",
    introduction:
      "Merhaba! Yarınki dersimizde Türkiye Cumhuriyeti'nin kurucusu Mustafa Kemal Atatürk'ün çocukluk yıllarını, eğitim gördüğü okulları ve fikir dünyasının temellerini inceleyeceğiz. Derste öğretmeninin anlatacaklarını rahatça takip edebilmek ve sorulara hazır olmak için bu 4 dakikalık hazırlık özetini dikkatle oku.",
    summary:
      "Mustafa Kemal 1881 yılında Selanik'te doğdu. Selanik, zengin bir ticaret limanına, Avrupa ile bağlantılı demir yoluna ve farklı milletlerin bir arada yaşadığı kültürel zenginliğe sahipti. Bu çok uluslu ve hareketli ortam, Mustafa Kemal'in farklı kültürleri tanımasını ve dünyadaki gelişmelere açık bir lider olarak yetişmesini sağladı.\n\n" +
      "Mustafa Kemal öğrenim hayatına annesi Zübeyde Hanım'ın isteği üzerine geleneksel dini eğitim veren Mahalle Mektebi'nde başladı; kısa süre sonra babası Ali Rıza Efendi'nin isteğiyle çağdaş ve modern eğitim veren Şemsi Efendi Mektebi'ne geçti. Babasının vefatının ardından bir süre ara verse de Selanik Mülkiye Rüştiyesi'ne kaydoldu. Ancak gönlünde yatan askerlik mesleği için sınavlara gizlice girerek Selanik Askeri Rüştiyesi'ne başladı. Burada matematik öğretmeni Yüzbaşı Mustafa Bey, zekâsı ve olgunluğundan dolayı ona 'Kemal' adını verdi.\n\n" +
      "Ardından Manastır Askeri İdadisi'ne (lise) geçti. Manastır'da edebiyat ve tarihe ilgisi derinleşti; vatan şairi Namık Kemal ve Mehmet Emin Yurdakul'dan vatanseverlik, Fransız düşünürler Rousseau ve Voltaire'den eşitlik ve hürriyet fikirlerini edindi. Son olarak İstanbul Harp Okulu'ndan teğmen, İstanbul Harp Akademisi'nden ise Kurmay Yüzbaşı rütbesiyle mezun olarak Osmanlı ordusundaki ilk görev yeri olan Şam'a atandı.",
    keyConcepts: [
      {
        term: "Selanik Şehri",
        desc: "Limanı, demir yolu ve çok uluslu yapısıyla Batı'daki yeniliklerin Osmanlı'ya ilk ulaştığı hoşgörülü ve gelişmiş şehirdir.",
      },
      {
        term: "Şemsi Efendi Mektebi",
        desc: "Mustafa Kemal'in çağdaş ve modern yöntemlerle eğitim gördüğü ilk okuldur.",
      },
      {
        term: "Selanik Askeri Rüştiyesi",
        desc: "Mustafa Kemal'in kendi kararlılığıyla sınavını kazanıp girdiği ve matematik öğretmeninin ona 'Kemal' adını verdiği okuldur.",
      },
      {
        term: "Manastır Askeri İdadisi",
        desc: "Mustafa Kemal'in edebiyat, tarih, vatan sevgisi ve fikir dünyasının en güçlü şekilde olgunlaştığı lisedir.",
      },
      {
        term: "Kurmay Yüzbaşı",
        desc: "Mustafa Kemal'in İstanbul Harp Akademisi'ni başarıyla bitirerek ulaştığı ilk subaylık rütbesidir.",
      },
    ],
    example:
      "Bir mimar binayı inşa etmeden önce sağlam bir temel atar. Mustafa Kemal'in Selanik'teki çok kültürlü ortamda büyümesi, Manastır'da vatan şairlerini okuyup Fransızca öğrenmesi, ileride Kurtuluş Savaşı'nı yönetecek ve Cumhuriyeti kuracak büyük bir lider olmasının sağlam temellerini oluşturmuştur.",
    mustKnow:
      "1) Mustafa Kemal'e 'Kemal' adı Selanik Askeri Rüştiyesi'nde matematik öğretmeni tarafından verilmiştir.\n" +
      "2) Tarih bilinci ve vatanseverlik duyguları en çok Manastır Askeri İdadisi yıllarında güçlenmiştir.\n" +
      "3) İstanbul Harp Akademisi'nden Kurmay Yüzbaşı rütbesiyle mezun olup ilk görev yeri Şam'a gitmiştir.\n" +
      "4) Selanik'in çok uluslu yapısı onda hoşgörü ve farklı fikirlere saygı anlayışını geliştirmiştir.",
    questions: [
      {
        questionType: "MULTIPLE_CHOICE",
        questionText:
          "Mustafa Kemal'e matematik öğretmeni Yüzbaşı Mustafa Bey tarafından 'Kemal' adının verildiği okul aşağıdakilerden hangisidir?",
        optionsJson: JSON.stringify([
          "A) Şemsi Efendi Mektebi",
          "B) Selanik Askeri Rüştiyesi",
          "C) Manastır Askeri İdadisi",
          "D) İstanbul Harp Okulu",
        ]),
        correctAnswer: "B",
        explanation:
          "Selanik Askeri Rüştiyesi'ndeki matematik öğretmeni, öğrencisinin yetenek ve olgunluğunu takdir ederek ona 'Kemal' (olgunluk, kusursuzluk) adını vermiştir.",
        points: 20,
      },
      {
        questionType: "MULTIPLE_CHOICE",
        questionText:
          "Mustafa Kemal'in tarih bilincinin pekiştiği, Namık Kemal ve Mehmet Emin Yurdakul gibi vatan şairlerinden etkilenerek fikir dünyasını güçlendirdiği okul hangisidir?",
        optionsJson: JSON.stringify([
          "A) Manastır Askeri İdadisi",
          "B) Mahalle Mektebi",
          "C) Selanik Mülkiye Rüştiyesi",
          "D) Şam Askeri Kışlası",
        ]),
        correctAnswer: "A",
        explanation:
          "Manastır Askeri İdadisi'nde arkadaşı Ömer Naci sayesinde edebiyata, tarih öğretmeni Mehmet Tevfik Bey sayesinde tarihe derin ilgi duymuştur.",
        points: 20,
      },
      {
        questionType: "FILL_BLANK",
        questionText:
          "Mustafa Kemal'in annesi Zübeyde Hanım onun geleneksel eğitim veren _________ Mektebi'ne gitmesini istemiştir.",
        optionsJson: null,
        correctAnswer: "Mahalle",
        explanation:
          "Annesi geleneksel Mahalle Mektebi'ni, babası ise modern eğitim veren Şemsi Efendi Mektebi'ni istemiştir.",
        points: 20,
      },
      {
        questionType: "TRUE_FALSE",
        questionText:
          "Mustafa Kemal İstanbul Harp Akademisi'nden 'Kurmay Yüzbaşı' rütbesiyle mezun olmuş ve ilk görev yeri Şam'daki 5. Ordu olmuştur.",
        optionsJson: JSON.stringify(["Doğru", "Yanlış"]),
        correctAnswer: "Doğru",
        explanation:
          "Mustafa Kemal 1905 yılında kurmay yüzbaşı olarak mezun olmuş ve doğrudan Şam 5. Ordu emrine atanmıştır.",
        points: 20,
      },
      {
        questionType: "MATCHING",
        questionText: "Mustafa Kemal'in okullarını ve bu okullardaki önemli gelişmeleri eşleştiriniz:",
        optionsJson: JSON.stringify([
          { left: "Şemsi Efendi Mektebi", right: "İlk modern ve yenilikçi eğitim kurumu" },
          { left: "Selanik Askeri Rüştiyesi", right: "'Kemal' adının verilmesi" },
          { left: "Harp Akademisi", right: "Kurmay Yüzbaşı olarak mezuniyet" },
        ]),
        correctAnswer: JSON.stringify({
          "Şemsi Efendi Mektebi": "İlk modern ve yenilikçi eğitim kurumu",
          "Selanik Askeri Rüştiyesi": "'Kemal' adının verilmesi",
          "Harp Akademisi": "Kurmay Yüzbaşı olarak mezuniyet",
        }),
        explanation:
          "Şemsi Efendi modern eğitime ilk adım, Selanik Askeri Rüştiyesi Kemal adını alış, Harp Akademisi kurmay yüzbaşılık rütbesidir.",
        points: 20,
      },
    ],
  },

  // İTA.8.1.1: 20. Yüzyıl Başlarında Osmanlı Devleti
  "İTA.8.1.1": {
    topicTitle: "20. Yüzyıl Başlarında Osmanlı Devleti",
    introduction:
      "Merhaba! 8. Sınıf İnkılap Tarihi dersimizin ilk konusunda, Osmanlı Devleti'nin 20. yüzyılın başlarındaki siyasi, askeri ve sosyal yapısını etkileyen iki devasa olayı inceleyeceğiz: Sanayi İnkılabı ve Fransız İhtilali.",
    summary:
      "Avrupa'da Sanayi İnkılabı ile birlikte hammadde ve pazar arayışı hızlandı; bu durum sömürgecilik yarışını doğurdu. Avrupalı devletler Osmanlı Devleti'ni açık bir pazar olarak gördüler ve kapitülasyonlar nedeniyle Osmanlı yerli üretimi çöktü. Düyun-ı Umumiye İdaresi kurularak Osmanlı'nın gelir kaynaklarına el konuldu.\n\n" +
      "Diğer yandan 1789 Fransız İhtilali ile yayılan milliyetçilik akımı, çok uluslu bir imparatorluk olan Osmanlı'da yaşayan azınlıkların (Sırplar, Yunanlar, Bulgarlar) isyan etmesine yol açtı. Osmanlı aydınları ve devlet adamları devleti parçalanmaktan kurtarmak için Tanzimat Fermanı (1839), Islahat Fermanı (1856) ve I. ve II. Meşrutiyet'i ilan ettiler.\n\n" +
      "Bu süreçte devleti kurtarmak için 4 temel fikir akımı ortaya çıktı: Osmanlıcılık, İslamcılık, Türkçülük ve Batıcılık.",
    keyConcepts: [
      {
        term: "Sanayi İnkılabı",
        desc: "Üretimde makineleşme, hammadde ve pazar arayışını artırarak sömürgeciliğe yol açan ekonomik devrim.",
      },
      {
        term: "Milliyetçilik Akımı",
        desc: "Fransız İhtilali ile yayılan ve her milletin kendi devletini kurma hakkını savunan akım.",
      },
      {
        term: "Düyun-ı Umumiye",
        desc: "Osmanlı Devleti'nin dış borçlarını tahsil etmek için Avrupalı alacaklılar tarafından kurulan Genel Borçlar İdaresi.",
      },
      {
        term: "Osmanlıcılık",
        desc: "Din, dil ve ırk farkı gözetmeksizin herkesi eşit birer Osmanlı vatandaşı sayarak devleti bir arada tutmayı amaçlayan akım.",
      },
      {
        term: "Türkçülük",
        desc: "Devletin kurtuluşunu Türk milletinin milli değerlerine ve birliğine dayandıran fikir akımı.",
      },
    ],
    example:
      "Çok dilli ve çok kültürlü büyük bir ailenin bireyleri dışarıdan gelen kışkırtmalarla 'ben kendi evimi kuracağım' diyerek ayrılmaya başlarsa o büyük ev zayıflar. Osmanlı'da yaşanan azınlık isyanları da tam olarak böyle gerçekleşmiştir.",
    mustKnow:
      "1) Sanayi İnkılabı Osmanlı ekonomisini hammadde kaynağı ve açık pazar haline getirmiştir.\n" +
      "2) Fransız İhtilali'nin milliyetçilik fikri Osmanlı'daki azınlıkların isyan edip bağımsızlık kazanmasına neden olmuştur.\n" +
      "3) Düyun-ı Umumiye Osmanlı Devleti'nin ekonomik bağımsızlığını kaybettiğinin en somut kanıtıdır.",
    questions: [
      {
        questionType: "MULTIPLE_CHOICE",
        questionText:
          "Osmanlı Devleti'nde yaşayan azınlıkların isyan ederek bağımsız devletler kurmak istemesinde hangi tarihi gelişme doğrudan etkili olmuştur?",
        optionsJson: JSON.stringify([
          "A) Fransız İhtilali'nin yaydığı Milliyetçilik akımı",
          "B) Coğrafi Keşifler",
          "C) Rönesans hareketleri",
          "D) Reform hareketleri",
        ]),
        correctAnswer: "A",
        explanation:
          "Fransız İhtilali ile dünyaya yayılan 'her millete bir devlet' ilkesi (milliyetçilik), Osmanlı azınlıklarının isyan etmesine zemin hazırlamıştır.",
        points: 25,
      },
      {
        questionType: "TRUE_FALSE",
        questionText:
          "Düyun-ı Umumiye İdaresi, Osmanlı Devleti'nin dış borçlarını ödeyememesi üzerine alacaklı Avrupalı devletlerin Osmanlı maliyesine el koyduğu kurumdur.",
        optionsJson: JSON.stringify(["Doğru", "Yanlış"]),
        correctAnswer: "Doğru",
        explanation:
          "1881 yılında kurulan Düyun-ı Umumiye, Osmanlı'nın ekonomik bağımsızlığına vurulmuş ağır bir darbedir.",
        points: 25,
      },
      {
        questionType: "FILL_BLANK",
        questionText:
          "Din, dil, ırk ayrımı gözetmeksizin tüm tebaayı eşit kabul ederek devleti parçalanmaktan kurtarmayı hedefleyen fikir akımına _________ denir.",
        optionsJson: null,
        correctAnswer: "Osmanlıcılık",
        explanation:
          "Osmanlıcılık, herkesi ortak bir Osmanlı kimliği altında birleştirmeyi amaçlamıştır.",
        points: 25,
      },
      {
        questionType: "MULTIPLE_CHOICE",
        questionText:
          "Avrupalı devletlerin Sanayi İnkılabı sonucunda en çok ihtiyaç duyduğu iki temel unsur hangisidir?",
        optionsJson: JSON.stringify([
          "A) Hammadde ve Pazar",
          "B) Askeri ittifak ve din adamı",
          "C) Matbaa ve kağıt",
          "D) Tarım arazisi ve feodal beyler",
        ]),
        correctAnswer: "A",
        explanation:
          "Fabrikalarda üretimi sürdürmek için hammadde, üretilen malları satmak için ise pazar arayışı sömürgeciliği tetiklemiştir.",
        points: 25,
      },
    ],
  },

  // ==========================================
  // FEN BİLİMLERİ (8. SINIF)
  // ==========================================
  "F.8.1.1.1": {
    topicTitle: "Mevsimlerin Oluşumu ve Dünya'nın Eksen Eğikliği",
    introduction:
      "Merhaba! 8. Sınıf Fen Bilimleri dersimizin ilk ünitesinde Dünya'nın uzaydaki hareketlerini ve mevsimlerin nasıl oluştuğunu inceleyeceğiz. Derse hazırlıklı gelerek Güneş ışınlarının geliş açısı ve birim yüzeye düşen enerji kavramlarını kolayca kavra!",
    summary:
      "Mevsimlerin oluşmasının iki temel sebebi vardır:\n" +
      "1) Dünya'nın dönme ekseninin 23° 27' (23 derece 27 dakika) eğik olması,\n" +
      "2) Dünya'nın Güneş etrafında elips şeklindeki yörüngede dolanması.\n\n" +
      "Çok Önemli Yanılgı: Dünya'nın Güneş'e olan uzaklığının mevsimlerin oluşumuyla hiçbir ilgisi yoktur! Nitekim Dünya'nın Güneş'e en yakın olduğu tarih 3 Ocak'tır fakat Kuzey Yarım Küre'de bu tarihte kış yaşanır.\n\n" +
      "Güneş ışınları dik veya dike yakın (büyük) açıyla geldiğinde birim yüzeye düşen ışık enerjisi miktarı fazla olur ve o bölgede yaz mevsimi yaşanır. Işınlar eğik (küçük) açıyla geldiğinde ise enerji geniş alana dağılır, birim yüzeye düşen enerji azalır ve kış mevsimi yaşanır.\n\n" +
      "21 Haziran: Kuzey Yarım Küre'de yaz başlangıcı (en uzun gündüz). 21 Aralık: Kuzey Yarım Küre'de kış başlangıcı (en uzun gece). 21 Mart ve 23 Eylül: Ekinoks (gece-gündüz eşitliği).",
    keyConcepts: [
      {
        term: "Eksen Eğikliği (23° 27')",
        desc: "Dünya'nın dönme ekseni ile dolanma düzlemi arasındaki 23 derece 27 dakikalık kalıcı açı.",
      },
      {
        term: "Geliş Açısı",
        desc: "Güneş ışınlarının yeryüzüne düşme açısı. Açı büyüdükçe sıcaklık artar.",
      },
      {
        term: "Birim Yüzeye Düşen Enerji",
        desc: "Dik açıyla gelen ışınların dar alanda yoğunlaştırdığı yüksek enerji miktarı.",
      },
      {
        term: "Ekinoks",
        desc: "21 Mart ve 23 Eylül tarihlerinde tüm dünyada gece ve gündüz sürelerinin eşit (12 saat) olması durumu.",
      },
      {
        term: "Gün Dönümü (Solstis)",
        desc: "21 Haziran ve 21 Aralık tarihlerinde yaşanan en uzun gündüz veya en uzun gece dönüm noktaları.",
      },
    ],
    example:
      "El fenerini masaya tam dik tuttuğunda küçük bir daire çok parlak ve sıcacık olur. Feneri yana doğru eğdiğinde ise ışık masada çok geniş bir alana yayılır ama masadaki aydınlık ve ısı yoğunluğu seyrekleşir. Yaz ve kış farkı tam olarak budur!",
    mustKnow:
      "1) Mevsimlerin temel sebebi eksen eğikliği ve dolanma hareketidir.\n" +
      "2) Güneş'e yakınlık ya da uzaklık mevsimleri oluşturmaz.\n" +
      "3) Kuzey ve Güney Yarım Küre'de her zaman aynı anda birbirine zıt mevsimler yaşanır.",
    questions: [
      {
        questionType: "MULTIPLE_CHOICE",
        questionText:
          "Mevsimlerin oluşmasında belirleyici olan iki temel doğa olayı aşağıdakilerden hangisidir?",
        optionsJson: JSON.stringify([
          "A) Dünya'nın eksen eğikliği ve Güneş etrafında dolanması",
          "B) Dünya'nın Güneş'e olan mesafesinin değişmesi",
          "C) Ay'ın Dünya etrafında dolanması",
          "D) Dünya'nın kendi etrafında dönmesi",
        ]),
        correctAnswer: "A",
        explanation:
          "Mevsimler 23° 27'lik eksen eğikliği ve Güneş çevresindeki yıllık dolanma hareketi ile oluşur.",
        points: 20,
      },
      {
        questionType: "TRUE_FALSE",
        questionText:
          "Dünya'nın Güneş'e en yakın olduğu tarih 3 Ocak civarıdır; bu durum mevsimlerin Güneş'e olan uzaklıkla bir ilgisi olmadığını kanıtlar.",
        optionsJson: JSON.stringify(["Doğru", "Yanlış"]),
        correctAnswer: "Doğru",
        explanation:
          "En yakın olunan Ocak ayında Kuzey Yarım Küre'de kış yaşanması mesafenin mevsim belirlemediğini gösterir.",
        points: 20,
      },
      {
        questionType: "FILL_BLANK",
        questionText:
          "Güneş ışınlarının yeryüzüne dik açıyla düştüğü bölgelerde birim yüzeye aktarılan ısı enerjisi miktarı _________ olur.",
        optionsJson: null,
        correctAnswer: "fazla",
        explanation:
          "Dik gelen ışınlar enerjiyi dar alanda topladığı için birim yüzey enerjisi fazla olur.",
        points: 20,
      },
      {
        questionType: "MULTIPLE_CHOICE",
        questionText:
          "Kuzey Yarım Küre'de en uzun gündüzün yaşandığı ve yaz mevsiminin başladığı gün dönümü tarihi hangisidir?",
        optionsJson: JSON.stringify([
          "A) 21 Haziran",
          "B) 21 Aralık",
          "C) 21 Mart",
          "D) 23 Eylül",
        ]),
        correctAnswer: "A",
        explanation: "21 Haziran Kuzey Yarım Küre için yaz gündönümüdür.",
        points: 20,
      },
      {
        questionType: "MATCHING",
        questionText: "Önemli mevsim tarihlerini özellikleriyle eşleştiriniz:",
        optionsJson: JSON.stringify([
          { left: "21 Haziran", right: "Kuzey Yarım Küre'de en uzun gündüz" },
          { left: "21 Aralık", right: "Kuzey Yarım Küre'de en uzun gece" },
          { left: "21 Mart / 23 Eylül", right: "Ekinoks (Gece-gündüz eşitliği)" },
        ]),
        correctAnswer: JSON.stringify({
          "21 Haziran": "Kuzey Yarım Küre'de en uzun gündüz",
          "21 Aralık": "Kuzey Yarım Küre'de en uzun gece",
          "21 Mart / 23 Eylül": "Ekinoks (Gece-gündüz eşitliği)",
        }),
        explanation:
          "21 Haziran yaz, 21 Aralık kış başlangıcı, 21 Mart ve 23 Eylül gece-gündüz eşitliğidir.",
        points: 20,
      },
    ],
  },

  // F.8.2.1.1: DNA ve Genetik Kod
  "F.8.2.1.1": {
    topicTitle: "DNA ve Genetik Kod Kavramları",
    introduction:
      "Merhaba! 8. Sınıf LGS hazırlığının en önemli biyoloji konularından biri olan kalıtım ve genetik koda adım atıyoruz. Kromozom, DNA, gen ve nükleotid kavramları arasındaki hiyerarşik ilişkiyi dersten önce öğren!",
    summary:
      "Hücrenin yönetim ve kalıtım merkezi çekirdektir. Çekirdek içindeki kalıtsal yapılar karmaşıktan basite (büyükten küçüğe) şu şekilde sıralanır (Şifre: KEDİGENİ):\n\n" +
      "Kromozom > DNA > Gen > Nükleotid\n\n" +
      "1) Kromozom: DNA'nın özel protein kılıfla sarılmış en karmaşık paket halidir. İnsan vücut hücresinde 46 kromozom bulunur (Kromozom sayısının canlının gelişmişliği ile ilgisi yoktur; moli balığı da 46 kromozomludur).\n" +
      "2) DNA: Çift zincirli ve sarmal yapıda olan yönetici moleküldür.\n" +
      "3) Gen: DNA'nın görev birimidir. Göz rengi, saç şekli gibi kalıtsal özellikleri belirler.\n" +
      "4) Nükleotid: DNA'nın en küçük yapı birimidir. Bir nükleotidin yapısında 1 Fosfat + 1 Deoksiriboz Şekeri + 1 Organik Baz bulunur. Nükleotitler taşıdıkları organik baza göre adlandırılır (Adenin, Timin, Guanin, Sitozin). DNA sarmalında her zaman Adenin karşısına Timin (A=T), Guanin karşısına Sitozin (G≡C) gelir.",
    keyConcepts: [
      {
        term: "Kromozom",
        desc: "DNA'nın özel proteinlerle birleşerek oluşturduğu en büyük ve en karmaşık kalıtsal yapıdır.",
      },
      {
        term: "DNA",
        desc: "Çift zincirli sarmal yapıdaki yönetici moleküldür.",
      },
      {
        term: "Gen",
        desc: "DNA üzerindeki belirli özellikleri şifreleyen anlamlı görev birimidir.",
      },
      {
        term: "Nükleotid",
        desc: "DNA'nın en küçük yapı birimidir. Fosfat, şeker ve organik bazdan oluşur.",
      },
    ],
    example:
      "Bir ansiklopediyi düşünelim: Ansiklopedi kütüphanesi = Kromozom, Cildin tamamı = DNA, Cilt içindeki bir konu fasikülü = Gen, Fasiküldeki her bir harf = Nükleotid'dir.",
    mustKnow:
      "1) Sıralama büyükten küçüğe: Kromozom > DNA > Gen > Nükleotid (KEDİGENİ).\n" +
      "2) DNA'nın görev birimi Gen, yapı birimi Nükleotid'dir.\n" +
      "3) Nükleotidler içerdikleri organik baza göre isimlendirilir.\n" +
      "4) Adenin daima Timin ile, Guanin daima Sitozin ile eşleşir.",
    questions: [
      {
        questionType: "MULTIPLE_CHOICE",
        questionText:
          "Kalıtsal yapıların karmaşıktan basite (büyükten küçüğe) doğru sıralanışı hangisinde doğru verilmiştir?",
        optionsJson: JSON.stringify([
          "A) Kromozom > DNA > Gen > Nükleotid",
          "B) Nükleotid > Gen > DNA > Kromozom",
          "C) DNA > Kromozom > Nükleotid > Gen",
          "D) Gen > Nükleotid > DNA > Kromozom",
        ]),
        correctAnswer: "A",
        explanation:
          "KEDİGENİ kodlaması: Kromozom > DNA > Gen > Nükleotid şeklindedir.",
        points: 25,
      },
      {
        questionType: "TRUE_FALSE",
        questionText:
          "DNA'nın 'görev birimi' gen iken, 'yapı birimi' nükleotiddir.",
        optionsJson: JSON.stringify(["Doğru", "Yanlış"]),
        correctAnswer: "Doğru",
        explanation:
          "Evet, genler görevleri şifreler, nükleotidler ise DNA'yı inşa eden yapı taşlarıdır.",
        points: 25,
      },
      {
        questionType: "FILL_BLANK",
        questionText:
          "Bir nükleotidin yapısında fosfat ve deoksiriboz şekerine ek olarak bir adet organik _________ bulunur.",
        optionsJson: null,
        correctAnswer: "baz",
        explanation:
          "Nükleotid yapısı: Fosfat + Deoksiriboz Şekeri + Organik Baz.",
        points: 25,
      },
      {
        questionType: "MULTIPLE_CHOICE",
        questionText:
          "Sağlıklı bir DNA molekülünde Adenin nükleotidinin karşısına daima hangi nükleotid gelir?",
        optionsJson: JSON.stringify([
          "A) Timin",
          "B) Guanin",
          "C) Sitozin",
          "D) Urasil",
        ]),
        correctAnswer: "A",
        explanation: "DNA çift zincirinde A daima T ile, G daima C ile eşleşir.",
        points: 25,
      },
    ],
  },

  // ==========================================
  // MATEMATİK (8. SINIF)
  // ==========================================
  "M.8.1.1.1": {
    topicTitle: "Çarpanlar ve Katlar / Asal Çarpanlar",
    introduction:
      "Merhaba! 8. Sınıf LGS Matematik maratonunun başlangıç konusu olan 'Çarpanlar ve Katlar' ile derse hazırlanıyoruz. Pozitif tam sayıların çarpanlarını bulma ve asal çarpanlarına ayırma mantığını sınıfa girmeden önce kavra!",
    summary:
      "Her pozitif tam sayı iki pozitif tam sayının çarpımı şeklinde yazılabilir. Bu sayılara o sayının çarpanları (bölenleri) denir. Bir sayının çarpanı aynı zamanda o sayının tam bölenidir.\n\n" +
      "Asal Sayılar: 1 ve kendisinden başka hiçbir pozitif tam sayıya bölünemeyen 1'den büyük doğal sayılardır (2, 3, 5, 7, 11, 13, 17, 19...).\n" +
      "- En küçük asal sayı 2'dir.\n" +
      "- 2'den başka çift asal sayı yoktur.\n\n" +
      "Asal Çarpanlara Ayırma İki Yöntemle Yapılır:\n" +
      "1) Bölen Listesi (Asal Çarpan Algoritması): Sayı en küçük asal sayıdan başlanarak 1 elde edilene kadar bölünür.\n" +
      "2) Çarpan Ağacı Yöntemi: Sayı dallara ayrılarak en alt dallarda sadece asal sayılar kalana kadar çarpanlara ayrılır.\n\n" +
      "Örnek: 24 sayısı = 2 x 2 x 2 x 3 = 2³ x 3¹ şeklinde üslü ifadelerin çarpımı olarak gösterilir. 24'ün asal çarpanları 2 ve 3'tür.",
    keyConcepts: [
      {
        term: "Çarpan (Bölen)",
        desc: "Bir sayıyı kalansız olarak bölebilen pozitif tam sayıların her biri.",
      },
      {
        term: "Asal Sayı",
        desc: "Sadece 1'e ve kendisine bölünebilen 1'den büyük doğal sayılar (2, 3, 5, 7...).",
      },
      {
        term: "Bölen Listesi",
        desc: "Sayının yanına dikey çizgi çekilerek sırasıyla asal sayılara bölündüğü algoritma.",
      },
      {
        term: "Üslü Gösterim",
        desc: "Asal çarpanların kaç kez tekrarlandığını üs olarak yazma biçimi (ör: 72 = 2³ . 3²).",
      },
    ],
    example:
      "36 sayısının çarpanlarını bulalım: 1x36, 2x18, 3x12, 4x9, 6x6. Çarpanları: 1, 2, 3, 4, 6, 9, 12, 18, 36 (9 adet). Bunlardan asal olanları ise yalnızca 2 ve 3'tür. 36 = 2² . 3² olarak yazılır.",
    mustKnow:
      "1) 1 asal sayı DEĞİLDİR.\n" +
      "2) En küçük asal sayı ve tek çift asal sayı 2'dir.\n" +
      "3) Bir sayının pozitif çarpanları ile pozitif bölenleri aynı anlama gelir.\n" +
      "4) Asal çarpanlar üslü ifadelerin çarpımı şeklinde gösterilebilir.",
    questions: [
      {
        questionType: "MULTIPLE_CHOICE",
        questionText:
          "Aşağıdaki sayılardan hangisi hem bir çift sayı hem de bir asal sayıdır?",
        optionsJson: JSON.stringify(["A) 0", "B) 1", "C) 2", "D) 4"]),
        correctAnswer: "C",
        explanation: "2 sayısı matematikteki tek çift asal sayıdır.",
        points: 25,
      },
      {
        questionType: "MULTIPLE_CHOICE",
        questionText:
          "60 sayısının asal çarpanlarına ayrılmış üslü gösterimi aşağıdakilerden hangisidir?",
        optionsJson: JSON.stringify([
          "A) 2² × 3 × 5",
          "B) 2 × 3² × 5",
          "C) 4 × 15",
          "D) 2³ × 5",
        ]),
        correctAnswer: "A",
        explanation: "60 = 4 × 3 × 5 = 2² × 3 × 5'tir.",
        points: 25,
      },
      {
        questionType: "TRUE_FALSE",
        questionText:
          "1 sayısı tüm doğal sayıların bölenidir ve aynı zamanda en küçük asal sayıdır.",
        optionsJson: JSON.stringify(["Doğru", "Yanlış"]),
        correctAnswer: "Yanlış",
        explanation:
          "1 sayısı tüm sayıların bölenidir ancak asal sayı DEĞİLDİR. En küçük asal sayı 2'dir.",
        points: 25,
      },
      {
        questionType: "FILL_BLANK",
        questionText:
          "36 sayısının asal olan çarpanları 2 ve _________ sayılarıdır.",
        optionsJson: null,
        correctAnswer: "3",
        explanation: "36 = 2² × 3² olduğundan asal çarpanları sadece 2 ve 3'tür.",
        points: 25,
      },
    ],
  },

  // M.8.1.2.1: Üslü İfadeler
  "M.8.1.2.1": {
    topicTitle: "Üslü İfadeler ve Negatif Kuvvet",
    introduction:
      "Merhaba! 8. Sınıf Matematik dersinde üslü ifadelerin en kritik aşaması olan 'negatif üs' ve kuvvet kurallarını inceleyeceğiz. Derste işlem hatası yapmamak için bu temel kuralları şimdi öğren!",
    summary:
      "Bir sayının kendisiyle tekrarlı çarpımı üslü ifadeyle gösterilir: a^n.\n\n" +
      "Negatif Üs Kuralı: Bir sayının negatif kuvveti, o sayının çarpma işlemine göre tersinin pozitif kuvvetidir. Negatif üs sayıyı eksi yapmaz; sadece paydaya atar (takla attırır)!\n" +
      "a^(-n) = 1 / a^n\n" +
      "Örnek: 2^(-3) = 1 / 2³ = 1/8'dir.\n" +
      "(2/3)^(-2) = (3/2)² = 9/4'tür.\n\n" +
      "Önemli Kurallar:\n" +
      "1) Sıfır hariç her sayının 0. kuvveti 1'dir: a⁰ = 1.\n" +
      "2) 1'in her kuvveti 1'dir.\n" +
      "3) Negatif sayıların parantezli çift kuvveti pozitif, tek kuvveti negatiftir: (-2)² = +4 ama -2² = -4'tür!",
    keyConcepts: [
      {
        term: "Negatif Üs",
        desc: "a^(-n) = 1 / a^n kuralıyla sayının ters çevrilmesini (pay ve payda yer değiştirmesini) sağlayan kuvvet.",
      },
      {
        term: "Sıfırıncı Kuvvet",
        desc: "Sıfır hariç tüm sayıların sıfırıncı kuvvetinin 1 olması kuralı (5⁰ = 1).",
      },
      {
        term: "Parantez Farkı",
        desc: "(-3)² = +9 iken, parantezsiz -3² = -9 olması durumu.",
      },
    ],
    example:
      "5^(-2) işlemini yaparken sakın -10 veya -25 deme! Üsteki eksi işareti sayıyı ters çevirir: 1 / 5² = 1 / 25 olur.",
    mustKnow:
      "1) Negatif üs sayının işaretini negatif YAPMAZ, sayıyı çarpmaya göre tersine çevirir.\n" +
      "2) (-a)^çift = pozitif, (-a)^tek = negatif.\n" +
      "3) Parantez yoksa işaret kuvvetten etkilenmez.",
    questions: [
      {
        questionType: "MULTIPLE_CHOICE",
        questionText: "3⁻² ifadesinin sayısal değeri kaçtır?",
        optionsJson: JSON.stringify(["A) 1/9", "B) -9", "C) -6", "D) 1/6"]),
        correctAnswer: "A",
        explanation: "3⁻² = 1 / 3² = 1/9'dur.",
        points: 25,
      },
      {
        questionType: "TRUE_FALSE",
        questionText:
          "Negatif üs, bir sayının önüne eksi işareti koyarak sayıyı negatif bir sayıya dönüştürür.",
        optionsJson: JSON.stringify(["Doğru", "Yanlış"]),
        correctAnswer: "Yanlış",
        explanation:
          "Negatif üs sayıyı negatif yapmaz; sayıyı ters çevirerek 1/a^n haline getirir.",
        points: 25,
      },
      {
        questionType: "FILL_BLANK",
        questionText: "Sıfırdan farklı her tam sayının sıfırıncı kuvveti daima _________ sayısına eşittir.",
        optionsJson: null,
        correctAnswer: "1",
        explanation: "a⁰ = 1 kuralıdır.",
        points: 25,
      },
      {
        questionType: "MULTIPLE_CHOICE",
        questionText: "(-2)⁴ ile -2⁴ işlemlerinin sonuçları sırasıyla hangisinde doğru verilmiştir?",
        optionsJson: JSON.stringify([
          "A) +16 ve -16",
          "B) -16 ve +16",
          "C) +16 ve +16",
          "D) -8 ve +8",
        ]),
        correctAnswer: "A",
        explanation:
          "(-2)⁴ parantez içinde çift kuvvet olduğu için +16, -2⁴ ise parantezsiz olduğu için -16'dır.",
        points: 25,
      },
    ],
  },

  // ==========================================
  // DİN KÜLTÜRÜ VE AHLAK BİLGİSİ (8. SINIF)
  // ==========================================
  "DİN.8.1.1": {
    topicTitle: "Kader ve Kaza İnancı / Evrendeki Yasalar",
    introduction:
      "Merhaba! 8. Sınıf Din Kültürü dersimizin 1. ünitesi olan Kader İnancı konusunu inceleyeceğiz. Evrendeki mükemmel düzen, sünnetullah ve fiziksel-biyolojik-toplumsal yasalar hakkında ön bilgi edinmeye hazır mısın?",
    summary:
      "Kader: Allah'ın başlangıçtan sonsuza kadar meydana gelecek her şeyi belirli bir ölçü, düzen ve uyum içinde planlaması ve takdir etmesidir.\n" +
      "Kaza: Allah'ın takdir ettiği bu plan ve yasaların zamanı gelince gerçekleşip meydana gelmesidir.\n\n" +
      "Sünnetullah (Evrendeki Yasalar):\n" +
      "Allah evreni başıboş bırakmamış, belirli ilahi kanunlara bağlamıştır. Bu yasalar üçe ayrılır:\n" +
      "1) Fiziksel Yasalar: Madde ve enerjinin yapısı, değişimi ve hareketini inceler. Evrensel ve deneyle sabittir (Yerçekimi kanunu, suyun 100°C'de kaynaması, gemilerin suda yüzmesi).\n" +
      "2) Biyolojik Yasalar: Canlıların doğması, gelişmesi, üremesi ve anatomik yapısıyla ilgilidir (Kuşların uçmasını sağlayan kanat yapısı, fotosentez, canlıların solunumu).\n" +
      "3) Toplumsal Yasalar: İnsanlar arasındaki ilişkiler, adalet, ahlak, eşitlik ve toplumların huzur kurallarıdır (Adaletin olmadığı toplumların çökmesi, göçler).",
    keyConcepts: [
      {
        term: "Kader",
        desc: "Allah'ın her şeyi bir ölçü, düzen ve kanuna göre önceden takdir etmesi ve planlaması.",
      },
      {
        term: "Kaza",
        desc: "Takdir edilen olayların yeri ve zamanı geldiğinde gerçekleşmesi.",
      },
      {
        term: "Sünnetullah",
        desc: "Allah'ın evrendeki düzeni sağlamak için koyduğu değişmez fiziksel, biyolojik ve toplumsal yasaların genel adı.",
      },
      {
        term: "Ölçü ve Denge",
        desc: "Evrende hiçbir şeyin tesadüf olmadığını, her varlığın kusursuz bir ahenk içinde yaratıldığını ifade eden ilke.",
      },
    ],
    example:
      "Bir mimarın binanın projesini çizip planlaması 'kader', o binanın projeye uygun olarak tuğla tuğla inşa edilip tamamlanması ise 'kaza'dır.",
    mustKnow:
      "1) Kader plan ve ölçü, kaza ise o planın gerçekleşmesidir.\n" +
      "2) Fiziksel yasalar maddeyi, biyolojik yasalar canlıları, toplumsal yasalar insan ilişkilerini konu alır.\n" +
      "3) Evrendeki hiçbir kanun tesadüf eseri değildir.",
    questions: [
      {
        questionType: "MULTIPLE_CHOICE",
        questionText:
          "Gemilerin suyun kaldırma kuvveti sayesinde batmadan yüzebilmesi evrendeki yasalardan hangisine örnektir?",
        optionsJson: JSON.stringify([
          "A) Fiziksel Yasa",
          "B) Biyolojik Yasa",
          "C) Toplumsal Yasa",
          "D) Kimyasal Denge Yasası",
        ]),
        correctAnswer: "A",
        explanation:
          "Madde ve enerjinin hareketine dayalı kanunlar fiziksel yasalardır.",
        points: 25,
      },
      {
        questionType: "MULTIPLE_CHOICE",
        questionText:
          "Balıkların suda solunum yapabilmeleri için solungaçlara sahip olması hangi yasa kapsamındadır?",
        optionsJson: JSON.stringify([
          "A) Biyolojik Yasa",
          "B) Fiziksel Yasa",
          "C) Toplumsal Yasa",
          "D) Astronomik Yasa",
        ]),
        correctAnswer: "A",
        explanation:
          "Canlıların yapısı ve yaşamsal özellikleri biyolojik yasalarla açıklanır.",
        points: 25,
      },
      {
        questionType: "TRUE_FALSE",
        questionText:
          "Kader Allah'ın her şeyi önceden bir ölçü ve plana göre takdir etmesi, kaza ise zamanı geldiğinde bu takdirin gerçekleşmesidir.",
        optionsJson: JSON.stringify(["Doğru", "Yanlış"]),
        correctAnswer: "Doğru",
        explanation:
          "Kader takdir ve plan, kaza ise gerçekleşme ve yaratılmadır.",
        points: 25,
      },
      {
        questionType: "FILL_BLANK",
        questionText:
          "Allah'ın evrene koyduğu fiziksel, biyolojik ve toplumsal yasaların Kur'an'daki genel adı _________ kavramı ile ifade edilir.",
        optionsJson: null,
        correctAnswer: "Sünnetullah",
        explanation: "Sünnetullah Allah'ın evrendeki değişmez kanunlarıdır.",
        points: 25,
      },
    ],
  },

  // ==========================================
  // İNGİLİZCE (8. SINIF)
  // ==========================================
  "E8.1.L1": {
    topicTitle: "Friendship / Making Offers & Polite Responses",
    introduction:
      "Hello! Welcome to 8th Grade Unit 1: Friendship. Before coming to class, let's learn how to make offers, accept or refuse invitations politely, and talk about personal qualities of a true friend!",
    summary:
      "In this unit, we learn communication expressions for invitations and friend qualities:\n\n" +
      "1) Making Offers & Invitations:\n" +
      "- Would you like to join us? (Bize katılmak ister misin?)\n" +
      "- How about going to the cinema? (Sinemaya gitmeye ne dersin?)\n" +
      "- Why don't we drink something? (Neden bir şeyler içmiyoruz?)\n\n" +
      "2) Accepting Politely:\n" +
      "- Yes, I'd love to! (Evet, çok isterim!)\n" +
      "- Sure, that sounds fun / great! (Elbette, kulağa harika geliyor!)\n\n" +
      "3) Refusing & Making Excuses (Kibarca Reddetme ve Mazeret):\n" +
      "- I'm sorry, but I can't. I have to study. (Üzgünüm ama yapamam, ders çalışmak zorundayım.)\n" +
      "- I'd love to, but I'm busy. (Çok isterdim ama meşgulüm.)\n\n" +
      "4) Personal Qualities of a True Friend:\n" +
      "- Honest (dürüst), Reliable (güvenilir), Supportive (destekleyici), Generous (cömert), Loyal (sadık).",
    keyConcepts: [
      {
        term: "Would you like...?",
        desc: "Kibarca teklifte bulunurken kullanılan en yaygın kalıp.",
      },
      {
        term: "Accepting",
        desc: "Bir daveti 'Sure, sounds great' diyerek kabul etme.",
      },
      {
        term: "Refusing with excuse",
        desc: "Daveti reddederken 'I'm sorry, but...' diyerek mazeret belirtme.",
      },
      {
        term: "Reliable",
        desc: "Sır saklayan, sözünde duran 'güvenilir' arkadaş özelliği.",
      },
    ],
    example:
      "— Would you like to come to my birthday party on Saturday?\n— I'd love to, but I can't because my grandparents are visiting us.",
    mustKnow:
      "1) Teklif cümleleri: Would you like...?, How about...?, Shall we...?\n" +
      "2) Reddedildiğinde mutlaka mazeret (excuse) belirtmek nezakettir.\n" +
      "3) True friends count on (güvenmek) and back up (desteklemek) each other.",
    questions: [
      {
        questionType: "MULTIPLE_CHOICE",
        questionText:
          "Which of the following is a polite way to REFUSE an invitation with an excuse?",
        optionsJson: JSON.stringify([
          "A) I'd love to, but I have an exam tomorrow.",
          "B) Sure, that sounds awesome!",
          "C) Why not? See you there.",
          "D) Yes, definitely!",
        ]),
        correctAnswer: "A",
        explanation:
          "'I'd love to, but...' ifadesi mazeret bildirerek kibarca reddetmeyi sağlar.",
        points: 25,
      },
      {
        questionType: "MULTIPLE_CHOICE",
        questionText:
          "A person who always tells the truth and never lies is _________.",
        optionsJson: JSON.stringify([
          "A) honest",
          "B) jealous",
          "C) selfish",
          "D) arrogant",
        ]),
        correctAnswer: "A",
        explanation: "Honest dürüst demektir.",
        points: 25,
      },
      {
        questionType: "TRUE_FALSE",
        questionText:
          "'Sure, that sounds great!' is used when you ACCEPT an offer enthusiastically.",
        optionsJson: JSON.stringify(["Doğru", "Yanlış"]),
        correctAnswer: "Doğru",
        explanation:
          "Kulağa harika geliyor ifadesi teklifi kabul etmek için kullanılır.",
        points: 25,
      },
      {
        questionType: "FILL_BLANK",
        questionText:
          "A true friend always _________ you up when you need help (supports you).",
        optionsJson: null,
        correctAnswer: "backs",
        explanation: "Back up desteklemek, arka çıkmak demektir.",
        points: 25,
      },
    ],
  },

  // ==========================================
  // TÜRKÇE (8. SINIF)
  // ==========================================
  "TÜRK.8.1.1": {
    topicTitle: "Fiilimsiler (İsim-Fiil, Sıfat-Fiil, Zarf-Fiil)",
    introduction:
      "Merhaba! 8. Sınıf LGS Türkçe sınavının temel taşlarından biri olan 'Fiilimsiler' konusuna adım atıyoruz. Fiil kök ve gövdelerinden türeyip cümlede isim, sıfat ve zarf görevi üstlenen bu kelimeleri dersten önce keşfet!",
    summary:
      "Fiilimsiler, fiil kök veya gövdelerine belirli ekler getirilerek yapılan; fiil anlamını korumakla birlikte artık çekimli fiil (yüklem gibi şahıs ve kip eki alan) olmayan sözcüklerdir. Fiilimsiler 3 gruba ayrılır:\n\n" +
      "1) İsim-Fiil (Mastar): Ekleri -ma / -me, -ış / -iş / -uş / -üş, -mak / -mek (Kodlama: MA-YIŞ-MAK).\n" +
      "Örnek: Kitap okumak zihni dinlendirir.\n" +
      "Dikkat: Kalıcı isim olan dondurma, çakmak, dolma gibi sözcükler fiilimsi sayılmaz!\n\n" +
      "2) Sıfat-Fiil (Ortaç): Ekleri -an, -ası, -mez, -ar, -dik, -ecek, -miş (Kodlama: AN-ASI-MEZ-AR-DİK-ECEK-MİŞ).\n" +
      "Örnek: Tanıdık insanlarla karşılaştık (Nasıl insan? Tanıdık insan).\n\n" +
      "3) Zarf-Fiil (Bağ-Fiil / Ulaç): Ekleri -ken, -alı, -esiye, -asıya, -madan, -ince, -ip, -arak, -dıkça, -e...-e, -r...-mez.\n" +
      "Cümleye durum ('Nasıl?') veya zaman ('Ne zaman?') anlamı katar. Örnek: Güle oynaya eve gitti.",
    keyConcepts: [
      {
        term: "İsim-Fiil",
        desc: "-ma, -ış, -mak ekleriyle türeyip isim görevi üstlenen fiilimsiler.",
      },
      {
        term: "Sıfat-Fiil",
        desc: "-an, -ası, -mez, -ar, -dik, -ecek, -miş ekleriyle bir ismi niteleyen fiilimsiler.",
      },
      {
        term: "Zarf-Fiil",
        desc: "Cümleye zaman veya durum anlamı katarak fiili niteleyen fiilimsiler.",
      },
      {
        term: "Kalıcı İsim",
        desc: "Eylemsi ekini alarak bir nesnenin kalıcı adına dönüşen (ekmek, çakmak, sarma) kelimeler.",
      },
    ],
    example:
      "'Koşan çocuk hızlı adımlarla yürüyerek yanımıza geldi.' cümlesinde:\n- koşan: sıfat-fiil (-an)\n- yürüyerek: zarf-fiil (-erek)\n- geldi: çekimli fiildir (yüklem).",
    mustKnow:
      "1) Fiilimsiler kip ve kişi eki alamaz.\n" +
      "2) İsim-fiil: -ma, -ış, -mak.\n" +
      "3) Sıfat-fiil: -an, -ası, -mez, -ar, -dik, -ecek, -miş.\n" +
      "4) Fiilimsiler yan cümlecik oluşturur.",
    questions: [
      {
        questionType: "MULTIPLE_CHOICE",
        questionText:
          "'Gelen yolcuları kapıda karşılamak için sabırsızlanıyordu.' cümlesindeki 'gelen' ve 'karşılamak' sözcüklerinin türü sırasıyla hangisidir?",
        optionsJson: JSON.stringify([
          "A) Sıfat-fiil ve İsim-fiil",
          "B) İsim-fiil ve Zarf-fiil",
          "C) Zarf-fiil ve Sıfat-fiil",
          "D) Çekimli fiil ve İsim-fiil",
        ]),
        correctAnswer: "A",
        explanation:
          "'Gelen' (-en ekiyle) sıfat-fiil, 'karşılamak' (-mak ekiyle) isim-fiildir.",
        points: 25,
      },
      {
        questionType: "TRUE_FALSE",
        questionText:
          "'Annem bugün pazardan sarma ve dondurma aldı.' cümlesindeki 'sarma' ve 'dondurma' sözcükleri kalıcı isim oldukları için fiilimsi DEĞİLDİR.",
        optionsJson: JSON.stringify(["Doğru", "Yanlış"]),
        correctAnswer: "Doğru",
        explanation:
          "Kalıcı isimler bir nesnenin somut adına dönüştükleri için eylemsilik özelliklerini kaybederler.",
        points: 25,
      },
      {
        questionType: "FILL_BLANK",
        questionText:
          "İsim-fiil ekleri -ma, -ış ve _________ şeklinde tekerleme olarak kodlanır.",
        optionsJson: null,
        correctAnswer: "mak",
        explanation: "MA-YIŞ-MAK ekleridir.",
        points: 25,
      },
      {
        questionType: "MULTIPLE_CHOICE",
        questionText:
          "Aşağıdaki cümlelerin hangisinde fiilimsi cümleye ZAMAN anlamı katmıştır?",
        optionsJson: JSON.stringify([
          "A) Zili duyunca hemen kapıya koştu.",
          "B) Gülerek bana doğru yaklaştı.",
          "C) Ağlaya sızlaya derdini anlattı.",
          "D) Koşa koşa merdivenleri çıktı.",
        ]),
        correctAnswer: "A",
        explanation:
          "'Zili duyunca' (-ince zarf-fiil eki) 'Ne zaman kapıya koştu?' sorusuna yanıt vererek zaman anlamı katmıştır.",
        points: 25,
      },
    ],
  },
};

// Aliases for historical / different code formats
CURRICULUM_KNOWLEDGE_BASE["İNK.8.1.2"] = CURRICULUM_KNOWLEDGE_BASE["İTA.8.1.2"];
CURRICULUM_KNOWLEDGE_BASE["İNK.8.1.1"] = CURRICULUM_KNOWLEDGE_BASE["İTA.8.1.1"];

export interface GenerateDraftInput {
  grade: number;
  subject: string;
  unitOrTheme: string;
  topic: string;
  outcomes: CurriculumOutcome[];
}

export function generatePreClassDraft(
  subjectOrInput: string | GenerateDraftInput,
  maybeGrade?: number,
  maybeUnitOrTheme?: string,
  maybeTopic?: string,
  maybeOutcomes?: CurriculumOutcome[]
): GeneratedStudyDraft {
  let subject: string;
  let grade: number;
  let unitOrTheme: string;
  let topic: string;
  let outcomes: CurriculumOutcome[];

  if (typeof subjectOrInput === "object" && subjectOrInput !== null) {
    subject = subjectOrInput.subject;
    grade = subjectOrInput.grade;
    unitOrTheme = subjectOrInput.unitOrTheme;
    topic = subjectOrInput.topic;
    outcomes = subjectOrInput.outcomes || [];
  } else {
    subject = subjectOrInput;
    grade = maybeGrade || 8;
    unitOrTheme = maybeUnitOrTheme || "";
    topic = maybeTopic || "";
    outcomes = maybeOutcomes || [];
  }
  const mainOutcome = outcomes[0];
  const outcomeCode = mainOutcome ? mainOutcome.outcomeCode.trim() : "";

  // 1. Bilgi Bankasında birebir kazanım eşleşmesi var mı?
  if (outcomeCode && CURRICULUM_KNOWLEDGE_BASE[outcomeCode]) {
    const kb = CURRICULUM_KNOWLEDGE_BASE[outcomeCode];
    const displayTopic = topic && topic.trim().length > 3 ? topic.trim() : kb.topicTitle;
    return {
      title: `8. Sınıf Derse Hazırlık: ${displayTopic} (${subject})`,
      introduction: kb.introduction,
      summary: kb.summary,
      keyConcepts: kb.keyConcepts,
      example: kb.example,
      mustKnow: kb.mustKnow,
      questions: kb.questions.map((q, idx) => ({
        ...q,
        order: idx + 1,
      })),
    };
  }

  // 2. 8. Sınıf Çerçeve Yıllık Planına Dayalı Dinamik ve Zengin İçerik Oluşturucu
  const isGenericTopic =
    !topic ||
    topic.trim().length <= 3 ||
    ["başlık", "konu", "ödev", "görev", "test", "deneme"].includes(topic.trim().toLowerCase());

  const outcomeCleanText = mainOutcome ? mainOutcome.outcomeText : unitOrTheme;
  const effectiveTopic = isGenericTopic ? outcomeCleanText : topic.trim();
  const processInfo = mainOutcome?.processComponents
    ? mainOutcome.processComponents
    : "kavramların temel tanımları, ilkeleri ve günlük hayattaki yansımaları";

  const title = `8. Sınıf Derse Hazırlık: ${effectiveTopic} (${subject})`;

  const introduction = `Merhaba! 8. Sınıf ${subject} dersimizde "${effectiveTopic}" konusunu işleyeceğiz. Yarın sınıfta öğretmenin anlatacaklarını ilk andan itibaren kavramak, LGS ve ders başarını güçlendirmek için bu 3–4 dakikalık hazırlık özetini dikkatle incele.`;

  const summary =
    `Bu dersimizin odak noktasında resmî MEB 8. Sınıf ${outcomeCode} öğrenme çıktısı yer almaktadır:\n"${outcomeCleanText}".\n\n` +
    `Dersten önce mutlaka bilmen gereken temel pedagojik noktalar:\n` +
    `1. ${effectiveTopic}, ${unitOrTheme} ünitesinin en kritik kazanımlarından biridir.\n` +
    `2. Yarın derste üzerinde durulacak temel kavramsal odak: ${processInfo}.\n` +
    `3. Konuyu sınıfta ezberlemek yerine, bu özetteki temel terimlerin mantığını kavrayarak derse gelmen, öğretmenin vereceği örnekleri ve soruları çok daha hızlı çözmeni sağlayacaktır.`;

  const keyConcepts = [
    {
      term: effectiveTopic.length > 30 ? effectiveTopic.slice(0, 30) + "..." : effectiveTopic,
      desc: outcomeCleanText,
    },
    {
      term: "Kritik Odak",
      desc: processInfo,
    },
    {
      term: "MEB Yıllık Plan Kapsamı",
      desc: `8. Sınıf ${subject} dersi, ${unitOrTheme} ünitesi.`,
    },
  ];

  const example =
    `Günlük hayat bağlantısı: ${effectiveTopic} konusu, 8. sınıfta öğrendiğin bilgilerin somut dünyada ve problem çözümlerinde nasıl karşılık bulduğunu gösterir. Ön bilgiyi şimdi oluşturarak sınıfta tam hazır olacaksın!`;

  const mustKnow =
    `1) Hedeflenen resmî MEB 8. Sınıf çıktısı: "${outcomeCleanText}"\n` +
    `2) Derste öğretmenin üzerinde duracağı temel süreçler: ${processInfo}\n` +
    `3) Ön bilgi sorularını yanıtlayarak hazırbulunuşluğunu ölç ve derse özgüvenle katıl.`;

  const questions: GeneratedStudyDraft["questions"] = [
    {
      questionType: "MULTIPLE_CHOICE",
      questionText: `8. Sınıf ${subject} dersimizde ele alacağımız konunun resmî MEB öğretim programında hedeflenen ana öğrenme çıktısı hangisidir?`,
      optionsJson: JSON.stringify([
        `A) ${outcomeCleanText}`,
        "B) Yalnızca formülleri ezberlemek",
        "C) Konuyu müfredat dışı ileri akademik tartışmalarla sınırlandırmak",
        "D) Rastgele varsayımlarda bulunmak",
      ]),
      correctAnswer: "A",
      explanation: `Resmî MEB 8. Sınıf çıktısı: ${outcomeCode} - ${outcomeCleanText}`,
      points: 25,
      order: 1,
    },
    {
      questionType: "TRUE_FALSE",
      questionText: `DersÖncesi hazırlığının temel amacı konuyu baştan sona tek başına bitirmek değil, yarın derste öğretmenin anlatımını takip edebilecek temel kavramsal ön bilgiyi edinmektir.`,
      optionsJson: JSON.stringify(["Doğru", "Yanlış"]),
      correctAnswer: "Doğru",
      explanation:
        "DersÖncesi akıllı hazırbulunuşluk oluşturur; derinlemesine ders öğretmenin rehberliğinde sınıfta işlenir.",
      points: 25,
      order: 2,
    },
    {
      questionType: "FILL_BLANK",
      questionText: `Bu konu MEB 8. Sınıf çerçeve planında "_________" ünitesi altında yer almaktadır.`,
      optionsJson: null,
      correctAnswer: unitOrTheme.toLowerCase().trim(),
      explanation: `Konu MEB çerçeve planında "${unitOrTheme}" ünitesindedir.`,
      points: 25,
      order: 3,
    },
    {
      questionType: "MULTIPLE_CHOICE",
      questionText: `Öğretmenimizin derste üzerinde özellikle duracağı temel süreçler ve kavramsal odak hangisidir?`,
      optionsJson: JSON.stringify([
        `A) ${processInfo}`,
        "B) Konuyla ilgisiz tarihsel anekdotlar",
        "C) Müfredat dışı yabancı dil terimleri",
        "D) Rastgele genel kültür bilgileri",
      ]),
      correctAnswer: "A",
      explanation: `MEB çerçeve planı süreç bileşeni: ${processInfo}`,
      points: 25,
      order: 4,
    },
  ];

  return {
    title,
    introduction,
    summary,
    keyConcepts,
    example,
    mustKnow,
    questions,
  };
}

export const generateGroundedDraft = generatePreClassDraft;
