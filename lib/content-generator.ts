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

// Resmî MEB Maarif Modeli Kazanımlarına Özel Pedagojik Konu ve Soru Kütüphanesi
const CURRICULUM_KNOWLEDGE_BASE: Record<string, KnowledgeModule> = {
  // İNK.8.1.2: Mustafa Kemal'in Çocukluk ve Öğrenim Hayatı
  "İNK.8.1.2": {
    topicTitle: "Mustafa Kemal'in Çocukluk ve Öğrenim Hayatı",
    introduction:
      "Merhaba! Yarınki dersimizde Türkiye Cumhuriyeti'nin kurucusu Mustafa Kemal Atatürk'ün çocukluk yıllarını, eğitim hayatını ve fikir dünyasının nasıl şekillendiğini inceleyeceğiz. Derste öğretmeninin anlatacaklarını rahatça takip edebilmek ve sorulara hazır olmak için bu 4 dakikalık hazırlık özetini dikkatle oku.",
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
          "D) Şemsi Efendi Mektebi",
        ]),
        correctAnswer: "A",
        explanation:
          "Manastır Askeri İdadisi'nde okurken tarih öğretmeni Mehmet Tevfik Bey'den ve vatan şairlerinin eserlerinden derin biçimde etkilenmiştir.",
        points: 20,
      },
      {
        questionType: "TRUE_FALSE",
        questionText:
          "Mustafa Kemal'in doğup büyüdüğü Selanik şehri, farklı din ve milletten insanların bir arada yaşadığı, Batı'daki fikirlere açık çok uluslu bir liman kentiydi.",
        optionsJson: JSON.stringify(["Doğru", "Yanlış"]),
        correctAnswer: "Doğru",
        explanation:
          "Selanik çok uluslu yapısı, zengin limanı ve demir yolu bağlantısıyla Batı'daki fikir akımlarının yoğun hissedildiği bir merkezdi.",
        points: 20,
      },
      {
        questionType: "FILL_BLANK",
        questionText:
          "Mustafa Kemal eğitim hayatına annesi Zübeyde Hanım'ın isteği üzerine geleneksel eğitim veren _________ Mektebi'nde başlamıştır.",
        optionsJson: null,
        correctAnswer: "mahalle",
        explanation:
          "Annesi Zübeyde Hanım geleneksel Mahalle Mektebi'ne gitmesini istemiş, babası ise modern Şemsi Efendi Mektebi'ni tercih etmiştir.",
        points: 20,
      },
      {
        questionType: "MATCHING",
        questionText:
          "Mustafa Kemal'in gittiği okulları özellikleri ile doğru şekilde eşleştiriniz:",
        optionsJson: JSON.stringify([
          { left: "Şemsi Efendi Mektebi", right: "Modern yöntemlerle ilk eğitim" },
          { left: "Selanik Askeri Rüştiyesi", right: "Kemal adını aldığı ortaokul" },
          { left: "Harp Akademisi", right: "Kurmay Yüzbaşı olarak mezun olduğu okul" },
        ]),
        correctAnswer: JSON.stringify({
          "Şemsi Efendi Mektebi": "Modern yöntemlerle ilk eğitim",
          "Selanik Askeri Rüştiyesi": "Kemal adını aldığı ortaokul",
          "Harp Akademisi": "Kurmay Yüzbaşı olarak mezun olduğu okul",
        }),
        explanation:
          "Okullar Mustafa Kemal'in eğitim serüveninde belirleyici kilometre taşlarıdır.",
        points: 20,
      },
    ],
  },

  // İNK.8.1.1: 20. Yüzyıl Başlarında Osmanlı Devleti
  "İNK.8.1.1": {
    topicTitle: "20. Yüzyıl Başlarında Osmanlı Devleti",
    introduction:
      "Yarınki dersimizde Osmanlı Devleti'nin 20. yüzyılın başlarındaki askeri ve siyasi durumunu, Trablusgarp ve Balkan Savaşları'nı inceleyeceğiz. Derste öğretmeni takip edebilmek için bu özeti dikkatle oku.",
    summary:
      "20. yüzyılın başlarında Osmanlı Devleti dağılma tehlikesiyle karşı karşıyaydı. Sanayi İnkılabı ile hammadde ve pazar arayışına giren sömürgeci İtalya, Osmanlı'nın Kuzey Afrika'daki son toprak parçası olan Trablusgarp'a saldırdı. Osmanlı Devleti donanması yetersiz olduğu ve karadan kara yolu bağlantısı bulunmadığı için bölgeye ordu gönderemedi.\n\n" +
      "Bunun üzerine Mustafa Kemal, Enver Paşa gibi fedakâr genç subaylar kılık değiştirerek gizlice Trablusgarp'a gittiler. Mustafa Kemal Derne ve Tobruk'ta yerel halkı teşkilatlandırarak İtalyanlara karşı büyük başarılar kazandı. Bu savaş Mustafa Kemal'in ilk askeri başarısı ve sömürgeciliğe karşı ilk mücadelesidir.\n\n" +
      "Trablusgarp Savaşı devam ederken Balkan devletleri (Yunanistan, Bulgaristan, Sırbistan, Karadağ) Osmanlı'ya savaş açtı (I. Balkan Savaşı). Osmanlı iki ateş arasında kalarak Uşi Antlaşması ile Trablusgarp'ı İtalya'ya bırakmak zorunda kaldı. Balkan Savaşları sonucunda ise Edirne dahil Rumeli toprakları kaybedildi; ancak II. Balkan Savaşı'nda Edirne geri alındı.",
    keyConcepts: [
      {
        term: "Trablusgarp Savaşı",
        desc: "İtalya'nın sömürge arayışı sonucu başlayan, Osmanlı'nın Kuzey Afrika'daki son toprağını kaybettiği savaştır.",
      },
      {
        term: "Derne ve Tobruk",
        desc: "Mustafa Kemal'in yerel halkı teşkilatlandırarak İtalyanlara karşı kazandığı ilk askeri zaferlerdir.",
      },
      {
        term: "Uşi Antlaşması",
        desc: "Osmanlı'nın Trablusgarp'ı İtalya'ya bıraktığı ve Kuzey Afrika'dan tamamen çekildiği antlaşmadır.",
      },
      {
        term: "Balkan Savaşları",
        desc: "Milliyetçilik akımı ve Rusya'nın kışkırtmasıyla Balkan devletlerinin Osmanlı'ya saldırdığı savaşlardır.",
      },
    ],
    example:
      "Bir liderin elindeki az imkana rağmen halkı bir araya getirip dayanışma kurması gibi; Mustafa Kemal de Trablusgarp'ta kısıtlı imkanlarla yerel halkı örgütleyerek İtalyan ordusunu durdurmayı başarmıştır.",
    mustKnow:
      "1) Trablusgarp Savaşı Mustafa Kemal'in sömürgeciliğe karşı ilk askeri başarısıdır.\n" +
      "2) Uşi Antlaşması ile Osmanlı Devleti Kuzey Afrika'daki son toprağını da kaybetmiştir.\n" +
      "3) I. Balkan Savaşı yenilgisinden sonra II. Balkan Savaşı'nda Edirne Meriç Nehri sınır olacak şekilde kurtarılmıştır.",
    questions: [
      {
        questionType: "MULTIPLE_CHOICE",
        questionText:
          "Mustafa Kemal'in sömürgeci güçlere karşı ilk askeri başarısını kazandığı, Derne ve Tobruk'ta yerel halkı örgütlediği savaş hangisidir?",
        optionsJson: JSON.stringify([
          "A) Çanakkale Savaşı",
          "B) Trablusgarp Savaşı",
          "C) I. Balkan Savaşı",
          "D) Sakarya Meydan Muharebesi",
        ]),
        correctAnswer: "B",
        explanation:
          "Mustafa Kemal gizlice Trablusgarp'a giderek Derne ve Tobruk'ta İtalyanlara karşı ilk zaferlerini kazanmıştır.",
        points: 25,
      },
      {
        questionType: "TRUE_FALSE",
        questionText:
          "Osmanlı Devleti, Trablusgarp Savaşı sonucunda imzaladığı Uşi Antlaşması ile Kuzey Afrika'daki son toprak parçasını da kaybetmiştir.",
        optionsJson: JSON.stringify(["Doğru", "Yanlış"]),
        correctAnswer: "Doğru",
        explanation:
          "Uşi Antlaşması ile Trablusgarp İtalya'ya bırakılmış ve Osmanlı'nın Kuzey Afrika'daki varlığı sona ermiştir.",
        points: 25,
      },
      {
        questionType: "FILL_BLANK",
        questionText:
          "Osmanlı Devleti'nin Trablusgarp'ı İtalya'ya bıraktığı antlaşmanın adı _________ Antlaşması'dır.",
        optionsJson: null,
        correctAnswer: "uşi",
        explanation:
          "1912 yılında imzalanan Uşi Antlaşması ile Trablusgarp İtalyanlara bırakılmıştır.",
        points: 25,
      },
      {
        questionType: "MULTIPLE_CHOICE",
        questionText:
          "Mustafa Kemal'in Trablusgarp'ta dağınık yerel halkı İtalyanlara karşı teşkilatlandırması, onun hangi kişisel özelliğini en açık şekilde gösterir?",
        optionsJson: JSON.stringify([
          "A) Teşkilatçılık ve Liderlik",
          "B) Yalnızca edebiyata ilgisi",
          "C) Sanata düşkünlüğü",
          "D) Sabırsızlığı",
        ]),
        correctAnswer: "A",
        explanation:
          "Halkı organize edip ortak savunma cephesi oluşturması Mustafa Kemal'in teşkilatçı ve liderlik vasfını kanıtlar.",
        points: 25,
      },
    ],
  },

  // FEN.7.1.1: Hücrenin Temel Kısımları ve Organeller
  "FEN.7.1.1": {
    topicTitle: "Hücrenin Temel Kısımları ve Organeller",
    introduction:
      "Yarınki dersimizde canlılığın en küçük yapı birimi olan 'hücre' konusunu öğreneceğiz. Dersteki mikroskop çalışmalarını ve öğretmeninin anlatımını kolayca kavramak için bu temel bilgileri 3 dakikada oku.",
    summary:
      "Tüm canlılar bir veya daha fazla hücreden meydana gelir. Bir hücre temelde üç ana bölümden oluşur:\n\n" +
      "1. Hücre Zarı: Hücreyi dış etkilerden koruyan, canlı, esnek ve 'seçici geçirgen' bir zardır. Her maddenin hücreye girmesine izin vermez; yararlı maddeleri içeri alır, atıkları dışarı atar.\n" +
      "2. Çekirdek: Hücrenin yönetim ve kalıtım merkezidir. Hücrenin bölünmesini, büyümesini ve yaşamsal faaliyetlerini yönetir. İçerisinde canlıya ait tüm kalıtsal bilgiyi taşıyan DNA ve kromozomlar yer alır.\n" +
      "3. Sitoplazma: Hücre zarı ile çekirdek arasını dolduran, yumurta akı kıvamındaki akışkan sıvıdır. İçerisinde yaşamsal faaliyetleri yürüten organeller (mitokondri, ribozom, koful, golgi, lizozom vb.) bulunur.",
    keyConcepts: [
      {
        term: "Hücre Zarı",
        desc: "Canlı, esnek ve seçici geçirgen koruyucu dış katmandır.",
      },
      {
        term: "Çekirdek",
        desc: "Hücrenin yönetim merkezidir; DNA ve genetik bilgiyi barındırır.",
      },
      {
        term: "Sitoplazma",
        desc: "Organellerin bulunduğu akışkan, yarı saydam sıvıdır.",
      },
      {
        term: "Mitokondri",
        desc: "Hücrenin enerji santralidir; besin ve oksijenden enerji (ATP) üretir.",
      },
      {
        term: "Ribozom",
        desc: "Tüm hücrelerde bulunan en küçük organeldir; protein sentezi yapar.",
      },
    ],
    example:
      "Hücreyi bir okula benzetebiliriz: Okulun güvenlik kapısı ve dış duvarları 'Hücre Zarı' gibidir (kimin girip çıkacağına karar verir). Okul müdürünün odası 'Çekirdek' gibidir (tüm okulu yönetir). Koridorlar ve sınıflardaki faaliyetler ise 'Sitoplazma' içindeki organellerin çalışmasına benzer.",
    mustKnow:
      "1) Hücre temel olarak zar, sitoplazma ve çekirdekten oluşur.\n" +
      "2) Hücre zarı seçici geçirgendir; çekirdek ise hücreyi yönetir.\n" +
      "3) Mitokondri enerji üretir, ribozom protein sentezler.",
    questions: [
      {
        questionType: "MULTIPLE_CHOICE",
        questionText:
          "Hücrenin yaşamsal faaliyetlerini yöneten ve içerisinde kalıtsal bilgiyi (DNA) barındıran temel kısım hangisidir?",
        optionsJson: JSON.stringify([
          "A) Sitoplazma",
          "B) Çekirdek",
          "C) Ribozom",
          "D) Hücre zarı",
        ]),
        correctAnswer: "B",
        explanation:
          "Çekirdek hücrenin kontrol ve yönetim merkezidir; kalıtım maddesi olan DNA çekirdekte bulunur.",
        points: 25,
      },
      {
        questionType: "TRUE_FALSE",
        questionText:
          "Hücre zarı cansız, sert ve önüne gelen tüm maddeleri ayırt etmeksizin içeri geçiren bir yapıya sahiptir.",
        optionsJson: JSON.stringify(["Doğru", "Yanlış"]),
        correctAnswer: "Yanlış",
        explanation:
          "Hücre zarı canlı, esnek ve 'seçici geçirgen'dir; yalnızca gerekli maddelerin geçişine izin verir.",
        points: 25,
      },
      {
        questionType: "FILL_BLANK",
        questionText:
          "Hücrede besin ve oksijeni kullanarak hücrenin ihtiyacı olan enerjiyi üreten organele _________ denir.",
        optionsJson: null,
        correctAnswer: "mitokondri",
        explanation:
          "Mitokondri hücrenin enerji santrali olarak bilinir ve hücresel solunumla enerji üretir.",
        points: 25,
      },
      {
        questionType: "MULTIPLE_CHOICE",
        questionText:
          "Tüm canlı hücrelerde bulunan ve protein sentezinden sorumlu olan en küçük organel hangisidir?",
        optionsJson: JSON.stringify([
          "A) Ribozom",
          "B) Kloroplast",
          "C) Sentrozom",
          "D) Lizozom",
        ]),
        correctAnswer: "A",
        explanation:
          "Ribozom zarsız bir organel olup tüm canlı hücrelerde protein sentezini gerçekleştirir.",
        points: 25,
      },
    ],
  },

  // FEN.7.1.2: Bitki ve Hayvan Hücresi Karşılaştırması
  "FEN.7.1.2": {
    topicTitle: "Bitki ve Hayvan Hücrelerinin Karşılaştırılması",
    introduction:
      "Yarınki dersimizde mikroskop altında bitki ve hayvan hücreleri arasındaki benzerlik ve farkları göreceğiz. Derse hazırlıklı olmak için bu 3 dakikalık karşılaştırma özetini oku.",
    summary:
      "Bitki ve hayvan hücreleri temel kısımları (zar, sitoplazma, çekirdek) bakımından benzer olsa da bazı çok önemli yapısal farklara sahiptir:\n\n" +
      "1. Şekil: Bitki hücreleri köşeli bir yapıya sahipken, hayvan hücreleri yuvarlak veya oval şekillidir.\n" +
      "2. Hücre Duvarı (Çeperi): Bitki hücrelerinde zarın en dışında cansız, dayanıklı bir 'hücre duvarı' bulunur. Hayvan hücrelerinde hücre duvarı YOKTUR.\n" +
      "3. Kloroplast: Bitki hücrelerinde yeşil renk veren ve fotosentez ile besin/oksijen üreten kloroplast organeli bulunur. Hayvan hücrelerinde kloroplast YOKTUR.\n" +
      "4. Kofullar: Bitki hücrelerinde kofullar büyük ve az sayıdadır. Hayvan hücrelerinde ise küçük ve çok sayıdadır.\n" +
      "5. Sentrozom: İlkel bitkiler hariç gelişmiş bitki hücrelerinde sentrozom bulunmaz; hayvan hücrelerinde hücre bölünmesinde görev alan sentrozom bulunur.",
    keyConcepts: [
      {
        term: "Hücre Duvarı",
        desc: "Sadece bitki hücrelerinde bulunan, selülozdan yapılmış sert ve koruyucu cansız katmandır.",
      },
      {
        term: "Kloroplast",
        desc: "Yalnızca bitki hücrelerinde bulunan, fotosentez ile besin üreten yeşil organeldir.",
      },
      {
        term: "Koful Farkı",
        desc: "Bitkide büyük ve az sayıda; hayvanda küçük ve çok sayıdadır.",
      },
      {
        term: "Köşeli Şekil",
        desc: "Hücre duvarı nedeniyle bitki hücresinin aldığı karakteristik köşeli yapıdır.",
      },
    ],
    example:
      "Bir bitki gövdesinin rüzgarda dimdik ayakta durabilmesi hücre duvarlarının sağladığı sertlik sayesindedir; hayvanların ise hareket edebilmesi hücrelerinin esnek ve duvarsız olmasından kaynaklanır.",
    mustKnow:
      "1) Bitki hücresi köşelidir; hayvan hücresi yuvarlaktır.\n" +
      "2) Hücre duvarı ve kloroplast SADECE bitki hücrelerinde bulunur.\n" +
      "3) Bitki kofulu büyük ve az sayıda; hayvan kofulu küçük ve çok sayıdadır.",
    questions: [
      {
        questionType: "MULTIPLE_CHOICE",
        questionText: "Aşağıdakilerden hangisi yalnızca bitki hücrelerinde bulunur, hayvan hücrelerinde bulunmaz?",
        optionsJson: JSON.stringify(["A) Mitokondri", "B) Çekirdek", "C) Kloroplast", "D) Ribozom"]),
        correctAnswer: "C",
        explanation: "Kloroplast fotosentez yaptığı için yalnızca bitki hücrelerinde bulunur.",
        points: 25,
      },
      {
        questionType: "TRUE_FALSE",
        questionText: "Bitki hücreleri sert hücre çeperi nedeniyle mikroskopta köşeli bir şekilde görünür.",
        optionsJson: JSON.stringify(["Doğru", "Yanlış"]),
        correctAnswer: "Doğru",
        explanation: "Hücre duvarı bitki hücresine sertlik ve köşeli şekil kazandırır.",
        points: 25,
      },
      {
        questionType: "FILL_BLANK",
        questionText: "Hayvan hücrelerinde kofullar bitki hücrelerine göre küçük ve _________ sayıdadır.",
        optionsJson: null,
        correctAnswer: "çok",
        explanation: "Hayvan hücresinde kofullar küçük ve çok sayıda, bitkide ise büyük ve az sayıdadır.",
        points: 25,
      },
      {
        questionType: "MULTIPLE_CHOICE",
        questionText: "Hayvan hücresi mikroskopta incelendiğinde şekil olarak hangisine benzer?",
        optionsJson: JSON.stringify(["A) Köşeli", "B) Yuvarlak / Oval", "C) Küp biçimli", "D) Piramit"]),
        correctAnswer: "B",
        explanation: "Hücre duvarı olmadığı için hayvan hücreleri yuvarlak veya oval esnek bir yapıya sahiptir.",
        points: 25,
      },
    ],
  },

  // FEN.7.1.3: Mitoz Bölünme
  "FEN.7.1.3": {
    topicTitle: "Mitoz Bölünmenin Canlılar İçin Önemi",
    introduction:
      "Yarınki dersimizde vücudumuzun nasıl büyüdüğünü ve yaralarımızın nasıl iyileştiğini sağlayan 'mitoz bölünme' konusunu işleyeceğiz. Derse hazır gelmek için bu 3 dakikalık özeti oku.",
    summary:
      "Mitoz bölünme, tüm çok hücreli canlıların vücut hücrelerinde (deri, kemik, kas vb.) görülen bir hücre bölünmesi türüdür.\n\n" +
      "Mitoz bölünmenin canlılar için üç temel amacı vardır:\n" +
      "1. Çok hücrelilerde: Büyüme, gelişme ve yaralanan dokuların onarılması (örneğin düşüp kanayan dizimizin iyileşmesi).\n" +
      "2. Bir hücrelilerde: Eşeysiz üremeyi (çoğalmayı) sağlar (örneğin amip ve bakterilerin bölünerek çoğalması).\n\n" +
      "Mitoz bölünmenin en kritik özelliği: Bölünme sonucunda ana hücreden tamamen aynı kalıtsal bilgiye sahip 2 YENİ HÜCRE oluşur. Kromozom sayısı ASLA DEĞİŞMEZ (2n ise yavru hücreler de 2n kalır). Kalıtsal çeşitlilik oluşmaz, oluşan hücreler ana hücrenin birer kopyasıdır.",
    keyConcepts: [
      {
        term: "Vücut Hücreleri",
        desc: "Mitoz bölünmenin gerçekleştiği, 2n kromozomlu hücrelerdir.",
      },
      {
        term: "Kromozom Sabitliği",
        desc: "Mitoz bölünme sonucunda yavru hücrelerin kromozom sayısının ana hücreyle aynı kalmasıdır.",
      },
      {
        term: "Onarım ve Yenilenme",
        desc: "Yaraların kapanması ve yıpranan dokuların mitoz sayesinde tamir edilmesidir.",
      },
      {
        term: "2 Yeni Hücre",
        desc: "Bir ana hücrenin mitoz geçirmesiyle oluşan hücre sayısıdır.",
      },
    ],
    example:
      "Parmak ucunuz kesildiğinde birkaç gün içinde yeni deri hücrelerinin oluşarak kesilen yeri kapatması, deri hücrelerinizin hızla mitoz bölünme geçirmesi sayesindedir.",
    mustKnow:
      "1) Mitoz sonucu 2 yeni yavru hücre oluşur.\n" +
      "2) Kromozom sayısı ve genetik yapı DEĞİŞMEZ.\n" +
      "3) Çok hücrelilerde büyüme ve onarımı, bir hücrelilerde üremeyi sağlar.",
    questions: [
      {
        questionType: "MULTIPLE_CHOICE",
        questionText: "2n = 46 kromozomlu bir insan deri hücresi mitoz bölünme geçirdiğinde oluşan yavru hücrelerin kromozom sayısı kaç olur?",
        optionsJson: JSON.stringify(["A) 23", "B) 46", "C) 92", "D) 12"]),
        correctAnswer: "B",
        explanation: "Mitoz bölünmede kromozom sayısı sabit kalır; bu nedenle yavru hücreler de 46 kromozomlu olur.",
        points: 25,
      },
      {
        questionType: "TRUE_FALSE",
        questionText: "Mitoz bölünme sonucunda ana hücreden genetik olarak birbirinin tıpatıp aynısı olan 2 yeni hücre meydana gelir.",
        optionsJson: JSON.stringify(["Doğru", "Yanlış"]),
        correctAnswer: "Doğru",
        explanation: "Mitozda kalıtsal çeşitlilik oluşmaz; oluşan iki hücre ana hücre ile aynı genetik yapıya sahiptir.",
        points: 25,
      },
      {
        questionType: "FILL_BLANK",
        questionText: "Mitoz bölünme bir ana hücreden _________ adet yeni yavru hücre oluşturur.",
        optionsJson: null,
        correctAnswer: "2",
        explanation: "Mitoz bölünme sonucunda 2 adet yeni hücre oluşur.",
        points: 25,
      },
      {
        questionType: "MULTIPLE_CHOICE",
        questionText: "Aşağıdakilerden hangisi çok hücreli canlılarda mitoz bölünmenin görevlerinden biridir?",
        optionsJson: JSON.stringify(["A) Yaralanan dokuların onarılması ve büyüme", "B) Mayoz gibi sperm ve yumurta hücresi üretme", "C) Tür içi çeşitlilik sağlama", "D) Kromozom sayısını yarıya indirme"]),
        correctAnswer: "A",
        explanation: "Mitoz çok hücrelilerde büyüme, gelişme ve yaraların onarılmasını sağlar.",
        points: 25,
      },
    ],
  },

  // FEN.7.3.1: Kütle ve Ağırlık Karşılaştırması
  "FEN.7.3.1": {
    topicTitle: "Kütle ve Ağırlık Arasındaki Temel Farklar",
    introduction:
      "Yarınki dersimizde günlük hayatta sıkça birbirine karıştırılan 'kütle' ile 'ağırlık' kavramlarının fiziksel farklarını öğreneceğiz. Derse hazır olmak için bu 3 dakikalık özeti oku.",
    summary:
      "Günlük dilde 'kütlem' ve 'ağırlığım' aynı şey gibi kullanılsa da fizikte iki tamamen farklı kavramdır:\n\n" +
      "1. Kütle: Değişmeyen madde miktarıdır. Bir cismin kütlesi Dünya'da da, Ay'da da, uzay boşluğunda da AYNIDIR. Sembolü 'm'dir, birimi kilogram (kg) veya gramdır (g). Eşit kollu terazi ile ölçülür.\n\n" +
      "2. Ağırlık: Bir cisme etki eden yerçekimi kuvvetidir. Ağırlık bir kuvvettir! Bu nedenle yerçekiminin değiştiği yerlerde ağırlık da DEĞİŞİR. Örneğin Ay'ın yerçekimi Dünya'nın yaklaşık 6'da 1'i olduğu için bir cisim Ay'da Dünya'dakinin 6'da 1'i kadar hafif tartar. Ağırlığın sembolü 'G'dir, birimi Newton'dur (N). Dinamometre ile ölçülür.",
    keyConcepts: [
      {
        term: "Kütle (m)",
        desc: "Madde miktarıdır; konuma göre değişmez; birimi kg'dır; eşit kollu teraziyle ölçülür.",
      },
      {
        term: "Ağırlık (G)",
        desc: "Yerçekimi kuvvetidir; konuma göre değişir; birimi Newton'dur (N); dinamometreyle ölçülür.",
      },
      {
        term: "Dinamometre",
        desc: "İçindeki yayın esnemesi prensibiyle ağırlık ve kuvveti ölçen alettir.",
      },
    ],
    example:
      "Kütlesi 60 kg olan bir astronot Ay'a gittiğinde kütlesi yine 60 kg kalır. Ancak Dünya'da yaklaşık 600 N olan ağırlığı, Ay'da yerçekimi az olduğu için sadece 100 N olarak ölçülür.",
    mustKnow:
      "1) Kütle hiçbir yerde DEĞİŞMEZ; birimi kg'dır, eşit kollu teraziyle ölçülür.\n" +
      "2) Ağırlık yerçekimine göre DEĞİŞİR; bir kuvvettir, birimi Newton'dur (N), dinamometreyle ölçülür.",
    questions: [
      {
        questionType: "MULTIPLE_CHOICE",
        questionText: "Dünya'da kütlesi 30 kg olan bir taş Ay'a götürülürse kütlesi kaç kg olur?",
        optionsJson: JSON.stringify(["A) 5 kg", "B) 30 kg", "C) 180 kg", "D) 0 kg"]),
        correctAnswer: "B",
        explanation: "Kütle değişmeyen madde miktarıdır; Dünya'da da Ay'da da aynı kalır (30 kg).",
        points: 25,
      },
      {
        questionType: "TRUE_FALSE",
        questionText: "Ağırlık bir kuvvettir, dinamometre ile ölçülür ve birimi Newton'dur (N).",
        optionsJson: JSON.stringify(["Doğru", "Yanlış"]),
        correctAnswer: "Doğru",
        explanation: "Ağırlık cisme etki eden yerçekimi kuvvetidir; birimi N ve aleti dinamometredir.",
        points: 25,
      },
      {
        questionType: "FILL_BLANK",
        questionText: "Kütle ölçümünde kullanılan geleneksel ölçüm aletine _________ kollu terazi denir.",
        optionsJson: null,
        correctAnswer: "eşit",
        explanation: "Kütle eşit kollu terazi ile ölçülür.",
        points: 25,
      },
      {
        questionType: "MULTIPLE_CHOICE",
        questionText: "Aşağıdakilerden hangisi cismin bulunduğu gezegene veya deniz seviyesinden yüksekliğine göre DEĞİŞİR?",
        optionsJson: JSON.stringify(["A) Ağırlık", "B) Kütle", "C) Atom sayısı", "D) Madde miktarı"]),
        correctAnswer: "A",
        explanation: "Yerçekimi değiştikçe cisme etki eden ağırlık kuvveti de değişir.",
        points: 25,
      },
    ],
  },

  // MAT.7.1.1: Rasyonel Sayılar
  "MAT.7.1.1": {
    topicTitle: "Rasyonel Sayıları Tanıma ve Sayı Doğrusunda Gösterme",
    introduction:
      "Yarınki matematik dersimizde tam sayıların ardından 'rasyonel sayılar' konusuna adım atacağız. Derste zorlanmamak için rasyonel sayıların ne anlama geldiğini 3 dakikada hatırla.",
    summary:
      "a ve b birer tam sayı olmak ve b sıfırdan farklı (b ≠ 0) olmak üzere a/b biçiminde yazılabilen tüm sayılara 'rasyonel sayı' denir. Rasyonel sayılar kümesi 'Q' sembolü ile gösterilir.\n\n" +
      "Her tam sayı, paydasına 1 yazılabildiği için aynı zamanda bir rasyonel sayıdır. Örneğin 5 = 5/1, -3 = -3/1 rasyoneldir. Sıfır da bir rasyonel sayıdır (0/1 = 0).\n\n" +
      "Ancak bir sayının paydasında sıfır bulunamaz! Örneğin 5/0 tanımsızdır ve rasyonel sayı değildir.\n\n" +
      "Sayı doğrusunda pozitif rasyonel sayılar 0'ın sağında, negatif rasyonel sayılar ise 0'ın solunda yer alır. İki tam sayı arası, kesrin paydası kadar eşit parçaya bölünerek gösterilir.",
    keyConcepts: [
      {
        term: "Rasyonel Sayı (Q)",
        desc: "a ve b tam sayı, b ≠ 0 olmak üzere a/b şeklinde yazılabilen sayılardır.",
      },
      {
        term: "Pay ve Payda",
        desc: "Üstteki sayı (pay) alınan parça sayısını, alttaki sayı (payda) bütünün kaç parçaya bölündüğünü belirtir.",
      },
      {
        term: "Tanımsızlık",
        desc: "Paydası sıfır olan (a/0) kesirler matematiksel olarak tanımsızdır.",
      },
      {
        term: "Negatif Rasyonel Sayılar",
        desc: "Sayı doğrusunda sıfırın solunda kalan, önünde eksi işareti bulunan sayılardır (-3/4 gibi).",
      },
    ],
    example:
      "Bir pizzayı 4 eşit dilime bölüp 3 dilimini yerseniz 3/4 rasyonel sayısını ifade etmiş olursunuz. Borcunuz 2 lira ise ve bunu 3 kişiye paylaştırırsanız -2/3 negatif rasyonel sayısı oluşur.",
    mustKnow:
      "1) Payda asla sıfır olamaz (b ≠ 0). 7/0 tanımsızdır.\n" +
      "2) Tüm tam sayılar birer rasyonel sayıdır (paydası 1'dir).\n" +
      "3) Negatif rasyonel sayılarda eksi işareti paya, paydaya veya kesir çizgisinin önüne konabilir: -a/b = (-a)/b = a/(-b).",
    questions: [
      {
        questionType: "MULTIPLE_CHOICE",
        questionText: "Aşağıdaki ifadelerden hangisi bir rasyonel sayı BELİRTMEZ (tanımsızdır)?",
        optionsJson: JSON.stringify(["A) 0 / 5", "B) -3 / 4", "C) 7 / 0", "D) 8 / 1"]),
        correctAnswer: "C",
        explanation:
          "Paydası sıfır olan ifadeler (7/0) matematikte tanımsızdır ve rasyonel sayı oluşturmaz.",
        points: 25,
      },
      {
        questionType: "TRUE_FALSE",
        questionText: "Bütün tam sayılar paydalarına 1 yazılabildiği için aynı zamanda birer rasyonel sayıdır.",
        optionsJson: JSON.stringify(["Doğru", "Yanlış"]),
        correctAnswer: "Doğru",
        explanation:
          "Örneğin -4 = -4/1 veya 9 = 9/1 şeklinde yazılabildiğinden her tam sayı rasyonel sayıdır.",
        points: 25,
      },
      {
        questionType: "FILL_BLANK",
        questionText: "Rasyonel sayılar kümesi matematikte büyük _________ harfi ile sembolize edilir.",
        optionsJson: null,
        correctAnswer: "q",
        explanation: "Rasyonel sayılar kümesi 'Q' harfi ile gösterilir (İtalyanca quoziente - bölüm).",
        points: 25,
      },
      {
        questionType: "MULTIPLE_CHOICE",
        questionText: "-2 tam sayısının rasyonel sayı olarak gösterimi aşağıdakilerden hangisidir?",
        optionsJson: JSON.stringify(["A) -2 / 1", "B) 1 / -2", "C) 0 / -2", "D) -2 / 0"]),
        correctAnswer: "A",
        explanation: "Her tam sayının paydasında gizli bir 1 vardır: -2 = -2/1.",
        points: 25,
      },
    ],
  },

  // MAT.8.1.1: Çarpanlar ve Asal Çarpanlar
  "MAT.8.1.1": {
    topicTitle: "Pozitif Tam Sayıların Çarpanları ve Asal Sayılar",
    introduction:
      "LGS ve 8. sınıf matematiğinin ilk konusu olan 'Çarpanlar ve Katlar' konusuna yarın başlıyoruz. Derste zorlanmamak için pozitif tam sayıların çarpanlarını bulma mantığını 3 dakikada hatırla.",
    summary:
      "Her pozitif tam sayı, iki pozitif tam sayının çarpımı şeklinde yazılabilir. Bu sayılara o sayının 'çarpanları' veya 'bölenleri' denir. Yani çarpan ile bölen aynı şeydir.\n\n" +
      "Örneğin 18 sayısının çarpanları: 1 x 18, 2 x 9, 3 x 6 olduğundan 1, 2, 3, 6, 9, 18'dir.\n\n" +
      "Asal Sayı: Yalnızca 1'e ve kendisine bölünebilen 1'den büyük doğal sayılardır. 2, 3, 5, 7, 11, 13, 17, 19... şeklinde devam eder. Unutma: En küçük asal sayı 2'dir ve 2 ÇİFT OLAN TEK ASAL SAYIDIR! 1 asal sayı DEĞİLDİR.\n\n" +
      "Bir sayının asal olan çarpanlarına 'asal çarpan' denir. Örneğin 18'in çarpanları içinden asal olanlar 2 ve 3'tür.",
    keyConcepts: [
      {
        term: "Çarpan (Bölen)",
        desc: "Bir sayıyı kalansız bölen pozitif tam sayılardır.",
      },
      {
        term: "Asal Sayı",
        desc: "1 ve kendisinden başka böleni olmayan 1'den büyük doğal sayılardır.",
      },
      {
        term: "2 Sayısı",
        desc: "En küçük asal sayıdır ve tek çift asal sayıdır.",
      },
      {
        term: "Bölen Listesi",
        desc: "Bir sayıyı sağ tarafına dikey çizgi çekerek en küçük asal sayıdan başlayıp bölme yöntemidir.",
      },
    ],
    example:
      "12 sayısının çarpanları: 1, 2, 3, 4, 6, 12'dir. Bunlar arasından asal olanlar 2 ve 3'tür. 12 = 2² x 3 şeklinde asal çarpanlarının çarpımı olarak yazılır.",
    mustKnow:
      "1) 1 asal sayı DEĞİLDİR.\n" +
      "2) 2 en küçük ve tek çift asal sayıdır.\n" +
      "3) 'Çarpan' ile 'bölen' aynı anlama gelir.",
    questions: [
      {
        questionType: "MULTIPLE_CHOICE",
        questionText: "Aşağıdaki sayılardan hangisi 24 sayısının bir çarpanı (böleni) DEĞİLDİR?",
        optionsJson: JSON.stringify(["A) 4", "B) 6", "C) 7", "D) 8"]),
        correctAnswer: "C",
        explanation: "24 sayısı 7'ye kalansız bölünmez (24 / 7 = 3 kalan 3). Bu nedenle 7 çarpan değildir.",
        points: 25,
      },
      {
        questionType: "TRUE_FALSE",
        questionText: "2 sayısı en küçük asal sayıdır ve aynı zamanda çift olan tek asal sayıdır.",
        optionsJson: JSON.stringify(["Doğru", "Yanlış"]),
        correctAnswer: "Doğru",
        explanation: "2 hariç tüm çift sayılar 2'ye bölünebildiği için asal olamaz; tek çift asal 2'dir.",
        points: 25,
      },
      {
        questionType: "FILL_BLANK",
        questionText: "1 ve kendisinden başka hiçbir pozitif böleni olmayan 1'den büyük doğal sayılara _________ sayı denir.",
        optionsJson: null,
        correctAnswer: "asal",
        explanation: "Yalnızca 1'e ve kendisine bölünen sayılara asal sayı denir.",
        points: 25,
      },
      {
        questionType: "MULTIPLE_CHOICE",
        questionText: "30 sayısının asal çarpanları aşağıdakilerin hangisinde doğru verilmiştir?",
        optionsJson: JSON.stringify(["A) 2, 3 ve 5", "B) 1, 2 ve 3", "C) 3 ve 10", "D) 5 ve 6"]),
        correctAnswer: "A",
        explanation: "30 = 2 x 3 x 5 olduğundan asal çarpanları 2, 3 ve 5'tir.",
        points: 25,
      },
    ],
  },

  // TÜRK.7.2.1: Fiillerde Anlam (İş, Oluş, Durum)
  "TÜRK.7.2.1": {
    topicTitle: "Fiillerde Anlam Özellikleri: İş, Oluş ve Durum Fiilleri",
    introduction:
      "Yarınki Türkçe dersimizde fiillerin anlamına göre ayrımını (iş, oluş, durum) öğreneceğiz. Derste soruları anında cevaplayabilmek için bu 3 dakikalık pratik yöntemi oku.",
    summary:
      "Fiiller (eylemler) anlamına göre üçe ayrılır:\n\n" +
      "1. İş (Kılış) Fiilleri: Bir öznenin kendi isteğiyle yaptığı ve nesneyi etkilediği eylemlerdir. En pratik kural: Başına 'onu' sözcüğü getirildiğinde anlamlı olur! (Onu yazdı, onu kırdı, onu çözdü, onu taşıdı).\n\n" +
      "2. Durum Fiilleri: Öznenin içinde bulunduğu hali, durumu anlatır. Nesne almazlar; başına 'onu' getirildiğinde anlamsız olur! Ancak öznenin iradesiyle gerçekleşir. (Uyumak, oturmak, gülmek, gitmek -> 'Onu uyudu' DENMEZ!).\n\n" +
      "3. Oluş Fiilleri: Öznenin kendi isteği ve iradesi dışında, zaman içinde kendiliğinden gerçekleşen fiziksel ve biyolojik değişimlerdir. (Sararmak, paslanmak, büyümek, küflenmek, bayatlamak, uzamak).",
    keyConcepts: [
      {
        term: "İş (Kılış) Fiili",
        desc: "Nesne alan fiildir; başına 'onu' gelir (yazmak, sevmek, okumak).",
      },
      {
        term: "Durum Fiili",
        desc: "Öznenin durumunu belirtir, nesne almaz; başına 'onu' gelmez (durmak, uyumak, ağlamak).",
      },
      {
        term: "Oluş Fiili",
        desc: "Zamanla kendiliğinden olan değişimlerdir; irade dışıdır (paslanmak, sararmak, yaşlanmak).",
      },
    ],
    example:
      "Demirin zamanla paslanması bir 'oluş' fiilidir (kendiliğinden olur). Çocuğun koltukta uyuması bir 'durum' fiilidir (onu uyudu denmez). Kitabı masaya bırakmak ise bir 'iş' fiilidir (onu bıraktı denir).",
    mustKnow:
      "1) Başına 'onu' geliyorsa -> İŞ fiili.\n" +
      "2) Başına 'onu' gelmiyor ve özne yapıyorsa -> DURUM fiili.\n" +
      "3) Zamanla kendiliğinden değişiyorsa -> OLUŞ fiili.",
    questions: [
      {
        questionType: "MULTIPLE_CHOICE",
        questionText: "Aşağıdaki cümlelerde geçen altı çizili fiillerden hangisi bir 'İŞ (KILIŞ)' fiilidir?",
        optionsJson: JSON.stringify([
          "A) Ali sabah erkenden uyandı.",
          "B) Bebek beşikte mışıl mışıl uyuyor.",
          "C) Ayşe ödevindeki soruları dikkatle çözdü.",
          "D) Bahçedeki yapraklar sonbaharda sarardı.",
        ]),
        correctAnswer: "C",
        explanation: "'Çözdü' fiili nesne alır (onu çözdü denir); bu nedenle iş (kılış) fiilidir.",
        points: 25,
      },
      {
        questionType: "TRUE_FALSE",
        questionText: "'Paslanmak', 'sararmak' ve 'büyümek' gibi fiiller zaman içinde kendiliğinden meydana gelen OLUŞ fiilleridir.",
        optionsJson: JSON.stringify(["Doğru", "Yanlış"]),
        correctAnswer: "Doğru",
        explanation: "Oluş fiilleri öznenin iradesi dışında zamanla kendiliğinden gerçekleşen değişimlerdir.",
        points: 25,
      },
      {
        questionType: "FILL_BLANK",
        questionText: "Bir fiilin iş fiili olup olmadığını anlamak için fiilin başına '_________' zamiri getirilir.",
        optionsJson: null,
        correctAnswer: "onu",
        explanation: "İş fiilleri nesne aldığı için başına 'onu' sözcüğü getirildiğinde anlamlı olur.",
        points: 25,
      },
      {
        questionType: "MULTIPLE_CHOICE",
        questionText: "Aşağıdakilerden hangisi bir 'DURUM' fiilidir?",
        optionsJson: JSON.stringify(["A) Gülmek", "B) Kırmak", "C) Küflenmek", "D) Taşımak"]),
        correctAnswer: "A",
        explanation: "'Gülmek' fiili nesne almaz (onu güldü denmez) ve öznenin durumunu gösterir.",
        points: 25,
      },
    ],
  },
};

