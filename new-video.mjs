/* ============================================================
   new-video.mjs — เพิ่มวิดีโอ YouTube ลงเว็บอัตโนมัติ
   ------------------------------------------------------------
   วิธีใช้:
     node new-video.mjs <youtube-url-หรือ-id> [slug]

   ตัวอย่าง:
     node new-video.mjs https://youtu.be/OWxfxXJlfAY
     node new-video.mjs https://youtu.be/OWxfxXJlfAY china-ai-ep2

   สคริปต์จะทำให้:
     1. ดึงชื่อวิดีโอจาก YouTube + เลือก thumbnail ที่ดีที่สุด
     2. สร้างหน้าเดี่ยว media/<slug>.html (ดีไซน์ HÉRITAGE)
     3. เพิ่มรายการบนสุดของ MEDIA ใน assets/js/media.js

   ขั้นต่อไปหลังรัน: แก้ excerpt + duration ใน media.js
   (ความยาววิดีโอดึงอัตโนมัติไม่ได้)

   พอดแคสต์/สื่ออื่น: ก็อป media/_template.html + เพิ่มรายการใน media.js เอง
   ============================================================ */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const [, , urlArg, slugArg] = process.argv;

if (!urlArg) {
  console.log("วิธีใช้:  node new-video.mjs <youtube-url-หรือ-id> [slug]");
  process.exit(1);
}

