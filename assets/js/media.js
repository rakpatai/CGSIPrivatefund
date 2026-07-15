/* ============================================================
   media.js — ข้อมูลวีดีโอ & พอดแคสต์ (The Journal · Watch & Listen)
   ------------------------------------------------------------
   เพิ่มรายการใหม่:
   · วิดีโอ YouTube:  node new-video.mjs <youtube-url> [slug]
     (สคริปต์สร้างหน้าเดี่ยว + เพิ่มรายการบนสุดให้อัตโนมัติ)
   · พอดแคสต์/อื่น ๆ: เพิ่ม object บนสุดของ MEDIA เอง (บนสุด = ล่าสุด)
     แล้วก็อป media/_template.html เป็นหน้าเดี่ยว

   ฟิลด์:
     type      "video" | "podcast"
     embedType / embedId  ใช้สร้าง player ตอนกดเล่น
       - video:   embedType "youtube", embedId = รหัส YouTube
       - podcast: embedType "spotify", embedId = "episode/<id>" หรือ "show/<id>"
     duration  ความยาว (แสดงบนการ์ด) เช่น "7:27"
     cover     รูป thumbnail (YouTube ใช้ img.youtube.com/vi/<id>/maxresdefault.jpg)
     tier      "member" = เฉพาะลูกค้า → หน้าเดี่ยวอยู่ใน exclusive/
               (การ์ดติดป้าย 🔒 และขึ้นในหน้า exclusive/index.html อัตโนมัติ)
   ============================================================ */

