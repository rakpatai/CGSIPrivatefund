# CGSI Private Fund — Website

เว็บไซต์สำหรับ CGSI Private Fund (กองทุนส่วนบุคคล) สไตล์ **"HÉRITAGE"** —
prospectus พิมพ์ส่วนตัวจาก Geneva maison: กระดาษ cream, หมึก navy, ทองแบบ gilt เฉพาะจุด

> **หมายเหตุ:** เป็น design prototype — เนื้อหาอ้างอิงเอกสารนำเสนอ
> "Smart Equity Tactical Asset Allocation" (2026) ต้องผ่าน Compliance ก่อนเผยแพร่จริง
> (เงินลงทุนขั้นต่ำยังเป็น placeholder — ระบบ footnote ¹–⁶ ระบุที่มาของทุกตัวเลขในหน้าเว็บ)

## โครงสร้าง

```
index.html            — หน้าแรก (12 sections, ไทย/อังกฤษ)
insights.html         — "The Journal" หน้ารวมบทความ (render อัตโนมัติจาก articles.js)
media.html            — "Watch & Listen" หน้ารวมวีดีโอ & พอดแคสต์ (filter + ค้นหา)
articles/             — บทความไฟล์ละเรื่อง (+ _template.html สำหรับก็อป)
media/                — หน้าวิดีโอ/พอดแคสต์ไฟล์ละเรื่อง แบบ click-to-play (+ _template.html)
assets/css/main.css   — design system ทั้งหมด (tokens, typography, motion, responsive)
exclusive/            — 🔒 เนื้อหาเฉพาะลูกค้า: index.html (hub), dashboard.html,
                        จดหมายถึงลูกค้า และวิดีโอ member (ทุกหน้ามี gate + noindex)
assets/js/articles.js — ★ สารบัญบทความ (tier: "member" = เฉพาะลูกค้า)
assets/js/media.js    — ★ สารบัญวีดีโอ & พอดแคสต์ (tier: "member" = เฉพาะลูกค้า)
assets/js/journal.js  — ตัว render การ์ด (หน้าแรก/หน้ารวม/แถบอ่านต่อ/filter/player/exclusive hub)
assets/js/gate.js     — ประตูใส่รหัสของโซน exclusive (เดโมเท่านั้น — อ่านหัวข้อ Exclusive)
assets/js/main.js     — rosette, bar chart + tooltip, count-ups, reveals, footnotes
new-post.mjs          — ★ สคริปต์สร้างโครงบทความใหม่
new-video.mjs         — ★ สคริปต์เพิ่มวิดีโอ YouTube (ดึงชื่อ+thumbnail อัตโนมัติ)
CONTENT-FORMAT.md     — คู่มือขอเนื้อหาจาก Claude แบบก็อปวางได้เลย
.claude/launch.json   — dev server (python http.server, port 8137)
```

โครงสร้างระบบ content ถอดแบบจากเว็บ Rakpatai (`C:\Claude Project\website personal branding`)
— ไม่มี build step: เปิด `index.html` ตรง ๆ หรือรัน `python -m http.server 8137`

## ★ วิธีเพิ่มบทความใหม่

```
node new-post.mjs "ชื่อบทความ" english-slug "หมวด"
```
แล้วเปิด `articles/<slug>.html` วางเนื้อหา + lede + รูป cover แทนจุด `[แก้ตรงนี้]` +
แก้ `excerpt`/`read`/`cover` ใน `assets/js/articles.js` — จบ
(หรือทำมือ: ก็อป `articles/_template.html` + เพิ่ม entry บนสุดใน articles.js)

**หน้าบทความเป็น format เดียวกับเว็บ Rakpatai เป๊ะ**: navy hero (หมวด • วันที่ • เวลาอ่าน
+ author), รูป cover, และบล็อกเนื้อหาคลาสเดียวกันทั้งหมด — `callout`, `stat-grid`,
`bars`, `catalysts`, `blockquote+cite`, `table`, `figure img`, `article-note` —
เนื้อหาที่เขียนให้เว็บ Rakpatai จึงก็อปมาลงเว็บนี้ได้ทันที (และกลับกัน)
ท้ายบทความมีปุ่มแชร์ (Facebook / X / คัดลอกลิงก์) + prev/next อัตโนมัติ

## ★ วิธีเพิ่มวิดีโอ / พอดแคสต์

```
node new-video.mjs <youtube-url> [slug]
```
สคริปต์ดึงชื่อ + thumbnail จาก YouTube สร้างหน้าเดี่ยว และเพิ่มรายการใน `media.js` ให้เอง
— เหลือแค่แก้ `excerpt` + `duration` ของรายการบนสุด
พอดแคสต์ (Spotify): ก็อป `media/_template.html` + เพิ่ม entry ใน media.js
(`embedType: "spotify"`, `embedId: "episode/<id>"`)

