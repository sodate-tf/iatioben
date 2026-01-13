// lib/liturgia/liturgicalParagraphs.ts

export type LocaleKey = "pt" | "en";

export type Message = {
  pt: string;
  en: string;
};

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

/**
 * Aceita:
 * - "13/01/2026" (dd/mm/yyyy)
 * - "13-01-2026" (dd-mm-yyyy)  -> seus slugs
 * - ISO (yyyy-mm-dd)
 */
export function parseAnyDate(input: string): Date | null {
  const s = (input || "").trim();
  if (!s) return null;

  // 1) DD/MM/YYYY
  if (s.includes("/")) {
    const [ddS, mmS, yyyyS] = s.split("/");
    const dd = Number(ddS);
    const mm = Number(mmS);
    const yyyy = Number(yyyyS);
    return buildValidDate(yyyy, mm, dd);
  }

  // 2) DD-MM-YYYY ou MM-DD-YYYY
  if (s.includes("-")) {
    const [aS, bS, cS] = s.split("-");
    const a = Number(aS);
    const b = Number(bS);
    const yyyy = Number(cS);
    if (!a || !b || !yyyy) return null;

    // Heurística segura:
    // - se a > 12, então é DD-MM-YYYY
    // - senão, tratamos como MM-DD-YYYY (padrão do EN)
    if (a > 12) {
      return buildValidDate(yyyy, b, a);
    } else {
      return buildValidDate(yyyy, a, b);
    }
  }

  return null;
}

function buildValidDate(yyyy: number, mm: number, dd: number): Date | null {
  if (!yyyy || mm < 1 || mm > 12 || dd < 1 || dd > 31) return null;

  // “meio do dia” em UTC reduz risco de shift por fuso ao usar keys UTC
  const dt = new Date(Date.UTC(yyyy, mm - 1, dd, 12, 0, 0));

  // valida overflow (ex.: 02/31)
  if (
    dt.getUTCFullYear() !== yyyy ||
    dt.getUTCMonth() !== mm - 1 ||
    dt.getUTCDate() !== dd
  ) {
    return null;
  }
  return dt;
}

/** Algoritmo de Páscoa (Meeus/Jones/Butcher) para calendário Gregoriano */
export function easterSundayUTC(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31); // 3=Mar, 4=Apr
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
}

function addDaysUTC(dt: Date, days: number): Date {
  const ms = dt.getTime() + days * 86400000;
  return new Date(ms);
}

function ymdUTC(dt: Date) {
  return {
    y: dt.getUTCFullYear(),
    m: dt.getUTCMonth() + 1,
    d: dt.getUTCDate(),
  };
}

function monthDayKeyUTC(dt: Date) {
  const { m, d } = ymdUTC(dt);
  return `${pad2(m)}-${pad2(d)}`; // MM-DD
}

export type Season = "advent" | "christmas" | "lent" | "easter" | "ordinary";

function startOfAdventUTC(year: number): Date {
  const christmas = new Date(Date.UTC(year, 11, 25, 12, 0, 0));
  let dt = addDaysUTC(christmas, -28);
  while (dt.getUTCDay() !== 0) dt = addDaysUTC(dt, -1);
  return dt;
}

function baptismOfTheLordApproxUTC(year: number): Date {
  // Aproximação universal simples (pode variar por país/transferências):
  // Epifania fixa em 06/01 e “batismo” no domingo seguinte.
  const epiphany = new Date(Date.UTC(year, 0, 6, 12, 0, 0));
  let dt = epiphany;
  while (dt.getUTCDay() !== 0) dt = addDaysUTC(dt, 1);
  return addDaysUTC(dt, 7);
}

export function getSeasonUTC(dt: Date): Season {
  const { y } = ymdUTC(dt);

  const easter = easterSundayUTC(y);
  const ashWednesday = addDaysUTC(easter, -46);
  const pentecost = addDaysUTC(easter, 49);

  const adventStart = startOfAdventUTC(y);
  const christmas = new Date(Date.UTC(y, 11, 25, 12, 0, 0));
  const baptismApprox = baptismOfTheLordApproxUTC(y);

  const time = dt.getTime();

  if (time >= adventStart.getTime() && time < christmas.getTime()) return "advent";
  if (time >= christmas.getTime() && time <= baptismApprox.getTime()) return "christmas";
  if (time >= ashWednesday.getTime() && time < easter.getTime()) return "lent";
  if (time >= easter.getTime() && time <= pentecost.getTime()) return "easter";
  return "ordinary";
}

