const express = require("express");
const cors = require("cors");

const app = express();
const PORT = Number(process.env.PORT || 3000);
const CACHE_MS = Number(process.env.CACHE_MS || 5 * 60 * 1000);
const PREMIUM_KEY = process.env.PREMIUM_KEY || "COPA2026";
const PREMIUM_PRICE = Number(process.env.PREMIUM_PRICE || 9.99);
const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN || "";
const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const EMAIL_FROM = process.env.EMAIL_FROM || "Calculadora da Copa <onboarding@resend.dev>";
const PUBLIC_SITE_URL = process.env.PUBLIC_SITE_URL || "https://calculadora-copa-2026.netlify.app";
const PUBLIC_API_URL = process.env.PUBLIC_API_URL || "";

app.use(cors());
app.use(express.json({ limit: "1mb" }));

const TEAMS = {
  DZ: "Algeria",
  AR: "Argentina",
  AU: "Australia",
  AT: "Austria",
  BE: "Belgium",
  BA: "Bosnia and Herzegovina",
  BR: "Brazil",
  CA: "Canada",
  CV: "Cape Verde",
  CO: "Colombia",
  HR: "Croatia",
  CW: "Curaçao",
  CZ: "Czechia",
  CD: "DR Congo",
  EC: "Ecuador",
  EG: "Egypt",
  EN: "England",
  FR: "France",
  DE: "Germany",
  GH: "Ghana",
  HT: "Haiti",
  IR: "Iran",
  IQ: "Iraq",
  CI: "Ivory Coast",
  JP: "Japan",
  JO: "Jordan",
  MX: "Mexico",
  MA: "Morocco",
  NL: "Netherlands",
  NZ: "New Zealand",
  NO: "Norway",
  PA: "Panama",
  PY: "Paraguay",
  PT: "Portugal",
  QA: "Qatar",
  SA: "Saudi Arabia",
  SQ: "Scotland",
  SN: "Senegal",
  ZA: "South Africa",
  KR: "South Korea",
  ES: "Spain",
  SE: "Sweden",
  CH: "Switzerland",
  TN: "Tunisia",
  TR: "Turkey",
  UY: "Uruguay",
  US: "United States",
  UZ: "Uzbekistan"
};

const EXTRA_TEAMS = {
  AL: "Albania",
  AM: "Armenia",
  AZ: "Azerbaijan",
  BF: "Burkina Faso",
  BG: "Bulgaria",
  BH: "Bahrain",
  BO: "Bolivia",
  BY: "Belarus",
  CL: "Chile",
  CM: "Cameroon",
  CN: "China",
  DK: "Denmark",
  EE: "Estonia",
  FI: "Finland",
  GE: "Georgia",
  GR: "Greece",
  HU: "Hungary",
  ID: "Indonesia",
  IE: "Ireland",
  IN: "India",
  IS: "Iceland",
  KG: "Kyrgyzstan",
  KW: "Kuwait",
  LB: "Lebanon",
  LT: "Lithuania",
  LV: "Latvia",
  ME: "Montenegro",
  MK: "North Macedonia",
  ML: "Mali",
  MY: "Malaysia",
  NG: "Nigeria",
  NI: "Northern Ireland",
  OM: "Oman",
  PE: "Peru",
  PH: "Philippines",
  PL: "Poland",
  PS: "Palestine",
  RO: "Romania",
  RS: "Serbia",
  RU: "Russia",
  SG: "Singapore",
  SI: "Slovenia",
  SK: "Slovakia",
  SV: "El Salvador",
  SY: "Syria",
  TH: "Thailand",
  TJ: "Tajikistan",
  TM: "Turkmenistan",
  UA: "Ukraine",
  AE: "United Arab Emirates",
  VE: "Venezuela",
  VN: "Vietnam",
  WA: "Wales",
  YE: "Yemen"
};

const ALL_TEAMS = { ...EXTRA_TEAMS, ...TEAMS };

const TEAM_ALIASES = {
  argelia: "Algeria",
  argentina: "Argentina",
  australia: "Australia",
  austria: "Austria",
  belgica: "Belgium",
  "bélgica": "Belgium",
  bosnia: "Bosnia and Herzegovina",
  "bósnia": "Bosnia and Herzegovina",
  brasil: "Brazil",
  canada: "Canada",
  "canadá": "Canada",
  "cabo verde": "Cape Verde",
  colombia: "Colombia",
  "colômbia": "Colombia",
  croacia: "Croatia",
  "croácia": "Croatia",
  curacao: "Cura?ao",
  "curaçao": "Cura?ao",
  tchequia: "Czechia",
  "tchéquia": "Czechia",
  congo: "DR Congo",
  equador: "Ecuador",
  egito: "Egypt",
  inglaterra: "England",
  franca: "France",
  "frança": "France",
  alemanha: "Germany",
  gana: "Ghana",
  haiti: "Haiti",
  ira: "Iran",
  "irã": "Iran",
  iraque: "Iraq",
  "costa do marfim": "Ivory Coast",
  japao: "Japan",
  "japão": "Japan",
  jordania: "Jordan",
  "jordânia": "Jordan",
  mexico: "Mexico",
  "méxico": "Mexico",
  marrocos: "Morocco",
  holanda: "Netherlands",
  "nova zelandia": "New Zealand",
  "nova zelândia": "New Zealand",
  noruega: "Norway",
  panama: "Panama",
  "panamá": "Panama",
  paraguai: "Paraguay",
  portugal: "Portugal",
  catar: "Qatar",
  "arabia saudita": "Saudi Arabia",
  "arábia saudita": "Saudi Arabia",
  escocia: "Scotland",
  "escócia": "Scotland",
  senegal: "Senegal",
  "africa do sul": "South Africa",
  "áfrica do sul": "South Africa",
  "coreia do sul": "South Korea",
  espanha: "Spain",
  suecia: "Sweden",
  "suécia": "Sweden",
  suica: "Switzerland",
  "suíça": "Switzerland",
  tunisia: "Tunisia",
  "tunísia": "Tunisia",
  turquia: "Turkey",
  uruguai: "Uruguay",
  "estados unidos": "United States",
  uzbequistao: "Uzbekistan",
  "uzbequistão": "Uzbekistan"
};