ทุกอย่างอัปเดตอัตโนมัติ 3 จุด: **หน้าแรก** (3 รายการล่าสุด), **หน้ารวม**, **แถบอ่าน/ชมต่อ**
— player โหลดเมื่อผู้ใช้กดเล่นเท่านั้น (click-to-play) · ดูรายละเอียดใน `CONTENT-FORMAT.md`

## 🔒 โซน Exclusive (เนื้อหาเฉพาะลูกค้า)

- โครงถอดจากเว็บ Rakpatai: `exclusive/index.html` เป็น hub รวม **Dashboard พอร์ต /
  จดหมาย-บทความลูกค้า / วิดีโอ member** — การ์ดของรายการที่มี `tier: "member"`
  ใน articles.js / media.js จะติดป้าย 🔒 และขึ้นใน hub อัตโนมัติ
- **รหัสปัจจุบัน: `CGSI2026`** — เก็บใน gate.js เป็น SHA-256 (ไม่มี plaintext ใน repo)
  ปลดล็อกแล้วเครื่องลูกค้าจำไว้จนกว่ารหัสจะถูกเปลี่ยน
- **เปลี่ยนรหัสทุก 3 เดือน**: `node new-passcode.mjs "รหัสใหม่"` → commit + push →
  แจ้งลูกค้า — เครื่องที่จำรหัสเก่าจะถูกถามรหัสใหม่เองอัตโนมัติ
- วิธีเพิ่มเนื้อหา member: ใส่ `tier: "member"` ใน entry + วางไฟล์หน้าเดี่ยวใน `exclusive/`
  (ก็อปหน้า member ที่มีอยู่เป็น template แล้วอย่าลืม `<script src="../assets/js/gate.js">` ใน head)
- **ระดับการป้องกัน (นโยบายปัจจุบัน)**: กันฝั่ง client — เพียงพอสำหรับเนื้อหาระดับ
  **model portfolio / จดหมายรวม** ที่ไม่มีข้อมูลลูกค้ารายคน (คนทั่วไปผ่านไม่ได้
  แต่ผู้ชำนาญเปิด source จาก repo ได้) — หากอนาคตจะเก็บข้อมูลจริงรายคน
  ค่อยยกระดับเป็นการกันที่ hosting (Cloudflare Access / Netlify edge) + repo private

## Design tokens (แก้สีที่เดียวใน `:root` ของ main.css)

| Token | ค่า | ใช้กับ |
|---|---|---|
| `--paper` | `#F7F4EE` | พื้นหลักของหน้า |
| `--ink` | `#1A2744` | ตัวหนังสือทั้งหมด + navy band ท้ายหน้า |
| `--gold` / `--gold-bright` / `--gold-deep` | `#BA9866` / `#C9A84C` / `#78603B` | เส้น hairline, เพชร, ตัวเลขโรมัน, label |
| สี chart | `#9C7A2E` (แท่ง/เส้นหลัก) / `#7A8299` (รอง) | ผ่าน dataviz validator (CVD + WCAG) แล้ว |

Fonts (Google Fonts): **Cormorant Garamond** + **Cormorant SC** (Latin display/small caps),
**Trirong** (Thai display — ห้ามใช้กับ body), **Anuphan** (Thai body ทั้งหมด)

กฎเหล็กของ design (จาก build brief):
- ห้ามใช้ทองเป็นตัวหนังสือยาวหรือพื้นที่ใหญ่ — ทองคือ hairline/เพชร/ตัวเลข เท่านั้น
- ห้าม letterspace/uppercase ข้อความไทย, ห้าม italic กับ font ไทย
  (ถ้าข้อความไทยหลุดเข้า context แบบ small caps ให้ครอบ `<span class="th">`)
- navy section มีได้ **แห่งเดียว** ต่อหน้า คือ finale (contact + disclaimer)
- เงาสูงสุด `0 1px 2px rgba(26,39,68,.06)`, radius สูงสุด 2px (ยกเว้นวงกลม crest/medallion)

## การแก้เนื้อหาหลัก

- **ผลการดำเนินงานรายปี**: array `ANNUAL` ใน main.js (ปี + ผลตอบแทน + ดัชนี 100) —
  ถ้าเปลี่ยน อย่าลืมอัปเดต stat row + ตารางใน index.html ให้ตรงกัน
- **ค่าธรรมเนียม/เงื่อนไข**: section `#begin` และ flagship card ใน `#mandates` (index.html)
- **เงินลงทุนขั้นต่ำ** ยังเป็น placeholder: ค้นหา `30,000,000` ใน index.html
- **Footnotes**: ข้อความ tooltip อยู่ใน `FOOTNOTES` (main.js) และฉบับเต็มใน `#fn-1..6` (index.html)

## การถ่าย screenshot อัตโนมัติ (ใช้ตอน iterate design)

Browser pane screenshot ใช้ไม่ได้บนเครื่องนี้ (timeout) — ใช้ puppeteer-core + system Chrome แทน
(สคริปต์ตัวอย่างอยู่ใน scratchpad ของ session: `shoot.js`, `shoot-journal.js`, `interact.js`)