/**
 * 1) Mensagens fixas por MM-DD (solenidades/memórias fortes e altamente relevantes)
 * Dica editorial: priorize “o que o fiel faz hoje” + “por que isso importa”.
 */
const fixedByMonthDay: Record<string, Message> = {
  // JAN
  "01-01": {
    pt: "Hoje a Igreja celebra Santa Maria, Mãe de Deus. Comece o ano sob a intercessão da Mãe: reze, escute a Palavra e escolha a paz que Cristo oferece.",
    en: "Today the Church celebrates Mary, Mother of God. Begin the year under her intercession: pray, listen to the Word, and choose the peace Christ gives.",
  },
  "01-06": {
    pt: "Epifania do Senhor. Deus se revela às nações: peça um coração disponível para reconhecer Cristo e segui-lo sem atalhos, com alegria e reverência.",
    en: "Epiphany of the Lord. God is revealed to the nations: ask for a willing heart to recognize Christ and follow Him with joy and reverence.",
  },
  "01-25": {
    pt: "Conversão de São Paulo. O Evangelho não é apenas informação: é encontro que muda rota. Hoje, entregue a Deus uma área concreta da sua vida.",
    en: "Conversion of Saint Paul. The Gospel is not mere information; it is an encounter that changes direction. Today, surrender one concrete area of your life to God.",
  },

  // FEB
  "02-02": {
    pt: "Apresentação do Senhor. Luz para iluminar as nações: leve Cristo para o centro do seu dia e peça a graça de ser luz sem barulho, com constância.",
    en: "Presentation of the Lord. A light for the nations: place Christ at the center of your day and ask for the grace to be light quietly, with steadiness.",
  },
  "02-11": {
    pt: "Nossa Senhora de Lourdes. Em meio às fragilidades, Deus não se afasta. Hoje, reze pelos enfermos e peça confiança para atravessar as lutas com fé.",
    en: "Our Lady of Lourdes. In our frailty, God does not withdraw. Today, pray for the sick and ask for trust to walk through trials with faith.",
  },

  // MAR
  "03-19": {
    pt: "Solenidade de São José. Peça a graça de uma fé prática e silenciosa: confiar, proteger, trabalhar com retidão e obedecer a Deus quando o caminho não está claro.",
    en: "Solemnity of Saint Joseph. Ask for practical, quiet faith: to trust, protect, work with integrity, and obey God when the path is not clear.",
  },
  "03-25": {
    pt: "Anunciação do Senhor. Deus começa grandes histórias com um “sim” humilde. Hoje, responda com fé: acolha a vontade divina e caminhe um passo de cada vez.",
    en: "Annunciation of the Lord. God begins great stories with a humble “yes.” Today, respond in faith: receive God’s will and walk one step at a time.",
  },

  // APR
  "04-25": {
    pt: "São Marcos, Evangelista. A Boa Nova precisa de testemunhas com clareza e coragem. Hoje, leia um trecho do Evangelho e pratique uma decisão simples.",
    en: "Saint Mark the Evangelist. The Good News needs witnesses with clarity and courage. Today, read a Gospel passage and practice one simple decision.",
  },

  // MAY
  "05-01": {
    pt: "São José Operário. Santidade também se constrói no trabalho bem feito. Hoje, ofereça suas tarefas a Deus e transforme rotina em oração.",
    en: "Saint Joseph the Worker. Holiness is built through well-done work. Today, offer your tasks to God and turn routine into prayer.",
  },
  "05-13": {
    pt: "Nossa Senhora de Fátima. Maria nos chama à conversão simples: oração, penitência e paz. Hoje, reze com sinceridade e renove o compromisso com Cristo.",
    en: "Our Lady of Fatima. Mary calls us to simple conversion: prayer, penance, and peace. Today, pray sincerely and renew your commitment to Christ.",
  },
  "05-31": {
    pt: "Visitação de Nossa Senhora. A fé verdadeira coloca a gente a caminho para servir. Hoje, procure alguém para encorajar e leve a alegria de Cristo.",
    en: "Visitation of Mary. True faith sets us on the road to serve. Today, encourage someone and carry the joy of Christ.",
  },

  // JUN
  "06-24": {
    pt: "Nascimento de São João Batista. Preparar caminhos é obra de humildade. Hoje, diminua o ego e aumente a escuta: a Palavra floresce em coração simples.",
    en: "Nativity of Saint John the Baptist. Preparing the way is the work of humility. Today, lessen the ego and deepen listening: the Word grows in a simple heart.",
  },
  "06-29": {
    pt: "Solenidade de São Pedro e São Paulo. Dois chamados, uma mesma missão: permanecer firme na fé e anunciar Cristo com coragem, caridade e fidelidade à Igreja.",
    en: "Solemnity of Saints Peter and Paul. Two callings, one mission: stand firm in faith and proclaim Christ with courage, charity, and fidelity to the Church.",
  },

  // AUG
  "08-06": {
    pt: "Transfiguração do Senhor. Antes da cruz, Deus mostra a glória para sustentar a caminhada. Hoje, peça luz para enxergar sentido e seguir firme.",
    en: "Transfiguration of the Lord. Before the cross, God shows glory to strengthen the journey. Today, ask for light to see meaning and keep going.",
  },
  "08-15": {
    pt: "Assunção de Nossa Senhora. Onde Maria já está, a esperança da Igreja se renova: viva hoje com os olhos no alto sem abandonar a responsabilidade do cotidiano.",
    en: "Assumption of Mary. Where Mary already is, the Church’s hope is renewed: live today with your eyes set on heaven without neglecting daily responsibilities.",
  },

  // SEP
  "09-14": {
    pt: "Exaltação da Santa Cruz. A cruz não é derrota: é amor levado até o fim. Hoje, entregue a Deus suas dores e escolha amar com fidelidade.",
    en: "Exaltation of the Holy Cross. The cross is not defeat; it is love carried to the end. Today, entrust your sorrows to God and choose faithful love.",
  },
  "09-29": {
    pt: "Santos Arcanjos. Deus conduz e protege. Hoje, peça discernimento, firmeza e humildade para escolher o bem com coragem.",
    en: "Saints Michael, Gabriel, and Raphael. God guides and protects. Today, ask for discernment, steadfastness, and humility to choose the good with courage.",
  },

  // OCT
  "10-04": {
    pt: "São Francisco de Assis. A alegria do Evangelho combina simplicidade com coragem. Hoje, faça paz, pratique o bem e cuide do que Deus confiou a você.",
    en: "Saint Francis of Assisi. Gospel joy unites simplicity and courage. Today, make peace, do good, and care for what God has entrusted to you.",
  },
  "10-12": {
    pt: "Nossa Senhora Aparecida. Sob o manto da Mãe, o Brasil aprende a confiar de novo. Hoje, reze pela sua família e peça um coração perseverante na fé.",
    en: "Our Lady of Aparecida. Under Mary’s mantle, Brazil learns to trust again. Today, pray for your family and ask for a persevering heart in faith.",
  },

  // NOV
  "11-01": {
    pt: "Solenidade de Todos os Santos. Santidade não é para poucos: é vocação. Hoje, escolha um passo concreto de virtude e fidelidade — pequeno, mas real.",
    en: "All Saints’ Day. Holiness is not for a few; it is a vocation. Today, choose one concrete step in virtue and fidelity—small, but real.",
  },
  "11-02": {
    pt: "Comemoração de Todos os Fiéis Defuntos. Reze pelos que partiram e renove a esperança: em Cristo, a morte não é a última palavra.",
    en: "All Souls’ Day. Pray for the departed and renew hope: in Christ, death does not have the last word.",
  },
  "11-09": {
    pt: "Dedicação da Basílica de Latrão. A Igreja é casa e família: pedra viva, povo reunido. Hoje, fortaleça sua comunhão e viva a fé em comunidade.",
    en: "Dedication of the Lateran Basilica. The Church is a home and a family: living stones, a gathered people. Today, strengthen communion and live faith in community.",
  },

  // DEC
  "12-08": {
    pt: "Imaculada Conceição de Maria. Deus prepara caminhos de graça antes mesmo de entendermos o porquê. Hoje, peça um coração mais puro para acolher a vontade divina.",
    en: "Immaculate Conception of Mary. God prepares paths of grace before we even understand why. Today, ask for a purer heart to receive God’s will.",
  },
  "12-25": {
    pt: "Natal do Senhor. Deus se fez próximo: contemple, agradeça e deixe a humildade de Cristo reorganizar suas prioridades e seu modo de amar.",
    en: "Christmas Day. God has drawn near: contemplate, give thanks, and let Christ’s humility reorder your priorities and your way of loving.",
  },
  "12-26": {
    pt: "Santo Estêvão, primeiro mártir. A fé se prova na fidelidade. Hoje, peça coragem para viver o Evangelho sem negociar o essencial.",
    en: "Saint Stephen, the first martyr. Faith is tested in fidelity. Today, ask for courage to live the Gospel without bargaining the essentials.",
  },
};

