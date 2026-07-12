/* ============================================================
   gate.js — ประตูเนื้อหา Exclusive (DEMO เท่านั้น)
   ------------------------------------------------------------
   ⚠️ นี่คือการกันแบบฝั่ง client เพื่อเดโม UX — เนื้อหายังอยู่ใน
   repository และ view-source ได้ การป้องกันจริงต้องทำที่ระดับ
   hosting เช่น Cloudflare Access / Netlify Identity ครอบโฟลเดอร์
   /exclusive/ (แบบเดียวกับเว็บ rakpatai) ก่อนใช้งานจริง

   รหัสเดโม: ดูใน README.md (เก็บเป็น SHA-256 ไม่ใช่ plaintext)
   ปลดล็อกแล้วจำไว้ใน sessionStorage — ปิดแท็บ = ล็อกใหม่
   ============================================================ */
(function () {
  "use strict";
  var HASH = "a6f27c38b0aaf5a758ffb2d5360067076ed590aa731aedd27caefdf13851c913";
  var KEY = "cgsi-exclusive-ok";
  if (sessionStorage.getItem(KEY) === "1") return;

  document.documentElement.classList.add("is-gated");

  function buildOverlay() {
    var ov = document.createElement("div");
    ov.className = "gate";
    ov.id = "gateOverlay";
    ov.innerHTML =
      '<div class="gate__card">' +
      '<svg class="gate__crest" width="56" height="56" aria-hidden="true"><use href="#crest"/></svg>' +
      '<p class="gate__eyebrow">Exclusive · Clients Only</p>' +
      '<h1 class="gate__title">เนื้อหาสำหรับลูกค้ากองทุนส่วนบุคคล</h1>' +
      '<p class="gate__lede">กรุณากรอกรหัสที่ได้รับจากผู้ดูแลความสัมพันธ์ของท่าน</p>' +
      '<form class="gate__form" id="gateForm">' +
      '<input type="password" id="gateCode" autocomplete="off" placeholder="รหัสสำหรับลูกค้า" aria-label="รหัสสำหรับลูกค้า">' +
      '<button type="submit" class="gate__submit">เข้าสู่เนื้อหา</button>' +
      '</form>' +
      '<p class="gate__err" id="gateErr" hidden>รหัสไม่ถูกต้อง — โปรดลองอีกครั้ง หรือติดต่อ 02-761-9144</p>' +
      '<p class="gate__micro">ยังไม่เป็นลูกค้า? <a href="../index.html#contact">นัดหมายสนทนากับเรา</a></p>' +
      '<p class="gate__demo">หน้านี้เป็นการกันแบบเดโม — ระบบจริงจะป้องกันที่ระดับเซิร์ฟเวอร์</p>' +
      "</div>";
    document.body.appendChild(ov);

    var form = document.getElementById("gateForm");
    var input = document.getElementById("gateCode");
    var err = document.getElementById("gateErr");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var val = input.value.trim();
      if (!val) return;
      if (!(window.crypto && crypto.subtle)) {
        err.textContent = "เบราว์เซอร์นี้ไม่รองรับการตรวจรหัส — เปิดผ่าน https หรือ localhost";
        err.hidden = false;
        return;
      }
      crypto.subtle.digest("SHA-256", new TextEncoder().encode(val)).then(function (buf) {
        var hex = Array.from(new Uint8Array(buf)).map(function (b) {
          return b.toString(16).padStart(2, "0");
        }).join("");
        if (hex === HASH) {
          sessionStorage.setItem(KEY, "1");
          document.documentElement.classList.remove("is-gated");
          ov.remove();
        } else {
          err.hidden = false;
          input.value = "";
          input.focus();
        }
      });
    });
    setTimeout(function () { input.focus(); }, 100);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildOverlay);
  } else {
    buildOverlay();
  }
})();