const LOCAL_NAMES = {
  Algeria: "Argélia",
  Argentina: "Argentina",
  Australia: "Austrália",
  Austria: "Áustria",
  Belgium: "Bélgica",
  "Bosnia and Herzegovina": "Bósnia e Herzegovina",
  Brazil: "Brasil",
  Canada: "Canadá",
  "Cape Verde": "Cabo Verde",
  Colombia: "Colômbia",
  Croatia: "Croácia",
  "Cura?ao": "Curaçao",
  Czechia: "Tchéquia",
  "DR Congo": "RD Congo",
  Ecuador: "Equador",
  Egypt: "Egito",
  England: "Inglaterra",
  France: "França",
  Germany: "Alemanha",
  Ghana: "Gana",
  Haiti: "Haiti",
  Iran: "Irã",
  Iraq: "Iraque",
  "Ivory Coast": "Costa do Marfim",
  Japan: "Japão",
  Jordan: "Jordânia",
  Mexico: "México",
  Morocco: "Marrocos",
  Netherlands: "Holanda",
  "New Zealand": "Nova Zelândia",
  Norway: "Noruega",
  Panama: "Panamá",
  Paraguay: "Paraguai",
  Portugal: "Portugal",
  Qatar: "Catar",
  "Saudi Arabia": "Arábia Saudita",
  Scotland: "Escócia",
  Senegal: "Senegal",
  "South Africa": "África do Sul",
  "South Korea": "Coreia do Sul",
  Spain: "Espanha",
  Sweden: "Suécia",
  Switzerland: "Suíça",
  Tunisia: "Tunísia",
  Turkey: "Turquia",
  Uruguay: "Uruguai",
  "United States": "Estados Unidos",
  Uzbekistan: "Uzbequistão"
};

const DEFAULT_SCHEDULE = [
  ["A", "2026-06-11", "Mexico", "South Africa", 2, 0],
  ["A", "2026-06-11", "South Korea", "Czechia", 2, 1],
  ["B", "2026-06-12", "Canada", "Bosnia and Herzegovina", 1, 1],
  ["D", "2026-06-12", "United States", "Paraguay", 4, 1],
  ["B", "2026-06-13", "Switzerland", "Qatar", 1, 1],
  ["C", "2026-06-13", "Brazil", "Morocco", 1, 1],
  ["C", "2026-06-13", "Scotland", "Haiti", 1, 0],
  ["D", "2026-06-14", "Australia", "Turkey", 2, 0],
  ["E", "2026-06-14", "Germany", "Curaçao", 7, 1],
  ["F", "2026-06-14", "Netherlands", "Japan", 2, 2],
  ["E", "2026-06-14", "Ivory Coast", "Ecuador", 1, 0],
  ["F", "2026-06-14", "Sweden", "Tunisia", 5, 1],
  ["H", "2026-06-15", "Spain", "Cape Verde", 0, 0],
  ["G", "2026-06-15", "Belgium", "Egypt", 1, 1],
  ["H", "2026-06-15", "Saudi Arabia", "Uruguay", 1, 1],
  ["G", "2026-06-15", "Iran", "New Zealand", 2, 2],
  ["I", "2026-06-16", "France", "Senegal", 3, 1],
  ["I", "2026-06-16", "Norway", "Iraq", 4, 1],
  ["J", "2026-06-16", "Argentina", "Algeria", 3, 0],
  ["J", "2026-06-17", "Austria", "Jordan", 3, 1],
  ["K", "2026-06-17", "Portugal", "DR Congo", 1, 1],
  ["L", "2026-06-17", "England", "Croatia", 4, 2],
  ["L", "2026-06-17", "Ghana", "Panama", 1, 0],
  ["K", "2026-06-17", "Colombia", "Uzbekistan", 3, 1],
  ["A", "2026-06-18", "Czechia", "South Africa", 1, 1],
  ["B", "2026-06-18", "Switzerland", "Bosnia and Herzegovina", 4, 1],
  ["B", "2026-06-18", "Canada", "Qatar", 6, 0],
  ["A", "2026-06-18", "Mexico", "South Korea", 1, 0],
  ["D", "2026-06-19", "United States", "Australia", 2, 0],
  ["C", "2026-06-19", "Morocco", "Scotland", 1, 0],
  ["C", "2026-06-19", "Brazil", "Haiti", 3, 0],
  ["D", "2026-06-19", "Paraguay", "Turkey", 1, 0],
  ["F", "2026-06-20", "Netherlands", "Sweden", 5, 1],
  ["E", "2026-06-20", "Germany", "Ivory Coast", 2, 1],
  ["E", "2026-06-20", "Ecuador", "Curaçao", 0, 0],
  ["F", "2026-06-21", "Tunisia", "Japan", null, null],
  ["H", "2026-06-21", "Spain", "Saudi Arabia", null, null],
  ["G", "2026-06-21", "Belgium", "Iran", null, null],
  ["H", "2026-06-21", "Uruguay", "Cape Verde", null, null],
  ["G", "2026-06-21", "New Zealand", "Egypt", null, null],
  ["J", "2026-06-22", "Argentina", "Austria", null, null],
  ["I", "2026-06-22", "France", "Iraq", null, null],
  ["I", "2026-06-22", "Norway", "Senegal", null, null],
  ["J", "2026-06-22", "Jordan", "Algeria", null, null],
  ["K", "2026-06-23", "Portugal", "Uzbekistan", null, null],
  ["L", "2026-06-23", "England", "Ghana", null, null],
  ["L", "2026-06-23", "Panama", "Croatia", null, null],
  ["K", "2026-06-23", "Colombia", "DR Congo", null, null],
  ["B", "2026-06-24", "Switzerland", "Canada", null, null],
  ["B", "2026-06-24", "Bosnia and Herzegovina", "Qatar", null, null],
  ["C", "2026-06-24", "Morocco", "Haiti", null, null],
  ["C", "2026-06-24", "Scotland", "Brazil", null, null],
  ["A", "2026-06-24", "South Africa", "South Korea", null, null],
  ["A", "2026-06-24", "Czechia", "Mexico", null, null],
  ["E", "2026-06-25", "Curaçao", "Ivory Coast", null, null],
  ["E", "2026-06-25", "Ecuador", "Germany", null, null],
  ["F", "2026-06-25", "Tunisia", "Netherlands", null, null],
  ["F", "2026-06-25", "Japan", "Sweden", null, null],
  ["D", "2026-06-25", "Turkey", "United States", null, null],
  ["D", "2026-06-25", "Paraguay", "Australia", null, null],
  ["I", "2026-06-26", "Norway", "France", null, null],
  ["I", "2026-06-26", "Senegal", "Iraq", null, null],
  ["H", "2026-06-26", "Cape Verde", "Saudi Arabia", null, null],
  ["H", "2026-06-26", "Uruguay", "Spain", null, null],
  ["G", "2026-06-26", "New Zealand", "Belgium", null, null],
  ["G", "2026-06-26", "Egypt", "Iran", null, null],
  ["L", "2026-06-27", "Panama", "England", null, null],
  ["L", "2026-06-27", "Croatia", "Ghana", null, null],
  ["K", "2026-06-27", "Colombia", "Portugal", null, null],
  ["K", "2026-06-27", "DR Congo", "Uzbekistan", null, null],
  ["J", "2026-06-27", "Algeria", "Austria", null, null],
  ["J", "2026-06-27", "Jordan", "Argentina", null, null]
];