/**
 * 2) Datas móveis relevantes (baseadas na Páscoa)
 * Nota: algumas podem ser transferidas por conferência episcopal (Ascensão, Corpus Christi).
 */
function movableMessageUTC(dt: Date): Message | null {
  const y = dt.getUTCFullYear();
  const easter = easterSundayUTC(y);

  const ashWednesday = addDaysUTC(easter, -46);
  const palmSunday = addDaysUTC(easter, -7);
  const holyThursday = addDaysUTC(easter, -3);
  const goodFriday = addDaysUTC(easter, -2);

  const ascension = addDaysUTC(easter, 39); // universal (quinta-feira)
  const pentecost = addDaysUTC(easter, 49);
  const trinitySunday = addDaysUTC(easter, 56);
  const corpusChristi = addDaysUTC(easter, 60); // universal (quinta-feira)
  const sacredHeart = addDaysUTC(easter, 68); // sexta após Corpus Christi
  const divineMercy = addDaysUTC(easter, 7); // 2º Domingo da Páscoa

  const key = dt.getTime();
  const same = (a: Date) => a.getTime() === key;

  if (same(ashWednesday)) {
    return {
      pt: "Quarta-feira de Cinzas. Começa um caminho de conversão: menos aparência, mais verdade; menos distração, mais oração; menos ego, mais Evangelho.",
      en: "Ash Wednesday. A path of conversion begins: less appearance, more truth; less distraction, more prayer; less ego, more Gospel.",
    };
  }
  if (same(palmSunday)) {
    return {
      pt: "Domingo de Ramos. Entre aplausos e cruz, escolha permanecer com Cristo quando o entusiasmo passa e a fidelidade é provada.",
      en: "Palm Sunday. Between cheers and the cross, choose to remain with Christ when enthusiasm fades and fidelity is tested.",
    };
  }
  if (same(holyThursday)) {
    return {
      pt: "Quinta-feira Santa. Eucaristia e serviço: hoje a Igreja recorda que adorar e servir caminham juntos — mesa e lava-pés.",
      en: "Holy Thursday. Eucharist and service: today the Church remembers that worship and service belong together—table and basin.",
    };
  }
  if (same(goodFriday)) {
    return {
      pt: "Sexta-feira da Paixão. Diante da cruz, silencie. A salvação não veio por força, mas por amor levado até o fim.",
      en: "Good Friday. Before the cross, be still. Salvation came not by force, but by love carried to the end.",
    };
  }
  if (same(easter)) {
    return {
      pt: "Domingo da Páscoa. Cristo vive. Recomece com esperança: a Ressurreição muda o sentido do sofrimento, da culpa e do futuro.",
      en: "Easter Sunday. Christ is risen. Begin again with hope: the Resurrection changes the meaning of suffering, guilt, and the future.",
    };
  }
  if (same(divineMercy)) {
    return {
      pt: "2º Domingo da Páscoa (Divina Misericórdia). A Ressurreição abre uma porta: recomeçar. Hoje, confie seus limites a Jesus e escolha perdoar.",
      en: "Second Sunday of Easter (Divine Mercy). The Resurrection opens a door: a new beginning. Today, entrust your limits to Jesus and choose forgiveness.",
    };
  }
  if (same(ascension)) {
    return {
      pt: "Ascensão do Senhor. Cristo não se ausenta: Ele envia e confia uma missão. Hoje, peça firmeza para testemunhar no seu cotidiano.",
      en: "Ascension of the Lord. Christ does not abandon; He sends and entrusts a mission. Today, ask for strength to witness in daily life.",
    };
  }
  if (same(pentecost)) {
    return {
      pt: "Pentecostes. O Espírito Santo renova a Igreja por dentro. Hoje, peça coragem para testemunhar e humildade para ouvir a voz de Deus.",
      en: "Pentecost. The Holy Spirit renews the Church from within. Today, ask for courage to witness and humility to hear God’s voice.",
    };
  }
  if (same(trinitySunday)) {
    return {
      pt: "Santíssima Trindade. Deus é comunhão de amor. Hoje, viva a fé com profundidade: reze com simplicidade e ame com verdade.",
      en: "Trinity Sunday. God is a communion of love. Today, live the faith with depth: pray simply and love truthfully.",
    };
  }
  if (same(corpusChristi)) {
    return {
      pt: "Corpus Christi. A fé é encontro real: Cristo se faz alimento e presença. Hoje, aproxime-se da Eucaristia e renove sua adoração.",
      en: "Corpus Christi. Faith is a real encounter: Christ becomes our food and presence. Today, draw near to the Eucharist and renew your worship.",
    };
  }
  if (same(sacredHeart)) {
    return {
      pt: "Sagrado Coração de Jesus. O amor de Cristo não é teoria: é consolo e compromisso. Hoje, entregue suas inquietações e escolha amar com paciência.",
      en: "Sacred Heart of Jesus. Christ’s love is not theory; it is consolation and commitment. Today, entrust your anxieties and choose patient love.",
    };
  }

  return null;
}