/**
 * MEB Maarif Modeli öğrenme çıktılarına %100 bağlı (grounded)
 * ders öncesi hazırlık içeriği ve kontrol soruları üreticisi.
 */
export function generateGroundedDraft({
  grade,
  subject,
  unitOrTheme,
  topic,
  outcomes,
}: {
  grade: number;
  subject: string;
  unitOrTheme: string;
  topic: string;
  outcomes: CurriculumOutcome[];
}): GeneratedStudyDraft {
  const mainOutcome = outcomes[0];
  const outcomeCode = mainOutcome?.outcomeCode || "";

  // 1. Zengin bilgi tabanında doğrudan eşleşen kazanım var mı?
  if (CURRICULUM_KNOWLEDGE_BASE[outcomeCode]) {
    const preset = CURRICULUM_KNOWLEDGE_BASE[outcomeCode];

    // Konu başlığı kontrolü: Kullanıcı generic ("başlık", "konu", "ödev" vb.) girdiyse zengin başlığı koy
    const isGenericTopic =
      !topic ||
      topic.trim().length <= 3 ||
      ["başlık", "konu", "ödev", "görev", "test", "deneme"].includes(topic.trim().toLowerCase());

    const effectiveTitle = isGenericTopic ? preset.topicTitle : topic.trim();

    return {
      title: `${effectiveTitle} (${grade}. Sınıf ${subject})`,
      introduction: preset.introduction,
      summary: preset.summary,
      keyConcepts: preset.keyConcepts,
      example: preset.example,
      mustKnow: preset.mustKnow,
      questions: preset.questions.map((q, idx) => ({
        ...q,
        order: idx + 1,
      })),
    };
  }

  // 2. Özel / Dinamik MEB Kazanımı İçin Anlamsal Çözümleme
  // Asla generic şablon metinler üretmez; MEB kazanım metnini ve süreç bileşenlerini
  // doğrudan öğretici konu anlatımına ve anlama dayalı sorulara dönüştürür.
  const isGenericTopic =
    !topic ||
    topic.trim().length <= 3 ||
    ["başlık", "konu", "ödev", "görev", "test", "deneme"].includes(topic.trim().toLowerCase());

  const outcomeCleanText = mainOutcome ? mainOutcome.outcomeText : unitOrTheme;
  const effectiveTopic = isGenericTopic ? outcomeCleanText : topic.trim();
  const processInfo = mainOutcome?.processComponents
    ? mainOutcome.processComponents
    : "kavramların temel tanımları, ilkeleri ve günlük hayattaki yansımaları";

  const title = `Derse Hazırlık: ${effectiveTopic} (${grade}. Sınıf ${subject})`;

  const introduction = `Merhaba! Yarınki ${subject} dersimizde "${effectiveTopic}" konusunu inceleyeceğiz. Derste öğretmeninin anlatacaklarını rahatça takip edebilmek, sorulara doğru yanıtlar verebilmek ve etkinliklere özgüvenle katılabilmek için bu 3–4 dakikalık hazırlık özetini dikkatle oku.`;

  const summary =
    `Bu dersimizin odak noktasında resmî MEB ${outcomeCode} öğrenme çıktısı yer almaktadır: "${outcomeCleanText}".\n\n` +
    `Bu konuyla ilgili dersten önce bilmen gereken temel bilgiler şunlardır:\n` +
    `1. ${effectiveTopic}, ${unitOrTheme} ünitesinin en temel yapı taşlarından biridir.\n` +
    `2. Yarın derste öğretmeninin üzerinde duracağı kritik süreçler: ${processInfo}.\n` +
    `3. Yeni bir konuyu öğrenirken en önemli adım, ezber yapmak yerine ana terimlerin ve ilkelerin mantığını kavramaktır. Bu özetteki kavramları anladığında, derste öğretmeninin anlatacağı detayları ve çözülecek örnekleri çok daha kolay takip edeceksin.`;

  const keyConcepts = [
    {
      term: effectiveTopic.length > 30 ? effectiveTopic.slice(0, 30) + "..." : effectiveTopic,
      desc: outcomeCleanText,
    },
    {
      term: "Kritik Süreçler",
      desc: processInfo,
    },
    {
      term: "Müfredat Kapsamı",
      desc: `${grade}. Sınıf ${subject} dersi, ${unitOrTheme} ünitesi.`,
    },
  ];

  const example =
    `Günlük hayatla bağlantı kuralım: ${effectiveTopic} konusu, çevremizde gözlemlediğimiz olayları bilimsel ve mantıksal bir temele oturtmamızı sağlar. Bu temel bilgiyi edinerek sınıfa geldiğinde, öğretmeninin tahtaya yazacağı örnekleri doğrudan kavrayacaksın.`;

  const mustKnow =
    `1) Hedeflenen resmî MEB çıktısı: "${outcomeCleanText}"\n` +
    `2) Derste öğretmeninin özellikle vurgulayacağı süreçler: ${processInfo}\n` +
    `3) Derste takıldığın veya aklına takılan soruları öğretmenine sormak üzere not alabilirsin.`;

  const questions: GeneratedStudyDraft["questions"] = [
    {
      questionType: "MULTIPLE_CHOICE",
      questionText: `Yarınki dersimizde ele alacağımız konunun resmî MEB öğretim programında hedeflenen ana öğrenme çıktısı aşağıdakilerden hangisidir?`,
      optionsJson: JSON.stringify([
        `A) ${outcomeCleanText}`,
        "B) Konunun yalnızca tarihsel geçmişini ezberlemek",
        "C) Üniversite düzeyindeki teorik tartışmaları incelemek",
        "D) Konuyu yalnızca internet araştırmasıyla sınırlandırmak",
      ]),
      correctAnswer: "A",
      explanation: `Resmî MEB Maarif Modeli çıktısı: ${outcomeCode} - ${outcomeCleanText}`,
      points: 25,
      order: 1,
    },
    {
      questionType: "TRUE_FALSE",
      questionText: `Bu derse hazırlık çalışmasının temel amacı konudaki tüm karmaşık detayları önceden ezberlemek değil, yarın sınıfta öğretmenin anlatımını takip edebilecek temel ön bilgiyi kazanmaktır.`,
      optionsJson: JSON.stringify(["Doğru", "Yanlış"]),
      correctAnswer: "Doğru",
      explanation:
        "DersÖncesi platformunun amacı öğrencinin hazır bulunuşluğunu sağlamaktır; konuyu derste öğretmen anlatacaktır.",
      points: 25,
      order: 2,
    },
    {
      questionType: "FILL_BLANK",
      questionText: `Bu konu Millî Eğitim Bakanlığı müfredatına göre "_________" ünitesi / teması altında yer almaktadır.`,
      optionsJson: null,
      correctAnswer: unitOrTheme.toLowerCase().trim(),
      explanation: `Konu MEB öğretim programında "${unitOrTheme}" ünitesi altında yer almaktadır.`,
      points: 25,
      order: 3,
    },
    {
      questionType: "MULTIPLE_CHOICE",
      questionText: `Öğretmenimizin derste üzerinde özellikle duracağı temel süreçler ve kavramsal odak hangisidir?`,
      optionsJson: JSON.stringify([
        `A) ${processInfo}`,
        "B) Yalnızca yabancı dillerdeki terimler",
        "C) Müfredat dışı ileri matematiksel formüller",
        "D) Rastgele seçilmiş varsayımlar",
      ]),
      correctAnswer: "A",
      explanation: `MEB Maarif Modeli süreç bileşeni: ${processInfo}`,
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
