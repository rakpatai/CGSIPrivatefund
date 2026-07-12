/* ============================================================
   new-passcode.mjs — เปลี่ยนรหัสโซน Exclusive (ทุก 3 เดือน)
   ------------------------------------------------------------
   วิธีใช้:
     node new-passcode.mjs "รหัสใหม่"

   สคริปต์จะทำให้:
     1. คำนวณ SHA-256 ของรหัสใหม่ แล้วอัปเดต HASH ใน assets/js/gate.js
     2. เครื่องลูกค้าที่จำรหัสเก่าไว้ จะถูกถามรหัสใหม่อัตโนมัติ
        (localStorage เก็บ hash เก่าซึ่งไม่ตรงกับ HASH ใหม่แล้ว)

   ขั้นต่อไปหลังรัน:
     - commit + push ขึ้น GitHub
     - แจ้งรหัสใหม่ให้ลูกค้าผ่าน LINE OA หรือจดหมายรายไตรมาส
   ============================================================ */

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createHash } from "node:crypto";

const __dirname = dirname(fileURLToPath(import.meta.url));
const [, , passArg] = process.argv;

if (!passArg || passArg.trim().length < 6) {
  console.log('วิธีใช้:  node new-passcode.mjs "รหัสใหม่"   (อย่างน้อย 6 ตัวอักษร)');
  process.exit(1);
}

const pass = passArg.trim();
const hash = createHash("sha256").update(pass).digest("hex");

const gatePath = join(__dirname, "assets", "js", "gate.js");
let src = readFileSync(gatePath, "utf8");
const m = src.match(/var HASH = "([0-9a-f]{64})";/);
if (!m) {
  console.error('ไม่พบบรรทัด var HASH = "..." ใน assets/js/gate.js');
  process.exit(1);
}
if (m[1] === hash) {
  console.log("รหัสใหม่เหมือนรหัสเดิม — ไม่มีอะไรต้องเปลี่ยน");
  process.exit(0);
}
src = src.replace(m[0], `var HASH = "${hash}";`);
writeFileSync(gatePath, src, "utf8");

console.log(`
เปลี่ยนรหัสโซน Exclusive เรียบร้อย ✓

  รหัสใหม่ : ${pass}   ← จดไว้ก่อนปิดหน้าต่างนี้ (ไฟล์เก็บเฉพาะ hash)
  ไฟล์     : assets/js/gate.js

ขั้นต่อไป:
  1. git add -A && git commit -m "เปลี่ยนรหัส Exclusive ประจำไตรมาส" && git push
  2. แจ้งรหัสใหม่ให้ลูกค้า (LINE @cgsithpf / จดหมายรายไตรมาส)
  เครื่องที่จำรหัสเก่าไว้จะถูกถามรหัสใหม่เองอัตโนมัติ
`);