/** 3) Fallback por Tempo Litúrgico (nunca fica sem parágrafo) */
const seasonFallback: Record<Season, Message> = {
  advent: {
    pt: "Advento é tempo de vigiar com esperança e preparar o coração. Hoje, diminua o ruído (menos pressa, menos distração), retome a oração e peça a Deus um sinal concreto de conversão para esta semana.",
    en: "Advent is a season of watchful hope and heart-preparation. Today, reduce the noise (less hurry, fewer distractions), return to prayer, and ask God for one concrete step of conversion this week.",
  },
  christmas: {
    pt: "No Tempo do Natal, Deus se faz próximo e visita a nossa rotina. Hoje, contemple a Encarnação: escolha um gesto simples de caridade, reconcilie-se se for possível e agradeça pela presença de Cristo.",
    en: "In the Christmas Season, God draws near and enters ordinary life. Today, contemplate the Incarnation: choose one simple act of charity, seek reconciliation if possible, and give thanks for Christ’s presence.",
  },
  lent: {
    pt: "Quaresma é conversão com direção: oração que reorganiza, jejum que liberta e caridade que cura. Hoje, assuma um compromisso realista (pequeno, mas fiel) e viva o Evangelho sem teatralidade, com constância.",
    en: "Lent is conversion with direction: prayer that reorders, fasting that frees, and almsgiving that heals. Today, take on a realistic commitment (small but faithful) and live the Gospel without display, with steadiness.",
  },
  easter: {
    pt: "No Tempo Pascal, a Ressurreição muda o horizonte: a vida não termina na dor. Hoje, reze com alegria serena, alimente a esperança e transforme a fé em atitude — perdão, serviço e confiança no agir de Deus.",
    en: "In the Easter Season, the Resurrection changes the horizon: life does not end in sorrow. Today, pray with steady joy, strengthen hope, and turn faith into action—forgiveness, service, and trust in God’s work.",
  },
  ordinary: {
    pt: "Tempo Comum é o Evangelho vivido no simples. Hoje, santifique a rotina: faça bem o que precisa ser feito, trate as pessoas com caridade concreta, e leve a Palavra para uma decisão prática do seu dia.",
    en: "Ordinary Time is the Gospel lived in the simple. Today, sanctify routine: do what needs to be done well, treat people with concrete charity, and bring the Word into one practical decision you will make today.",
  },
};

export function getDailyParagraph(dateInput: string | Date, locale: LocaleKey): string {
  const dt = typeof dateInput === "string" ? parseAnyDate(dateInput) : dateInput;

  if (!dt) {
    return locale === "pt"
      ? "Reze com a Liturgia de hoje e peça a Deus a graça de viver a Palavra com fidelidade."
      : "Pray with today’s Liturgy and ask God for the grace to live the Word faithfully.";
  }

  const fixed = fixedByMonthDay[monthDayKeyUTC(dt)];
  const movable = movableMessageUTC(dt);
  const season = getSeasonUTC(dt);

  const msg = fixed ?? movable ?? seasonFallback[season];
  return msg[locale];
}