const SCHEDULE_URL =
  "https://www.sbnation.com/soccer/1117513/world-cup-schedule-2026-how-to-watch-every-match-scores-and-more";
const ELO_FIXTURES_URL = "https://www.eloratings.net/fixtures.tsv";

let cache = null;
let cacheUpdatedAt = 0;

function normalizeSourceName(name) {
  return name
    .replace(/\s+/g, " ")
    .trim()
    .replace("Türkiye", "Turkey")
    .replace("Turkiye", "Turkey")
    .replace("Cabo Verde", "Cape Verde");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function parseResultRest(rest, names) {
  for (const home of names) {
    if (!rest.startsWith(`${home} `)) continue;
    const afterHome = rest.slice(home.length + 1);
    const scoreMatch = afterHome.match(/^(\d+),?\s+(.+)$/);
    if (!scoreMatch) continue;
    const homeGoals = Number(scoreMatch[1]);
    const awayPart = scoreMatch[2];
    for (const away of names) {
      const finalMatch = awayPart.match(new RegExp(`^${escapeRegExp(away)}\\s+(\\d+)$`));
      if (finalMatch) {
        return { home, away, homeGoals, awayGoals: Number(finalMatch[1]) };
      }
    }
  }
  return null;
}

function currentDateForLine(body, targetLine) {
  const lines = body.split(/\n/);
  let date = "";
  for (const raw of lines) {
    const line = raw.trim();
    const dateMatch = line.match(/^(Thursday|Friday|Saturday|Sunday|Monday|Tuesday|Wednesday), June (\d{1,2})$/);
    if (dateMatch) {
      date = `2026-06-${String(Number(dateMatch[2])).padStart(2, "0")}`;
    }
    if (line === targetLine.trim()) return date || "2026-06-21";
  }
  return "2026-06-21";
}

function mergeDatesIntoSchedule(parsedRows) {
  const byMatch = new Map(DEFAULT_SCHEDULE.map((row) => [`${row[0]}|${row[2]}|${row[3]}`, row]));
  for (const row of parsedRows) {
    byMatch.set(`${row[0]}|${row[2]}|${row[3]}`, row);
  }
  return [...byMatch.values()].sort((a, b) => a[1].localeCompare(b[1]) || a[0].localeCompare(b[0]));
}

function parseScheduleFromArticle(html) {
  const jsonMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if (!jsonMatch) throw new Error("Não encontrei o JSON-LD do calendário.");
  const data = JSON.parse(jsonMatch[1]);
  const body = data.articleBody || "";
  const names = Object.values(TEAMS).sort((a, b) => b.length - a.length);
  const rows = [];

  for (const rawLine of body.split(/\n/)) {
    const line = rawLine.trim();
    const groupMatch = line.match(/^Group ([A-L]): (.+)$/);
    if (!groupMatch) continue;
    const group = groupMatch[1];
    const rest = normalizeSourceName(groupMatch[2]);

    if (rest.includes(" vs. ")) {
      const [homeRaw, awayRaw] = rest.split(" vs. ");
      const home = normalizeSourceName(homeRaw);
      const away = normalizeSourceName(awayRaw.split(",")[0]);
      rows.push([group, currentDateForLine(body, line), home, away, null, null]);
      continue;
    }

    const parsed = parseResultRest(rest, names);
    if (parsed) {
      rows.push([group, currentDateForLine(body, line), parsed.home, parsed.away, parsed.homeGoals, parsed.awayGoals]);
    }
  }

  return mergeDatesIntoSchedule(rows);
}

function localName(name) {
  return LOCAL_NAMES[name] || name;
}

function pageName(text) {
  return text
    ? text
      .replace(/ /g, "_")
      .replace(/[àáâãäå]/g, "a")
      .replace(/ç/g, "c")
      .replace(/[èéêë]/g, "e")
      .replace(/[ìíîï]/g, "i")
      .replace(/[òóôõö]/g, "o")
      .replace(/[ùúûü]/g, "u")
      .replace(/[ñ]/g, "n")
    : "";
}

function codeForTeam(team) {
  return Object.entries(TEAMS).find(([, name]) => name === team)?.[0] || "";
}

function parseTeamResults(team, text, limit = 10) {
  const teamCode = codeForTeam(team);
  const rows = [];
  for (const line of String(text || "").trim().split(/\r?\n/)) {
    const fields = line.split("\t");
    if (fields.length < 8) continue;
    const [year, month, day, homeCode, awayCode, homeGoals, awayGoals, tournament] = fields;
    if (homeCode !== teamCode && awayCode !== teamCode) continue;
    const home = ALL_TEAMS[homeCode] || homeCode;
    const away = ALL_TEAMS[awayCode] || awayCode;
    const hg = Number(homeGoals);
    const ag = Number(awayGoals);
    const isHome = homeCode === teamCode;
    const teamGoals = isHome ? hg : ag;
    const opponentGoals = isHome ? ag : hg;
    const result = teamGoals > opponentGoals ? "V" : teamGoals < opponentGoals ? "D" : "E";
    rows.push({
      date: `${year}-${month}-${day}`,
      home,
      away,
      homeGoals: hg,
      awayGoals: ag,
      tournament,
      result
    });
  }
  return rows.slice(-limit).reverse();
}

function standingsFromSchedule(schedule) {
  const groupTeams = {};
  for (const row of schedule) {
    const [group, , home, away] = row;
    groupTeams[group] ||= new Set();
    groupTeams[group].add(home);
    groupTeams[group].add(away);
  }

  const standings = {};
  for (const teams of Object.values(groupTeams)) {
    for (const team of teams) {
      standings[team] ||= { gp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 };
    }
  }

  for (const row of schedule) {
    const [, , home, away, homeGoals, awayGoals] = row;
    if (homeGoals == null || awayGoals == null) continue;
    const h = standings[home];
    const a = standings[away];
    h.gp += 1;
    a.gp += 1;
    h.gf += homeGoals;
    h.ga += awayGoals;
    a.gf += awayGoals;
    a.ga += homeGoals;
    if (homeGoals > awayGoals) {
      h.w += 1;
      h.pts += 3;
      a.l += 1;
    } else if (homeGoals < awayGoals) {
      a.w += 1;
      a.pts += 3;
      h.l += 1;
    } else {
      h.d += 1;
      a.d += 1;
      h.pts += 1;
      a.pts += 1;
    }
  }

  return { groupTeams, standings };
}

function groupTable(schedule, group) {
  const { groupTeams, standings } = standingsFromSchedule(schedule);
  return [...(groupTeams[group] || [])]
    .map((team) => {
      const s = standings[team] || { gp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 };
      return { team, ...s, gd: s.gf - s.ga };
    })
    .sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf || a.team.localeCompare(b.team));
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function pct(value) {
  return `${(value * 100).toFixed(1)}%`;
}

function poisson(lambda, k) {
  let factorial = 1;
  for (let i = 2; i <= k; i += 1) factorial *= i;
  return Math.exp(-lambda) * Math.pow(lambda, k) / factorial;
}

function parseFixtures(fixturesTsv) {
  const ratings = new Map();
  const latest = {};
  const codeToTeam = TEAMS;
  for (const line of String(fixturesTsv || "").trim().split(/\r?\n/)) {
    const parts = line.split("\t");
    if (parts.length < 11 || parts[5] !== "WC") continue;
    const date = `${parts[0]}-${parts[1]}-${parts[2]}`;
    const home = codeToTeam[parts[3]];
    const away = codeToTeam[parts[4]];
    if (!home || !away) continue;
    const entry = {
      homeRating: Number(parts[9]),
      awayRating: Number(parts[10]),
      homeRank: Number(parts[7]),
      awayRank: Number(parts[8])
    };
    ratings.set(`${date}|${home}|${away}`, entry);
    latest[home] = entry.homeRating;
    latest[away] = entry.awayRating;
  }
  return { ratings, latest };
}

function ratingForMatch(match, fixtures) {
  const direct = fixtures.ratings.get(`${match.date}|${match.home}|${match.away}`);
  if (direct) return direct;
  const reverse = fixtures.ratings.get(`${match.date}|${match.away}|${match.home}`);
  if (reverse) {
    return {
      homeRating: reverse.awayRating,
      awayRating: reverse.homeRating,
      homeRank: reverse.awayRank,
      awayRank: reverse.homeRank
    };
  }
  return {
    homeRating: fixtures.latest[match.home] || 1700,
    awayRating: fixtures.latest[match.away] || 1700
  };
}

function teamProfile(team, standings) {
  const s = standings[team] || { gp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 };
  const gfpg = s.gp ? s.gf / s.gp : 1.2;
  const gapg = s.gp ? s.ga / s.gp : 1.2;
  return {
    ...s,
    attack: clamp(55 + gfpg * 13, 45, 95),
    defense: clamp(88 - gapg * 12, 45, 92),
    form: clamp((s.pts - s.gp * 1.2) * 2 + (s.gf - s.ga), -10, 10)
  };
}

function modelMatch(match, snapshot) {
  const { standings } = standingsFromSchedule(snapshot.schedule || DEFAULT_SCHEDULE);
  const fixtures = parseFixtures(snapshot.fixturesTsv || "");
  const rating = ratingForMatch(match, fixtures);
  const hp = teamProfile(match.home, standings);
  const ap = teamProfile(match.away, standings);
  const adjustedDiff = (rating.homeRating - rating.awayRating) + ((hp.form - ap.form) * 8);
  const ratingQuality = clamp(((rating.homeRating + rating.awayRating) / 2 - 1600) / 500, -0.25, 0.9);
  const pace = clamp(2.28 + ratingQuality * 0.16 + ((hp.attack + ap.attack - 135) / 135) - ((hp.defense + ap.defense - 145) / 165), 1.65, 3.85);
  const hxg = clamp((pace / 2) + (adjustedDiff / 430 * 0.42) + ((hp.attack - ap.defense) / 100 * 0.72), 0.2, 4.8);
  const axg = clamp((pace / 2) - (adjustedDiff / 430 * 0.42) + ((ap.attack - hp.defense) / 100 * 0.72), 0.2, 4.8);
  const rows = [];
  let total = 0;
  for (let h = 0; h <= 8; h += 1) {
    for (let a = 0; a <= 8; a += 1) {
      const probability = poisson(hxg, h) * poisson(axg, a);
      rows.push({ h, a, probability });
      total += probability;
    }
  }
  rows.forEach((row) => { row.probability /= total; });
  const summary = { homeWin: 0, draw: 0, awayWin: 0, over25: 0, under25: 0, bothScore: 0 };
  for (const row of rows) {
    if (row.h > row.a) summary.homeWin += row.probability;
    if (row.h === row.a) summary.draw += row.probability;
    if (row.h < row.a) summary.awayWin += row.probability;
    if (row.h + row.a > 2.5) summary.over25 += row.probability;
    else summary.under25 += row.probability;
    if (row.h > 0 && row.a > 0) summary.bothScore += row.probability;
  }
  const topScores = rows.slice().sort((a, b) => b.probability - a.probability).slice(0, 7);
  return { rating, hp, ap, hxg, axg, rows, summary, topScores, pace };
}

function normalizeMatch(row) {
  const [group, date, home, away, homeGoals, awayGoals] = row;
  return {
    group,
    date,
    home,
    away,
    homeGoals,
    awayGoals,
    status: homeGoals == null || awayGoals == null ? "future" : "done"
  };
}

function findTeamName(question) {
  const normalized = question.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  for (const [alias, team] of Object.entries(TEAM_ALIASES)) {
    const normalizedAlias = alias.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (normalized.includes(normalizedAlias)) return team;
  }
  return Object.values(TEAMS)
    .sort((a, b) => b.length - a.length)
    .find((team) => normalized.includes(team.toLowerCase()));
}

function matchFromQuestion(snapshot, question, context) {
  const schedule = snapshot.schedule || DEFAULT_SCHEDULE;
  const team = findTeamName(question);
  if (context?.match?.home && context?.match?.away) {
    const row = schedule.find((item) =>
      item[1] === context.match.date &&
      item[2] === context.match.home &&
      item[3] === context.match.away
    );
    if (row) return normalizeMatch(row);
    return normalizeMatch([context.match.group || "?", context.match.date || "", context.match.home, context.match.away, null, null]);
  }
  if (team) {
    const future = schedule.find((row) => (row[2] === team || row[3] === team) && (row[4] == null || row[5] == null));
    if (future) return normalizeMatch(future);
    const any = schedule.find((row) => row[2] === team || row[3] === team);
    if (any) return normalizeMatch(any);
  }
  return normalizeMatch(schedule.find((row) => row[2] === "Scotland" && row[3] === "Brazil") || schedule[0]);
}

function exactScoreAnswer(snapshot, question, context) {
  const q = question.toLowerCase();
  const scoreMatches = [...q.matchAll(/(\d+)\s*(?:x|-|a)\s*(\d+)/g)];
  const asksProbability = q.includes("probab") || q.includes("chance") || q.includes("possibilidade");
  if (!asksProbability || !scoreMatches.length) return null;

  const match = matchFromQuestion(snapshot, question, context);
  const calc = modelMatch(match, snapshot);
  const team = findTeamName(question) || match.home;
  const isHomeTarget = match.home === team;
  const isAwayTarget = match.away === team;
  const targetTeam = isHomeTarget || isAwayTarget ? team : match.home;
  const targetIsHome = match.home === targetTeam;

  let total = 0;
  const lines = scoreMatches.map((item) => {
    const targetGoals = Number(item[1]);
    const opponentGoals = Number(item[2]);
    const homeGoals = targetIsHome ? targetGoals : opponentGoals;
    const awayGoals = targetIsHome ? opponentGoals : targetGoals;
    const row = calc.rows.find((r) => r.h === homeGoals && r.a === awayGoals);
    const probability = row ? row.probability : 0;
    total += probability;
    return `${targetGoals}x${opponentGoals} para ${localName(targetTeam)}: ${pct(probability)}`;
  });

  const top = calc.topScores.slice(0, 5).map((row) => {
    const targetGoals = targetIsHome ? row.h : row.a;
    const opponentGoals = targetIsHome ? row.a : row.h;
    return `${targetGoals}x${opponentGoals} (${pct(row.probability)})`;
  });

  return `Cálculo para ${localName(targetTeam)} em ${localName(match.home)} x ${localName(match.away)} (${match.date}).\n\n` +
    `${lines.join("\n")}\n\n` +
    `Somadas, essas opções dão ${pct(total)}.\n` +
    `Base do cálculo: xG ${localName(match.home)} ${calc.hxg.toFixed(2)} e ${localName(match.away)} ${calc.axg.toFixed(2)}, com distribuição Poisson.\n` +
    `Placares mais prováveis para ${localName(targetTeam)}: ${top.join(", ")}.`;
}

function matchAnalysisAnswer(snapshot, question, context) {
  const q = question.toLowerCase();
  const asksMatch =
    q.includes("chance") ||
    q.includes("probab") ||
    q.includes("ganhar") ||
    q.includes("vence") ||
    q.includes("xg") ||
    q.includes("over") ||
    q.includes("mais de") ||
    q.includes("menos de") ||
    q.includes("ambos") ||
    q.includes("explique") ||
    q.includes("analise");
  if (!asksMatch) return null;

  const match = matchFromQuestion(snapshot, question, context);
  if (!match?.home || !match?.away) return null;
  const calc = modelMatch(match, snapshot);
  const qOver = q.includes("over") || q.includes("mais de 2") || q.includes("mais de 2.5");
  const qUnder = q.includes("under") || q.includes("menos de 2") || q.includes("menos de 2.5");
  const qBoth = q.includes("ambos") || q.includes("ambas") || q.includes("marcam");

  if (qOver || qUnder || qBoth) {
    return `${localName(match.home)} x ${localName(match.away)} (${match.date})\n` +
      `Mais de 2.5 gols: ${pct(calc.summary.over25)}\n` +
      `Menos de 2.5 gols: ${pct(calc.summary.under25)}\n` +
      `Ambos marcam: ${pct(calc.summary.bothScore)}\n` +
      `xG projetado: ${localName(match.home)} ${calc.hxg.toFixed(2)}, ${localName(match.away)} ${calc.axg.toFixed(2)}.`;
  }

  const top = calc.topScores.slice(0, 5).map((row) => `${row.h}-${row.a} (${pct(row.probability)})`).join(", ");
  return `${localName(match.home)} x ${localName(match.away)} (${match.date})\n` +
    `Vitória ${localName(match.home)}: ${pct(calc.summary.homeWin)}\n` +
    `Empate: ${pct(calc.summary.draw)}\n` +
    `Vitória ${localName(match.away)}: ${pct(calc.summary.awayWin)}\n` +
    `xG: ${localName(match.home)} ${calc.hxg.toFixed(2)}; ${localName(match.away)} ${calc.axg.toFixed(2)}\n` +
    `Placares mais prováveis: ${top}.\n` +
    `Leitura: ${localName(calc.summary.homeWin > calc.summary.awayWin ? match.home : match.away)} é o lado mais provável pelo modelo.`;
}

function applyProjectedResult(table, home, away, hg, ag) {
  table[home] ||= { gp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 };
  table[away] ||= { gp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 };
  const h = table[home];
  const a = table[away];
  h.gp += 1; a.gp += 1;
  h.gf += hg; h.ga += ag; a.gf += ag; a.ga += hg;
  if (hg > ag) { h.w += 1; h.pts += 3; a.l += 1; }
  else if (hg < ag) { a.w += 1; a.pts += 3; h.l += 1; }
  else { h.d += 1; a.d += 1; h.pts += 1; a.pts += 1; }
}

function sortProjectedRows(schedule, group, table) {
  const teams = new Set();
  for (const row of schedule) {
    if (row[0] !== group) continue;
    teams.add(row[2]);
    teams.add(row[3]);
  }
  return [...teams].map((team) => {
    const s = table[team] || { gp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 };
    return { team, ...s, gd: s.gf - s.ga };
  }).sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf || a.team.localeCompare(b.team));
}

