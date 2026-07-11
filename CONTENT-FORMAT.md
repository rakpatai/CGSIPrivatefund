# คู่มือสร้างเนื้อหา The Journal — CGSI Private Fund

เป้าหมาย: ขอผลลัพธ์จาก Claude ในรูปแบบที่ "ก็อปวางแล้วใช้ได้เลย" ไม่ต้องแก้ดีไซน์
(โครงสร้างเดียวกับเว็บ Rakpatai — บทความ + วีดีโอ & พอดแคสต์)

## ขั้นตอนลงบทความ (3 ขั้น)

1. รันสคริปต์สร้างโครง:
   ```
   node new-post.mjs "ชื่อบทความ" english-slug "หมวด"
   ```
2. เปิด `articles/<slug>.html` → วาง **เนื้อหา body** ที่ Claude ให้ แทนจุด `[แก้ตรงนี้]`
3. เปิด `assets/js/articles.js` → แก้ `excerpt` และ `read` (เวลาอ่าน)

> บทความบนสุดใน `CGSI_ARTICLES` = featured ในหน้ารวม + ขึ้นหน้าแรกอัตโนมัติ

## ขั้นตอนลงวิดีโอ YouTube (2 ขั้น)

1. รัน:
   ```
   node new-video.mjs <youtube-url> [slug]
   ```
   (สคริปต์ดึงชื่อ + thumbnail และสร้างหน้าเดี่ยวให้เอง)
2. เปิด `assets/js/media.js` → แก้ `excerpt` + `duration` ของรายการบนสุด
   (แล้วอัปเดตคำอธิบายใน `media/<slug>.html` ให้ตรงกัน)

พอดแคสต์: ก็อป `media/_template.html` เป็น `media/<slug>.html` แล้วเพิ่มรายการใน
`media.js` เอง (`embedType: "spotify"`, `embedId: "episode/<id>"` หรือ `"show/<id>"`)

---

## Prompt สำเร็จรูป (ก็อปไปวางใน Claude)

> ช่วยเขียนบทความเรื่อง **[ใส่หัวข้อ]** สำหรับ The Journal ของ CGSI Private Fund
> (กองทุนส่วนบุคคล) — ภาษาไทยโทน editorial แบบ private bank สุภาพ แม่นยำ
> ผสมอังกฤษเฉพาะศัพท์การเงิน มีตัวเลข/แหล่งอ้างอิงประกอบ
>
> ส่งผลลัพธ์เป็น **2 บล็อก** ตามนี้ ห้ามมีอย่างอื่น:
>
> **บล็อก 1 — metadata (JS object):**
> ```
> {
>   slug: "english-kebab-case",
>   no: "04",                       // เลขต่อจากบทความล่าสุด
>   cat: "China Policy",           // หมวดอังกฤษสั้น ๆ
>   title: "พาดหัวภาษาไทย",
>   excerpt: "คำโปรย 1–2 ประโยค",
>   date: "กรกฎาคม 2026",
>   read: 6,
> }
> ```
>
> **บล็อก 2 — เนื้อหา body (HTML ล้วน):**
> - ใช้ได้เฉพาะบล็อกในรายการ "บล็อกที่รองรับ" ด้านล่าง
> - **ห้าม** `<html> <head> <style>` หรือ CSS ใด ๆ
> - **ห้าม** letter-spacing / italic กับข้อความไทย
> - ตัวเลขการเงินทุกตัวต้องมีแหล่งอ้างอิงในบรรทัด `article__source` ปิดท้าย

---

## บล็อกที่รองรับ (คลาสเดียวกับเว็บ Rakpatai เป๊ะ — ก็อปเนื้อหาข้ามสองเว็บได้)

### พื้นฐาน
```html
<h2>หัวข้อใหญ่</h2>
<h3>หัวข้อย่อย</h3>
<p>ย่อหน้า มี <strong>คำเน้น</strong> ได้</p>
<ul><li><strong>ข้อ</strong> — รายละเอียด (มีเพชรทองนำหน้าอัตโนมัติ)</li></ul>

<blockquote>
  ข้อความคำคม
  <cite>— ที่มา</cite>
</blockquote>

<div class="callout">
  <div class="callout-title">💡 ประเด็นสำคัญ</div>
  เนื้อหาในกล่องเน้น
</div>

<table>
  <thead><tr><th>คอลัมน์</th><th>ค่า</th></tr></thead>
  <tbody><tr><td>แถว</td><td>123</td></tr></tbody>
</table>

<figure>
  <img src="https://..." alt="คำอธิบาย" loading="lazy" />
  <figcaption>คำบรรยายภาพ</figcaption>
</figure>
```

### การ์ดตัวเลข (stat grid)
```html
<div class="stat-grid">
  <div class="stat-card">
    <div class="s-label">ป้ายเล็กบน</div>
    <div class="s-value">$38B</div>
    <div class="s-note">หมายเหตุเทา</div>
    <div class="s-sub">บรรทัดทอง</div>
  </div>
  <!-- ใส่ได้หลายการ์ด เรียงเป็น grid อัตโนมัติ -->
</div>
```

### กราฟแท่งสัดส่วน (bars)
```html
<div class="bars">
  <div class="bar-item">
    <div class="bar-label"><span class="l">ชื่อรายการ</span><span class="v">51%</span></div>
    <div class="bar-track"><div class="bar-fill" style="width:100%;"></div></div>
  </div>
  <!-- width% = ความยาวแท่งเทียบกับตัวที่ยาวสุด -->
</div>
```

### ไทม์ไลน์ / Catalyst
```html
<div class="catalysts">
  <div class="catalyst">
    <div class="c-date">2026 · ครึ่งปีแรก</div>
    <div>
      <h4>หัวข้อเหตุการณ์</h4>
      <p>รายละเอียด</p>
    </div>
  </div>
</div>
```

### หมายเหตุ/อ้างอิงปิดท้าย (บังคับ)
```html
<div class="article-note">
  <strong>อ้างอิง:</strong> [แหล่งข้อมูล + วันที่] — มิใช่คำแนะนำการลงทุน
</div>
```

---

## เช็กลิสต์ก่อนเผยแพร่
- [ ] `slug` ใน articles.js = ชื่อไฟล์ = `data-slug` บน `<body>` (ตรงกัน 3 ที่)
- [ ] `no` ไม่ซ้ำและต่อเนื่องจากเรื่องล่าสุด
- [ ] `excerpt` ใน articles.js ใกล้เคียงย่อหน้าเปิดของบทความ
- [ ] media: `duration` ตรงกับความยาวจริง / thumbnail เปิดได้
- [ ] เปิดดูในเบราว์เซอร์: การ์ดขึ้นหน้าแรก + หน้ารวม + แถบอ่านต่อครบ
- [ ] เนื้อหาการเงินผ่านการตรวจ Compliance ก่อนเผยแพร่จริง
