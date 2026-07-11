/* ============================================================
   new-post.mjs — สร้างโครงบทความใหม่ใน The Journal
   ------------------------------------------------------------
   วิธีใช้:
     node new-post.mjs "ชื่อบทความ" <english-slug> [หมวด]

   ตัวอย่าง:
     node new-post.mjs "Super Stock — สูตรหุ้นสามประเภทของเรา" super-stock "Investment Framework"

   สคริปต์จะทำให้:
     1. ก็อป articles/_template.html → articles/<slug>.html
        พร้อมเติมชื่อเรื่อง หมวด เลขลำดับ (No.) และ data-slug ให้
     2. เพิ่มรายการบนสุดของ CGSI_ARTICLES ใน assets/js/articles.js

   ขั้นต่อไปหลังรัน:
     - เปิด articles/<slug>.html วางเนื้อหาแทนจุด [แก้ตรงนี้]
     - เปิด assets/js/articles.js แก้ excerpt / read (เวลาอ่าน)
   ============================================================ */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const [, , titleArg, slugArg, catArg = "Insight"] = process.argv;

if (!titleArg || !slugArg) {
  console.log('วิธีใช้:  node new-post.mjs "ชื่อบทความ" <english-slug> [หมวด]');
  process.exit(1);
}
if (!/^[a-z0-9-]+$/.test(slugArg)) {
  console.error("slug ต้องเป็น a-z, 0-9 และขีดกลางเท่านั้น เช่น super-stock");
  process.exit(1);
}

const filePath = join(__dirname, "articles", `${slugArg}.html`);
if (existsSync(filePath)) { console.error(`มีไฟล์ articles/${slugArg}.html อยู่แล้ว — เลือก slug อื่น`); process.exit(1); }

/* เลขลำดับถัดไป = เลขสูงสุดใน articles.js + 1 */
const articlesPath = join(__dirname, "assets", "js", "articles.js");
let articlesSrc = readFileSync(articlesPath, "utf8");
if (!articlesSrc.includes("window.CGSI_ARTICLES = [")) {
  console.error("ไม่พบ 'window.CGSI_ARTICLES = [' ใน articles.js");
  process.exit(1);
}
const nos = [...articlesSrc.matchAll(/no:\s*"(\d+)"/g)].map((m) => parseInt(m[1], 10));
const nextNo = String((nos.length ? Math.max(...nos) : 0) + 1).padStart(2, "0");

const THAI_MONTHS_FULL = ["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"];
const now = new Date();
const dateTh = `${THAI_MONTHS_FULL[now.getMonth()]} ${now.getFullYear()}`;
const esc = (s) => String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
const escHtml = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* 1) หน้าเดี่ยวจาก template (รูปแบบ rakpatai: navy hero + cover + blocks) */
let tpl = readFileSync(join(__dirname, "articles", "_template.html"), "utf8");
tpl = tpl
  .replaceAll('data-slug="template-slug"', `data-slug="${slugArg}"`)
  .replace('content="template-slug"', `content="${slugArg}"`)
  .replace("[แก้ตรงนี้: ชื่อบทความ] — The Journal", `${escHtml(titleArg)} — The Journal`)
  .replace('<meta property="og:title" content="[แก้ตรงนี้: ชื่อบทความ]">', `<meta property="og:title" content="${escHtml(titleArg)}">`)
  .replace('<span class="post-tag">Category</span>', `<span class="post-tag">${escHtml(catArg)}</span>`)
  .replace('<span class="date">เดือน 2026</span>', `<span class="date">${dateTh}</span>`)
  .replace('<h1>พาดหัวบทความภาษาไทย</h1>', `<h1>${escHtml(titleArg)}</h1>`);
writeFileSync(filePath, tpl, "utf8");

/* 2) เพิ่มรายการบนสุดของ articles.js */
const entry = `window.CGSI_ARTICLES = [
  {
    slug: "${slugArg}",
    no: "${nextNo}",
    cat: "${esc(catArg)}",
    title: "${esc(titleArg)}",
    excerpt: "ใส่คำโปรย 1–2 ประโยคตรงนี้",
    date: "${dateTh}",
    read: 5,
    cover: "ใส่ลิงก์รูป cover ตรงนี้ (Unsplash หรือ assets/img/)",
  },`;
writeFileSync(articlesPath, articlesSrc.replace("window.CGSI_ARTICLES = [", entry), "utf8");

console.log(`
สร้างโครงบทความเรียบร้อย ✓

  ชื่อ    : ${titleArg}
  ไฟล์    : articles/${slugArg}.html   (No. ${nextNo} · ${catArg})
  อัปเดต  : assets/js/articles.js

ขั้นต่อไป:
  1. เปิด articles/${slugArg}.html วางเนื้อหา + lede + รูป cover แทนจุด [แก้ตรงนี้]
  2. เปิด assets/js/articles.js แก้ excerpt, read (เวลาอ่าน) และ cover (ลิงก์รูป)
`);