function qualificationProbabilities(snapshot, group) {
  const schedule = snapshot.schedule || DEFAULT_SCHEDULE;
  const { standings } = standingsFromSchedule(schedule);
  const pending = schedule
    .filter((row) => row[0] === group && (row[4] == null || row[5] == null))
    .map(normalizeMatch);
  const teams = new Set();
  for (const row of schedule) {
    if (row[0] === group) {
      teams.add(row[2]);
      teams.add(row[3]);
    }
  }
  const totals = Object.fromEntries([...teams].map((team) => [team, { top2: 0, top3: 0, pts: 0 }]));

  if (!pending.length) {
    return groupTable(schedule, group).map((row, index) => ({
      ...row,
      top2: index < 2 ? 1 : 0,
      top3: index < 3 ? 1 : 0,
      projectedPts: row.pts
    }));
  }

  const options = new Map();
  for (const match of pending) {
    options.set(`${match.date}|${match.home}|${match.away}`, modelMatch(match, snapshot).topScores.slice(0, 7));
  }

  const runs = Math.min(600, Math.max(120, 120 + pending.length * 80));
  for (let run = 0; run < runs; run += 1) {
    const table = {};
    for (const [team, s] of Object.entries(standings)) table[team] = { ...s };
    for (const match of pending) {
      const pickList = options.get(`${match.date}|${match.home}|${match.away}`) || [{ h: 1, a: 1 }];
      const pick = pickList[run % pickList.length];
      applyProjectedResult(table, match.home, match.away, pick.h, pick.a);
    }
    const rows = sortProjectedRows(schedule, group, table);
    rows.forEach((row, index) => {
      totals[row.team].pts += row.pts;
      if (index < 2) totals[row.team].top2 += 1;
      if (index < 3) totals[row.team].top3 += 1;
    });
  }

  return sortProjectedRows(schedule, group, standings).map((row) => ({
    ...row,
    top2: totals[row.team].top2 / runs,
    top3: totals[row.team].top3 / runs,
    projectedPts: totals[row.team].pts / runs
  })).sort((a, b) => b.top2 - a.top2 || b.projectedPts - a.projectedPts);
}