const MEDIA = [
  {
    type: "video",
    slug: "physical-ai-next-wave",
    title: "\"Physical AI โอกาสการลงทุนนคลื่นลูกถัดไปของ AI\" พี่เปี๊ยก แมงเม่าสำราญ  กับ น้องออย CGSI EP160",
    excerpt:
      "รีแคป AI ถัดจาก infra สู่คลื่นใหม่ Physical AI — humanoid, robotics, drone และ autonomous vehicle พร้อมไล่ value chain 7 layer และ Tier หุ้นจีนกลุ่ม precision component ที่น่าจับตา",
    date: "2026-07-15",
    duration: "1:04:50",
    cover: "https://img.youtube.com/vi/sPu3E_M6SwA/sddefault.jpg",
    embedType: "youtube",
    embedId: "sPu3E_M6SwA",
  },


  {
    type: "video",
    slug: "etf-passive-distortion",
    title: "ETF Thematic เมื่อเงิน Passive ดันราคาหุ้นให้เพี้ยน",
    excerpt:
      "เมื่อเงินไหลเข้ากองทุน Passive และ Thematic ETF มหาศาล แรงซื้อแบบไม่สนพื้นฐานกำลังบิดราคาหุ้นให้เพี้ยนจากมูลค่าที่แท้จริง — นักลงทุนควรอ่านสัญญาณนี้อย่างไร",
    date: "2026-06-18",
    duration: "4:41",
    cover: "https://img.youtube.com/vi/2AZjwpwXtTo/maxresdefault.jpg",
    embedType: "youtube",
    embedId: "2AZjwpwXtTo",
  },
  {
    type: "video",
    slug: "special-update-2026-06",
    title: "Special Update (June 2026)",
    excerpt:
      "อัปเดตพิเศษประจำเดือนสำหรับลูกค้ากองทุนส่วนบุคคล — มุมมองตลาดและการปรับพอร์ตล่าสุด เฉพาะลูกค้าเท่านั้น",
    date: "2026-06-14",
    duration: "—",
    tier: "member",
    cover: "https://img.youtube.com/vi/KUxU6lIXOB0/maxresdefault.jpg",
    embedType: "youtube",
    embedId: "KUxU6lIXOB0",
  },  {
    type: "video",
    slug: "humanoid-wars",
    title: "Humanoid Wars: สงครามหุ่นยนต์สองขั้วโลก",
    excerpt:
      "สงครามหุ่นยนต์ฮิวแมนนอยด์ระหว่างสหรัฐฯ กับจีน — ใครนำ ใครตาม และโอกาสลงทุนในเมกะเทรนด์ที่กำลังจะเปลี่ยนโลก",
    date: "2026-06-14",
    duration: "8:48",
    cover: "https://img.youtube.com/vi/sw8dGSoV1Ng/maxresdefault.jpg",
    embedType: "youtube",
    embedId: "sw8dGSoV1Ng",
  },
  {
    type: "video",
    slug: "china-ai-infra-ep153",
    title: "เจาะลึกหุ้นจีน AI Infra เมื่อโลก AI แบ่งเป็นสองขั้ว",
    excerpt:
      "ทีมผู้จัดการกองทุน CGSI ร่วมรายการ EP153 — เจาะธีมหุ้นจีน AI Infrastructure ในวันที่โลก AI แบ่งเป็นสองขั้ว",
    date: "2026-06-14",
    duration: "—",
    cover: "https://img.youtube.com/vi/OWxfxXJlfAY/hqdefault.jpg",
    embedType: "youtube",
    embedId: "OWxfxXJlfAY",
  },
  {
    type: "video",
    slug: "battery-ev-to-ai-datacenter",
    title: "อนาคตแบตเตอรี่ จาก EV สู่ AI Data Center",
    excerpt:
      "ทิศทางของอุตสาหกรรมแบตเตอรี่ จากยุครถ EV สู่ความต้องการพลังงานมหาศาลของ AI Data Center และโอกาสการลงทุนที่ตามมา",
    date: "2026-06-14",
    duration: "1:39",
    cover: "https://img.youtube.com/vi/oSM6LbquE3w/maxresdefault.jpg",
    embedType: "youtube",
    embedId: "oSM6LbquE3w",
  },
  {
    type: "video",
    slug: "ai-power-battery",
    title: "เมื่อ AI หิวไฟ คนขายแบตเตอรี่คือผู้ถือกุญแจ",
    excerpt:
      "เจาะธีมที่ตลาดมองข้าม — เมื่อ AI ต้องใช้พลังงานมหาศาล ผู้เล่นในห่วงโซ่พลังงานและแบตเตอรี่อาจเป็นคนเก็บกำไรตัวจริง",
    date: "2026-06-14",
    duration: "7:27",
    cover: "https://img.youtube.com/vi/SIYeJipoPWs/maxresdefault.jpg",
    embedType: "youtube",
    embedId: "SIYeJipoPWs",
  },
  {
    type: "video",
    slug: "session-portfolio-construction",
    title: "Session: จัดพอร์ตจริงตั้งแต่ศูนย์",
    excerpt:
      "เวิร์กช็อปจัดพอร์ตแบบ step-by-step ตั้งแต่กำหนดเป้าหมาย เลือกสัดส่วน จนถึงการ Rebalance — เฉพาะลูกค้ากองทุนส่วนบุคคล",
    date: "2026-06-05",
    duration: "55:22",
    tier: "member",
    cover:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80",
    embedType: "youtube",
    embedId: "aqz-KE-bpKQ", // ⚠️ ตัวอย่าง embed — เปลี่ยนเป็นวิดีโอจริงก่อนใช้
  },  {
    type: "podcast",
    slug: "podcast-luxury-economics",
    title: "เศรษฐศาสตร์ของความหรูหรา — ทำไมของแพงยิ่งมีคนซื้อ",
    excerpt:
      "เจาะ Veblen Goods และ Pricing Power ของแบรนด์หรู — บทเรียนเบื้องหลังธีมการลงทุน Premium & Luxury Brands ของพอร์ตเรา",
    date: "2026-06-02",
    duration: "27:15",
    cover:
      "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1200&q=80",
    embedType: "spotify",
    embedId: "show/4FYpq3lSeQMejBtjVTwTNV",
  },
];