/* ---------- helpers ---------- */
const THAI_MONTHS = ["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."];
const thaiDate = (iso) => { const d = new Date(iso + "T00:00:00"); return `${d.getDate()} ${THAI_MONTHS[d.getMonth()]} ${d.getFullYear() + 543}`; };
const esc = (s) => String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
const escHtml = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function extractId(input) {
  const m = input.match(/(?:youtu\.be\/|[?&]v=|embed\/|shorts\/)([A-Za-z0-9_-]{11})/);
  if (m) return m[1];
  if (/^[A-Za-z0-9_-]{11}$/.test(input)) return input;
  return null;
}
async function fetchTitle(id) {
  try {
    const r = await fetch(`https://www.youtube.com/oembed?url=https://youtu.be/${id}&format=json`);
    if (!r.ok) return null;
    const j = await r.json();
    return j.title || null;
  } catch { return null; }
}
async function pickThumbnail(id) {
  for (const q of ["maxresdefault", "sddefault", "hqdefault"]) {
    const u = `https://img.youtube.com/vi/${id}/${q}.jpg`;
    try {
      const r = await fetch(u, { method: "GET" });
      if (r.ok) return u;
    } catch {}
  }
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

/* ---------- HÉRITAGE media-page template ---------- */
function page(m) {
  const meta = `${thaiDate(m.date)}${m.duration && m.duration !== "—" ? " · " + m.duration : ""}`;
  return `<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escHtml(m.title)} — CGSI Private Fund</title>
<meta name="description" content="${escHtml(m.excerpt)}">
<meta name="media-slug" content="${m.slug}">
<meta property="og:type" content="video.other">
<meta property="og:title" content="${escHtml(m.title)}">
<meta property="og:image" content="${m.cover}">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%231A2744'/%3E%3Crect x='11' y='11' width='10' height='10' transform='rotate(45 16 16)' fill='none' stroke='%23C9A84C' stroke-width='1.25'/%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Anuphan:wght@300;400;500;600&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400;1,500&family=Cormorant+SC:wght@400;500&family=Trirong:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../assets/css/main.css">
</head>
<body class="page-sub" data-slug="${m.slug}">

<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">
  <defs>
    <symbol id="crest" viewBox="0 0 80 80">
      <circle cx="40" cy="40" r="38" fill="none" stroke="currentColor" stroke-width="1"/>
      <circle cx="40" cy="40" r="32" fill="none" stroke="#BA9866" stroke-width="0.5"/>
      <text x="40" y="38.5" text-anchor="middle" font-family="'Cormorant SC',serif" font-size="13.5" font-weight="500" letter-spacing="2.6" fill="currentColor">CGSI</text>
      <g stroke="#BA9866" stroke-width="0.75" fill="none" stroke-linecap="round">
        <path d="M28 50 q6 3 10 2"/>
        <path d="M30 49.2 q0.5 -2.6 -1.6 -3.8 M32.5 50.4 q0.8 -2.5 -1 -4 M35.2 51.1 q1 -2.3 -0.6 -4 M37.9 51.4 q1.2 -2.1 -0.2 -3.9"/>
        <path d="M52 50 q-6 3 -10 2"/>
        <path d="M50 49.2 q-0.5 -2.6 1.6 -3.8 M47.5 50.4 q-0.8 -2.5 1 -4 M44.8 51.1 q-1 -2.3 0.6 -4 M42.1 51.4 q-1.2 -2.1 0.2 -3.9"/>
      </g>
      <rect x="37.2" y="55.2" width="5.6" height="5.6" transform="rotate(45 40 58)" fill="none" stroke="#BA9866" stroke-width="0.6"/>
    </symbol>
  </defs>
</svg>

<div class="page-edge" aria-hidden="true"><div class="page-edge__thumb" id="pageEdgeThumb"></div></div>

<a class="skip-link" href="#top">ข้ามไปยังเนื้อหา</a>

<header class="nav" id="siteNav">
  <a class="nav__crest" href="../index.html" aria-label="CGSI Private Fund — กลับหน้าแรก">
    <svg width="30" height="30" aria-hidden="true"><use href="#crest"/></svg>
  </a>
  <nav class="nav__links" aria-label="เมนูหลัก">
    <a href="../index.html#philosophy">Philosophy</a>
    <a href="../index.html#mandates">Mandates</a>
    <a href="../index.html#process">Process</a>
    <a href="../index.html#performance">Performance</a>
    <a href="../insights.html">Insights</a>
    <a href="../media.html" class="is-current" aria-current="page">Media</a>
    <a href="../index.html#contact">Contact</a>
  </nav>
  <div class="nav__right">
    <a class="nav__member" href="../exclusive/index.html">🔒 Exclusive</a>
    <span class="nav__lang" title="English version — in preparation" aria-hidden="true"><b>TH</b><i></i><span>EN</span></span>
    <button class="nav__burger" id="navBurger" aria-label="เปิดเมนู" aria-expanded="false" aria-controls="mobileMenu">
      <span></span><span></span>
    </button>
  </div>
</header>

<div class="mobile-menu" id="mobileMenu" hidden>
  <nav aria-label="เมนูหลัก (มือถือ)">
    <a href="../index.html">หน้าแรก · Home</a>
    <a href="../insights.html">บทความ · Insights</a>
    <a href="../media.html">วีดีโอ &amp; พอดแคสต์ · Media</a>
    <a href="../exclusive/index.html">🔒 Exclusive · สำหรับลูกค้า</a>
    <a href="../index.html#mandates">กลยุทธ์ · Mandates</a>
    <a href="../index.html#performance">ผลการดำเนินงาน · Performance</a>
    <a href="../index.html#contact">ติดต่อ · Contact</a>
  </nav>
</div>

<main id="top" tabindex="-1">

<article class="article article--page">
  <header class="article__head reveal">
    <a class="article__back" href="../media.html"><span aria-hidden="true">←</span> Watch &amp; Listen</a>
    <p class="article__cat">Video Session</p>
    <h1 class="article__title">${escHtml(m.title)}</h1>
    <p class="article__meta">${meta}</p>
  </header>
  <figure class="plate media-plate reveal">
    <svg class="plate__bracket" viewBox="0 0 24 24" aria-hidden="true"><path d="M24 1H1V24" fill="none"/></svg>
    <button class="media-thumb" data-embed-type="youtube" data-embed-id="${m.embedId}"
      style="background-image:url('${m.cover}')" aria-label="เล่นวิดีโอ">
      <span class="media-play" aria-hidden="true">▶</span>
    </button>
    <figcaption><span class="th">กดเพื่อรับชม — player โหลดเมื่อกดเท่านั้น</span></figcaption>
  </figure>
  <div class="article__body reveal">
    <p>${escHtml(m.excerpt)}</p>
  </div>
  <p class="article__source reveal">เนื้อหาจัดทำเพื่อการให้ข้อมูลทั่วไป — มิใช่คำแนะนำการลงทุน ผู้ลงทุนควรศึกษาข้อมูลก่อนตัดสินใจ</p>
</article>

<section class="more-articles band band--warm">
  <header class="section__head reveal">
    <p class="eyebrow">Continue Watching</p>
    <div class="ornament-rule" aria-hidden="true"><i></i></div>
    <h2 class="more-articles__title">วีดีโอ &amp; พอดแคสต์อื่น ๆ</h2>
  </header>
  <div class="insights-grid" id="moreMedia"></div>
</section>

<section class="finale finale--slim">
  <div class="finale__inner">
    <svg class="finale__crest" width="52" height="52" aria-hidden="true"><use href="#crest"/></svg>
    <div class="finale__journal-cta reveal">
      <p class="finale__journal-lede">สนใจพูดคุยเชิงลึกกับทีมผู้จัดการกองทุน — การสนทนาเบื้องต้นไม่มีค่าใช้จ่าย และเป็นความลับทุกกรณี</p>
      <a class="btn-cert btn-cert--inv" href="../index.html#contact">นัดหมายสนทนาเป็นการส่วนตัว</a>
      <p class="finale__journal-contact">02-761-9144 · PF.TH@CGSI.com · LINE @cgsithpf</p>
    </div>
    <div class="disclaimer">
      <p class="disclaimer__head"><span class="th">คำเตือน</span> · <span lang="en">Important Notice</span></p>
      <p class="disclaimer__single">เนื้อหาวิดีโอและพอดแคสต์ทั้งหมดจัดทำเพื่อการให้ข้อมูลทั่วไปเท่านั้น มิใช่คำแนะนำ การเสนอขาย หรือการชี้ชวนให้ลงทุนในหลักทรัพย์ใด ๆ การลงทุนมีความเสี่ยง ผู้ลงทุนควรทำความเข้าใจลักษณะสินค้า เงื่อนไขผลตอบแทน และความเสี่ยงก่อนตัดสินใจลงทุน มุมมองเป็นความเห็น ณ เวลาที่เผยแพร่และอาจเปลี่ยนแปลงได้ — เว็บไซต์นี้เป็นชิ้นงานออกแบบเพื่อการนำเสนอ (Design Prototype) และต้องผ่านการตรวจสอบด้าน Compliance ก่อนการเผยแพร่จริง</p>
    </div>
    <footer class="footer">
      <div class="footer__shimmer shimmer-line" aria-hidden="true"></div>
      <div class="footer__row">
        <span>© 2026 CGSI Private Fund <em>(Design prototype)</em></span>
        <span class="footer__est">Watch &amp; Listen</span>
        <span>Bangkok · <span class="th">กรุงเทพมหานคร</span></span>
      </div>
    </footer>
  </div>
</section>

</main>

<div class="fn-tip" id="fnTip" role="tooltip" hidden></div>

<script src="../assets/js/articles.js"></script>
<script src="../assets/js/media.js"></script>
<script src="../assets/js/journal.js"></script>
<script src="../assets/js/main.js"></script>
</body>
</html>
`;
}

/* ---------- main ---------- */
const id = extractId(urlArg);
if (!id) { console.error("อ่าน YouTube ID ไม่ได้จาก: " + urlArg); process.exit(1); }

const slug = slugArg || "video-" + id.toLowerCase();
const filePath = join(__dirname, "media", `${slug}.html`);
if (existsSync(filePath)) { console.error(`มีไฟล์ media/${slug}.html อยู่แล้ว — เลือก slug อื่น`); process.exit(1); }

const date = new Date().toISOString().slice(0, 10);
console.log("กำลังดึงข้อมูลจาก YouTube...");
const title = (await fetchTitle(id)) || "วิดีโอใหม่ (แก้ชื่อใน media.js และในไฟล์หน้าเดี่ยว)";
const cover = await pickThumbnail(id);
const excerpt = "ใส่คำโปรยของวิดีโอตรงนี้ (แก้ได้ใน media.js และในไฟล์หน้าเดี่ยว)";

/* 1) หน้าเดี่ยว */
writeFileSync(filePath, page({ slug, title, excerpt, date, duration: "—", cover, embedId: id }), "utf8");

/* 2) เพิ่มใน media.js (บนสุด) */
const mediaPath = join(__dirname, "assets", "js", "media.js");
let mediaSrc = readFileSync(mediaPath, "utf8");
if (!mediaSrc.includes("const MEDIA = [")) { console.error("ไม่พบ 'const MEDIA = [' ใน media.js"); process.exit(1); }
const entry = `const MEDIA = [
  {
    type: "video",
    slug: "${slug}",
    title: "${esc(title)}",
    excerpt:
      "${esc(excerpt)}",
    date: "${date}",
    duration: "—",
    cover: "${cover}",
    embedType: "youtube",
    embedId: "${id}",
  },`;
writeFileSync(mediaPath, mediaSrc.replace("const MEDIA = [", entry), "utf8");

console.log(`
เพิ่มวิดีโอเรียบร้อย ✓

  ชื่อ      : ${title}
  ไฟล์      : media/${slug}.html
  thumbnail : ${cover}
  อัปเดต    : assets/js/media.js

ขั้นต่อไป: เปิด assets/js/media.js แก้ excerpt และ duration ของรายการบนสุด
(แล้วแก้คำอธิบายในไฟล์ media/${slug}.html ให้ตรงกันด้วย)
`);