function answerQuestion(snapshot, question, context = {}) {
  const scoreAnswer = exactScoreAnswer(snapshot, question, context);
  if (scoreAnswer) return scoreAnswer;

  const q = question.toLowerCase();
  const schedule = snapshot.schedule || DEFAULT_SCHEDULE;
  const groupMatch = q.match(/grupo\s+([a-l])/i);
  const team = findTeamName(question);
  const teamGroup = team
    ? schedule.find((row) => row[2] === team || row[3] === team)?.[0]
    : null;
  const group = groupMatch?.[1]?.toUpperCase() || teamGroup || "C";

  if (q.includes("assinatura") || q.includes("plano") || q.includes("preco") || q.includes("preço")) {
    return "Plano unico de assinatura:\nAcesso Premium: R$ 9,99/mes.\nO usuario informa o e-mail, gera um Pix automatico e, quando o pagamento for aprovado, recebe a chave premium por e-mail.\nTambem existe Pix manual como fallback: 15998376372.";
  }

  if (q.includes("classifica") || q.includes("classificação") || q.includes("classificacao") || q.includes("top 2") || q.includes("top 3")) {
    const rows = qualificationProbabilities(snapshot, group);
    return `Simulação do Grupo ${group}:\n` + rows.map((row, index) =>
      `${index + 1}. ${localName(row.team)}: top 2 ${pct(row.top2)}, top 3 ${pct(row.top3)}, pontos projetados ${row.projectedPts.toFixed(1)}`
    ).join("\n");
  }

  if (q.includes("zebra")) {
    const candidates = schedule
      .filter((row) => row[4] == null || row[5] == null)
      .map(normalizeMatch)
      .map((match) => {
        const calc = modelMatch(match, snapshot);
        const underdog = calc.summary.homeWin < calc.summary.awayWin ? match.home : match.away;
        const chance = Math.min(calc.summary.homeWin, calc.summary.awayWin);
        return { match, underdog, chance };
      })
      .sort((a, b) => b.chance - a.chance);
    const best = candidates[0];
    return `Maior zebra potencial: ${localName(best.underdog)} em ${localName(best.match.home)} x ${localName(best.match.away)}.\nChance estimada do azarão: ${pct(best.chance)}.\nA leitura usa o modelo Elo/Poisson e a forma do grupo.`;
  }

  const analysisAnswer = matchAnalysisAnswer(snapshot, question, context);
  if (analysisAnswer) return analysisAnswer;

  if (q.includes("lider") || q.includes("primeiro") || q.includes("tabela") || q.includes("ponto")) {
    const table = groupTable(schedule, group);
    const lines = table.map((row, index) => {
      const sign = row.gd > 0 ? "+" : "";
      return `${index + 1}. ${localName(row.team)}: ${row.pts} pts, ${row.gp} jogos, SG ${sign}${row.gd}, gols ${row.gf}-${row.ga}`;
    });
    return `Tabela do Grupo ${group}:\n${lines.join("\n")}`;
  }

  if (q.includes("resultado") || q.includes("placar") || q.includes("jogos")) {
    const rows = schedule.filter((row) => row[0] === group);
    const lines = rows.map((row) => {
      const [, date, home, away, hg, ag] = row;
      const score = hg == null || ag == null ? "a jogar" : `${hg}-${ag}`;
      return `${date}: ${localName(home)} ${score} ${localName(away)}`;
    });
    return `Jogos do Grupo ${group}:\n${lines.join("\n")}`;
  }

  if (team) {
    const rows = schedule.filter((row) => row[2] === team || row[3] === team);
    const table = groupTable(schedule, teamGroup || group);
    const standing = table.find((row) => row.team === team);
    const games = rows.map((row) => {
      const [, date, home, away, hg, ag] = row;
      const score = hg == null || ag == null ? "a jogar" : `${hg}-${ag}`;
      return `${date}: ${localName(home)} ${score} ${localName(away)}`;
    });
    return `${localName(team)} está no Grupo ${teamGroup || group}.\n` +
      (standing ? `Situação: ${standing.pts} pts, ${standing.gp} jogos, saldo ${standing.gd}, gols ${standing.gf}-${standing.ga}.\n` : "") +
      `Jogos:\n${games.join("\n")}`;
  }

  return "Posso responder sobre tabela, pontos, resultados e jogos por grupo. Exemplos: ?quem lidera o grupo C??, ?resultados do grupo C?, ?situação do Brasil? ou ?jogos da Escócia?.";
}

async function fetchText(url) {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error(`Falha ao baixar ${url}: ${response.status}`);
  return response.text();
}

async function buildSnapshot() {
  const [scheduleHtml, fixturesText] = await Promise.all([
    fetchText(SCHEDULE_URL),
    fetchText(ELO_FIXTURES_URL)
  ]);
  const schedule = parseScheduleFromArticle(scheduleHtml);
  if (schedule.length < 60) throw new Error("Calendário baixado parece incompleto.");
  if (!fixturesText.includes("\tWC\t")) throw new Error("Fixtures Elo baixadas parecem incompletas.");
  return {
    updatedAt: new Date().toISOString(),
    schedule,
    fixturesTsv: fixturesText.trim(),
    sources: {
      schedule: SCHEDULE_URL,
      fixtures: ELO_FIXTURES_URL
    }
  };
}

function requirePremiumConfig() {
  if (!MP_ACCESS_TOKEN) {
    throw new Error("Mercado Pago nao configurado. Defina MP_ACCESS_TOKEN no Render.");
  }
  if (!RESEND_API_KEY) {
    throw new Error("E-mail automatico nao configurado. Defina RESEND_API_KEY no Render.");
  }
}

async function createMercadoPagoPix(email) {
  requirePremiumConfig();
  const notificationUrl = PUBLIC_API_URL
    ? `${PUBLIC_API_URL.replace(/\/$/, "")}/api/premium/mercadopago/webhook`
    : undefined;
  const response = await fetch("https://api.mercadopago.com/v1/payments", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
      "X-Idempotency-Key": `premium-${email}-${Date.now()}`
    },
    body: JSON.stringify({
      transaction_amount: PREMIUM_PRICE,
      description: "Acesso Premium - Calculadora da Copa",
      payment_method_id: "pix",
      payer: { email },
      external_reference: `premium:${email}`,
      ...(notificationUrl ? { notification_url: notificationUrl } : {})
    })
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || data.error || "Falha ao criar Pix no Mercado Pago.");
  }
  return data;
}

async function fetchMercadoPagoPayment(paymentId) {
  if (!MP_ACCESS_TOKEN) throw new Error("Mercado Pago nao configurado.");
  const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: { Authorization: `Bearer ${MP_ACCESS_TOKEN}` }
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || data.error || "Falha ao consultar pagamento.");
  }
  return data;
}

async function sendPremiumEmail(email) {
  if (!RESEND_API_KEY) throw new Error("Resend nao configurado.");
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: EMAIL_FROM,
      to: [email],
      subject: "Sua chave premium - Calculadora da Copa",
      html: `
        <p>Pagamento aprovado.</p>
        <p>Sua chave premium e:</p>
        <h2>${PREMIUM_KEY}</h2>
        <p>Acesse ${PUBLIC_SITE_URL}, cole a chave no card Premium e clique em Liberar.</p>
      `
    })
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || data.error || "Falha ao enviar e-mail premium.");
  }
  return data;
}

app.get("/api/worldcup/2026/snapshot", async (req, res) => {
  const now = Date.now();
  if (cache && now - cacheUpdatedAt < CACHE_MS && req.query.refresh !== "1") {
    return res.json({ ...cache, cache: true });
  }

  try {
    cache = await buildSnapshot();
    cacheUpdatedAt = now;
    res.json({ ...cache, cache: false });
  } catch (error) {
    if (cache) {
      return res.json({ ...cache, cache: true, warning: error.message });
    }
    res.status(502).json({ error: error.message });
  }
});

app.post("/api/worldcup/2026/ask", async (req, res) => {
  const question = String(req.body?.question || "").trim();
  if (!question) {
    return res.status(400).json({ error: "Pergunta vazia." });
  }

  try {
    const now = Date.now();
    if (!cache || now - cacheUpdatedAt >= CACHE_MS) {
      cache = await buildSnapshot();
      cacheUpdatedAt = now;
    }
    res.json({
      answer: answerQuestion(cache, question, req.body?.context || {}),
      updatedAt: cache.updatedAt,
      mode: "local-api"
    });
  } catch (error) {
    const fallback = cache || { schedule: DEFAULT_SCHEDULE, updatedAt: new Date().toISOString() };
    res.json({
      answer: answerQuestion(fallback, question, req.body?.context || {}),
      warning: error.message,
      mode: "fallback"
    });
  }
});

app.post("/api/premium/create-pix", async (req, res) => {
  const email = String(req.body?.email || "").trim().toLowerCase();
  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: "E-mail invalido." });
  }

  try {
    const payment = await createMercadoPagoPix(email);
    const point = payment.point_of_interaction?.transaction_data || {};
    res.json({
      paymentId: payment.id,
      status: payment.status,
      copyPaste: point.qr_code || "",
      qrCodeBase64: point.qr_code_base64 || "",
      email
    });
  } catch (error) {
    res.status(501).json({ error: error.message });
  }
});

app.post("/api/premium/mercadopago/webhook", async (req, res) => {
  res.sendStatus(200);

  const paymentId = req.body?.data?.id || req.body?.id || req.query?.id;
  if (!paymentId) return;

  try {
    const payment = await fetchMercadoPagoPayment(paymentId);
    if (payment.status !== "approved") return;
    const email = payment.payer?.email || String(payment.external_reference || "").replace("premium:", "");
    if (!email || !email.includes("@")) return;
    await sendPremiumEmail(email);
  } catch (error) {
    console.error("premium webhook error", error.message);
  }
});

app.get("/api/worldcup/2026/team/:team/results", async (req, res) => {
  const rawTeam = decodeURIComponent(String(req.params.team || "")).trim();
  const team = Object.values(TEAMS).includes(rawTeam) ? rawTeam : findTeamName(rawTeam);
  const teamCode = codeForTeam(team);
  const limit = Math.max(1, Math.min(30, Number(req.query.limit || 10)));

  if (!team || !teamCode) {
    return res.status(404).json({ error: "Selecao nao encontrada." });
  }

  const url = `https://www.eloratings.net/${pageName(team)}.tsv`;

  try {
    const text = await fetchText(url);
    const results = parseTeamResults(team, text, limit);
    return res.json({
      team,
      localName: localName(team),
      updatedAt: new Date().toISOString(),
      source: url,
      results
    });
  } catch (error) {
    const base = cache?.schedule || DEFAULT_SCHEDULE;
    const results = base
      .filter((row) => (row[2] === team || row[3] === team) && row[4] != null && row[5] != null)
      .slice(-limit)
      .reverse()
      .map(([group, date, home, away, homeGoals, awayGoals]) => {
        const isHome = home === team;
        const teamGoals = isHome ? homeGoals : awayGoals;
        const opponentGoals = isHome ? awayGoals : homeGoals;
        return {
          date,
          home,
          away,
          homeGoals,
          awayGoals,
          tournament: `Copa 2026 - Grupo ${group}`,
          result: teamGoals > opponentGoals ? "V" : teamGoals < opponentGoals ? "D" : "E"
        };
      });

    return res.json({
      team,
      localName: localName(team),
      updatedAt: new Date().toISOString(),
      source: "fallback-calendario-local",
      warning: error.message,
      results
    });
  }
});

app.get("/health", (req, res) => {
  res.json({ ok: true, cache: Boolean(cache), updatedAt: cache?.updatedAt || null });
});

app.listen(PORT, () => {
  console.log(`API local rodando em http://localhost:${PORT}`);
  console.log(`Snapshot: http://localhost:${PORT}/api/worldcup/2026/snapshot`);
});


