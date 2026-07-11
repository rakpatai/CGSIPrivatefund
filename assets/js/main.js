/* CGSI Private Fund — "HÉRITAGE" interactions
   The site is still; only light moves. */
(function () {
  "use strict";
  const doc = document;
  const root = doc.documentElement;
  root.classList.add("js");
  const rmQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let reduceMotion = rmQuery.matches;
  if (rmQuery.addEventListener) rmQuery.addEventListener("change", (e) => { reduceMotion = e.matches; });
  const SVG_NS = "http://www.w3.org/2000/svg";

  /* ── Annual performance — Smart Equity Tactical Asset Allocation
        Source: CGSI Private Fund presentation, data as of Apr 2026.
        nav = growth of 100, compounded from the annual returns. ──── */
  const ANNUAL = [
    { year: "2020", note: "ก.ย.–ธ.ค.", ret: 1.03, nav: 101.0 },
    { year: "2021", note: "", ret: 42.92, nav: 144.4 },
    { year: "2022", note: "", ret: -13.82, nav: 124.4 },
    { year: "2023", note: "", ret: -14.96, nav: 105.8 },
    { year: "2024", note: "", ret: 57.68, nav: 166.9 },
    { year: "2025", note: "", ret: 56.04, nav: 260.4 },
    { year: "2026", note: "ถึง เม.ย.", ret: -9.48, nav: 235.7 },
  ];

  const FOOTNOTES = {
    1: "เส้นทางราคาเป็นภาพเชิงแนวคิด (Conceptual Illustration) เพื่อการออกแบบเท่านั้น มิได้อ้างอิงข้อมูลราคาจริง",
    2: "ปี 2020 นับจากจัดตั้งกลยุทธ์ในเดือนกันยายน 2020 และปี 2026 นับตั้งแต่ต้นปีถึงเดือนเมษายน 2026 (YTD)",
    3: "ตัวอย่างงานวิจัยเพื่อประกอบการอธิบายกระบวนการ มิใช่คำแนะนำการลงทุน และมิได้ยืนยันสถานะในพอร์ตใด ๆ",
    4: "ผลการดำเนินงานรายปีอ้างอิงเอกสารนำเสนอของ CGSI Private Fund (ณ เม.ย. 2026) — ผลการดำเนินงานในอดีตมิได้ยืนยันถึงอนาคต ตัวเลขสะสมและ CAGR คำนวณจากผลตอบแทนรายปี",
    5: "เงินลงทุนขั้นต่ำเป็นตัวเลขตัวอย่าง โปรดสอบถามเงื่อนไขปัจจุบัน — ค่าธรรมเนียมอ้างอิงเอกสารนำเสนอ ยังไม่รวม VAT 7%",
    6: "ข้อมูลเครือ China Galaxy Securities และประสบการณ์ทีมงาน อ้างอิงเอกสารนำเสนอของ CGSI Private Fund (2026)",
  };

  /* ── Hero entrance ───────────────────────────────────────────── */
  window.addEventListener("load", () => {
    requestAnimationFrame(() => root.classList.add("is-loaded"));
  });
  // Fallback if load already fired or hangs on slow fonts
  setTimeout(() => root.classList.add("is-loaded"), 1200);

  /* ── Guilloché rosette ───────────────────────────────────────── */
  (function buildRosette() {
    const host = doc.getElementById("rosette");
    if (!host) return;
    const svg = doc.createElementNS(SVG_NS, "svg");
    svg.setAttribute("viewBox", "-700 -700 1400 1400");
    svg.setAttribute("aria-hidden", "true");
    const ring = (count, rx, ry, opacity) => {
      const g = doc.createElementNS(SVG_NS, "g");
      g.setAttribute("fill", "none");
      g.setAttribute("stroke", "#1A2744");
      g.setAttribute("stroke-width", "0.5");
      g.setAttribute("opacity", String(opacity));
      const step = 180 / count;
      for (let i = 0; i < count; i++) {
        const e = doc.createElementNS(SVG_NS, "ellipse");
        e.setAttribute("rx", String(rx));
        e.setAttribute("ry", String(ry));
        e.setAttribute("transform", `rotate(${(i * step).toFixed(2)})`);
        g.appendChild(e);
      }
      return g;
    };
    svg.appendChild(ring(40, 620, 240, 0.05));
    svg.appendChild(ring(18, 300, 120, 0.04));
    host.appendChild(svg);
  })();

  /* ── Scroll: page edge progress + nav chrome ─────────────────── */
  const thumb = doc.getElementById("pageEdgeThumb");
  const nav = doc.getElementById("siteNav");
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const max = doc.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      if (thumb) thumb.style.transform = `scaleX(${p})`;
      if (nav) nav.classList.toggle("is-scrolled", window.scrollY > 80);
      ticking = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ── Mobile menu ─────────────────────────────────────────────── */
  const burger = doc.getElementById("navBurger");
  const menu = doc.getElementById("mobileMenu");
  if (burger && menu) {
    menu.hidden = false; // visibility handled by CSS visibility/opacity
    menu.querySelectorAll("a").forEach((a, i) => a.style.setProperty("--d", String(i)));
    const setOpen = (open) => {
      burger.classList.toggle("is-open", open);
      menu.classList.toggle("is-open", open);
      burger.setAttribute("aria-expanded", String(open));
      burger.setAttribute("aria-label", open ? "ปิดเมนู" : "เปิดเมนู");
      doc.body.style.overflow = open ? "hidden" : "";
    };
    burger.addEventListener("click", () => setOpen(!menu.classList.contains("is-open")));
    menu.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });
    doc.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });
    // Crossing back to desktop must release the overlay + scroll lock
    const wide = window.matchMedia("(min-width: 901px)");
    if (wide.addEventListener) wide.addEventListener("change", (e) => { if (e.matches) setOpen(false); });
  }

  /* ── Reveal on scroll (once) ─────────────────────────────────── */
  const revealables = doc.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("is-inview");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.18, rootMargin: "0px 0px -10%" });
    revealables.forEach((el) => io.observe(el));
  } else {
    revealables.forEach((el) => el.classList.add("is-inview"));
  }

  /* ── Folio rail ──────────────────────────────────────────────── */
  const folioCurrent = doc.getElementById("folioCurrent");
  const folioSections = doc.querySelectorAll("[data-folio]");
  if (folioCurrent && "IntersectionObserver" in window) {
    let folioTimer = null;
    const fio = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          clearTimeout(folioTimer);
          folioCurrent.style.opacity = "0";
          folioTimer = setTimeout(() => {
            folioCurrent.textContent = en.target.dataset.folio;
            folioCurrent.style.opacity = "1";
          }, 200);
        }
      });
    }, { threshold: 0.4 });
    folioSections.forEach((s) => fio.observe(s));
  }

  /* ── Sparklines (research plates) ────────────────────────────── */
  doc.querySelectorAll(".plate__spark").forEach((svg) => {
    const raw = svg.dataset.spark;
    if (!raw) return;
    // Data comes in 0–100 × 0–46 units; scale into the uniform 600×190 viewBox
    // (uniform coords keep strokes, dash patterns and hatch even — no stretching).
    const SX = 5.6, SY = 3.6, OX = 12, OY = 12;
    const pts = raw.trim().split(" ").map((p) => {
      const [px, py] = p.split(",").map(Number);
      return [OX + px * SX, OY + py * SY];
    });
    const BASE = 190;
    // Catmull-Rom → cubic bezier for an engraved, unhurried curve
    const d = smoothPath(pts);
    // crosshatch underfill
    const area = doc.createElementNS(SVG_NS, "path");
    const last = pts[pts.length - 1], first = pts[0];
    area.setAttribute("d", `${d} L ${last[0]} ${BASE} L ${first[0]} ${BASE} Z`);
    area.setAttribute("fill", "url(#crosshatch)");
    area.setAttribute("stroke", "none");
    area.setAttribute("opacity", "0.3");
    svg.appendChild(area);
    // main line
    const path = doc.createElementNS(SVG_NS, "path");
    path.setAttribute("d", d);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "#1A2744");
    path.setAttribute("stroke-width", "1.5");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");
    svg.appendChild(path);
    // dotted projection tail past "today"
    const proj = doc.createElementNS(SVG_NS, "path");
    const dx = last[0] - pts[pts.length - 4][0], dy = last[1] - pts[pts.length - 4][1];
    proj.setAttribute("d", `M ${last[0]} ${last[1]} l ${dx * 0.9} ${dy * 0.7}`);
    proj.setAttribute("fill", "none");
    proj.setAttribute("stroke", "#7A8299");
    proj.setAttribute("stroke-width", "1.25");
    proj.setAttribute("stroke-dasharray", "3 7");
    svg.appendChild(proj);
    // terminal gold dot
    const dot = doc.createElementNS(SVG_NS, "circle");
    dot.setAttribute("cx", String(last[0]));
    dot.setAttribute("cy", String(last[1]));
    dot.setAttribute("r", "3");
    dot.setAttribute("fill", "#C9A84C");
    dot.setAttribute("stroke", "#FCFAF6");
    dot.setAttribute("stroke-width", "2");
    svg.appendChild(dot);
    // draw-in on view
    if (!reduceMotion && "IntersectionObserver" in window) {
      const len = path.getTotalLength();
      path.style.strokeDasharray = String(len);
      path.style.strokeDashoffset = String(len);
      area.style.opacity = "0";
      dot.style.opacity = "0";
      proj.style.opacity = "0";
      const io = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          path.style.transition = "stroke-dashoffset 1.1s cubic-bezier(0.22,1,0.36,1)";
          path.style.strokeDashoffset = "0";
          setTimeout(() => {
            area.style.transition = "opacity 0.6s"; area.style.opacity = "0.3";
            proj.style.transition = "opacity 0.4s"; proj.style.opacity = "1";
            dot.style.transition = "opacity 0.3s"; dot.style.opacity = "1";
          }, 1000);
          io.unobserve(en.target);
        });
      }, { threshold: 0.4 });
      io.observe(svg);
    }
  });

  function smoothPath(pts) {
    if (pts.length < 3) return "M " + pts.map((p) => p.join(" ")).join(" L ");
    let d = `M ${pts[0][0]} ${pts[0][1]}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
      const c1x = p1[0] + (p2[0] - p0[0]) / 6, c1y = p1[1] + (p2[1] - p0[1]) / 6;
      const c2x = p2[0] - (p3[0] - p1[0]) / 6, c2y = p2[1] - (p3[1] - p1[1]) / 6;
      d += ` C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${p2[0]} ${p2[1]}`;
    }
    return d;
  }

  /* ── Performance chart: annual-return columns ────────────────── */
  (function buildChart() {
    const host = doc.getElementById("perfChart");
    if (!host) return;
    const W = 1000, H = 400;
    const M = { top: 34, right: 36, bottom: 58, left: 64 };
    const plotW = W - M.left - M.right, plotH = H - M.top - M.bottom;
    const yMin = -25, yMax = 70;
    const y = (v) => M.top + (1 - (v - yMin) / (yMax - yMin)) * plotH;
    const band = plotW / ANNUAL.length;
    const cx = (i) => M.left + band * (i + 0.5);
    const BAR_W = 24, R = 4;
    const y0 = y(0);

    const svg = doc.createElementNS(SVG_NS, "svg");
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    svg.setAttribute("aria-hidden", "true");

    const el = (name, attrs, parent) => {
      const n = doc.createElementNS(SVG_NS, name);
      for (const k in attrs) n.setAttribute(k, attrs[k]);
      (parent || svg).appendChild(n);
      return n;
    };

    // Gridlines + y labels (zero line carries more ink — it is the datum)
    [-20, 0, 20, 40, 60].forEach((v) => {
      el("line", { x1: M.left, y1: y(v), x2: M.left + plotW, y2: y(v), class: v === 0 ? "grid-zero" : "grid-line" });
      const t = el("text", { x: M.left - 12, y: y(v) + 4, "text-anchor": "end", class: "axis-text" });
      t.textContent = (v > 0 ? "+" : "") + v + "%";
    });

    // Bars: one series, one colour; the sign is carried by direction from zero
    const fmt = (v) => (v > 0 ? "+" : "−") + Math.abs(v).toFixed(1) + "%";
    const barGroups = [];
    ANNUAL.forEach((d, i) => {
      const x = cx(i), yv = y(d.ret);
      const up = d.ret >= 0;
      const g = el("g", { class: "bar-group" });
      const dPath = up
        ? `M ${x - BAR_W / 2} ${y0} L ${x - BAR_W / 2} ${yv + R} Q ${x - BAR_W / 2} ${yv} ${x - BAR_W / 2 + R} ${yv} L ${x + BAR_W / 2 - R} ${yv} Q ${x + BAR_W / 2} ${yv} ${x + BAR_W / 2} ${yv + R} L ${x + BAR_W / 2} ${y0} Z`
        : `M ${x - BAR_W / 2} ${y0} L ${x - BAR_W / 2} ${yv - R} Q ${x - BAR_W / 2} ${yv} ${x - BAR_W / 2 + R} ${yv} L ${x + BAR_W / 2 - R} ${yv} Q ${x + BAR_W / 2} ${yv} ${x + BAR_W / 2} ${yv - R} L ${x + BAR_W / 2} ${y0} Z`;
      el("path", { d: dPath, class: "bar" }, g);
      svg.appendChild(g);
      barGroups.push(g);
      // value label at the data end
      const lt = el("text", { x: x, y: up ? yv - 10 : yv + 20, "text-anchor": "middle", class: "bar-label" });
      lt.textContent = fmt(d.ret);
      g.appendChild(lt);
      // x labels: year + period note
      const xt = el("text", { x: x, y: H - 32, "text-anchor": "middle", class: "axis-text axis-year" });
      xt.textContent = d.year;
      if (d.note) {
        const nt = el("text", { x: x, y: H - 14, "text-anchor": "middle", class: "axis-text axis-note" });
        nt.textContent = "(" + d.note + ")";
      }
    });

    host.appendChild(svg);

    /* Hover / tap / keyboard readout */
    const tip = doc.getElementById("chartTip");
    const live = doc.getElementById("chartLive");
    const label = (d) => "ปี " + d.year + (d.note ? " (" + d.note + ")" : "");

    let ki = ANNUAL.length - 1;
    function showAt(i) {
      const d = ANNUAL[i];
      barGroups.forEach((g, gi) => g.classList.toggle("is-hover", gi === i));
      if (live) live.textContent = `${label(d)} — ผลตอบแทน ${fmt(d.ret)}, เงินลงทุน 100 บาทเติบโตเป็น ${d.nav.toFixed(1)}`;
      if (!tip) return;
      tip.hidden = false;
      tip.textContent = "";
      const when = doc.createElement("span");
      when.className = "chart-tip__when";
      when.textContent = label(d);
      tip.appendChild(when);
      [[fmt(d.ret), "ผลตอบแทน (NAV)", "#9C7A2E"], [d.nav.toFixed(1), "เงิน 100 บาทเติบโตเป็น", "#7A8299"]].forEach(([val, name, color]) => {
        const row = doc.createElement("div");
        row.className = "chart-tip__row";
        const key = doc.createElement("i");
        key.style.borderTop = `2px solid ${color}`;
        const b = doc.createElement("b");
        b.textContent = val;
        const s = doc.createElement("span");
        s.textContent = name;
        row.append(key, b, s);
        tip.appendChild(row);
      });
      // position within the plate, near the hovered bar
      const plate = doc.getElementById("perfPlate");
      const pr = plate.getBoundingClientRect();
      const hr = host.getBoundingClientRect();
      const relX = hr.left - pr.left + (cx(i) / W) * hr.width;
      const tw = tip.offsetWidth;
      let left = relX + 20;
      if (left + tw > pr.width - 24) left = relX - tw - 20;
      tip.style.left = left + "px";
      tip.style.top = (hr.top - pr.top + 24) + "px";
    }
    function hide() {
      barGroups.forEach((g) => g.classList.remove("is-hover"));
      if (tip) tip.hidden = true;
    }

    const hit = el("rect", { x: M.left, y: M.top, width: plotW, height: plotH + 40, fill: "transparent" });
    hit.style.touchAction = "pan-y";
    const pointAt = (e) => {
      const r = hit.getBoundingClientRect();
      const frac = (e.clientX - r.left) / r.width;
      const i = Math.min(ANNUAL.length - 1, Math.max(0, Math.floor(frac * ANNUAL.length)));
      ki = i;
      showAt(i);
    };
    hit.addEventListener("pointermove", pointAt);
    hit.addEventListener("pointerdown", pointAt);
    hit.addEventListener("pointerleave", hide);
    hit.addEventListener("pointercancel", hide);

    host.tabIndex = 0;
    host.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") { ki = Math.max(0, ki - 1); showAt(ki); e.preventDefault(); }
      if (e.key === "ArrowRight") { ki = Math.min(ANNUAL.length - 1, ki + 1); showAt(ki); e.preventDefault(); }
      if (e.key === "Escape") hide();
    });
    host.addEventListener("blur", hide);

    // Draw-in: columns rise from the zero line, oldest first
    if (!reduceMotion && "IntersectionObserver" in window) {
      barGroups.forEach((g, i) => {
        g.style.transformOrigin = `${cx(i)}px ${y0}px`;
        g.style.transform = "scaleY(0.001)";
        const lbl = g.querySelector(".bar-label");
        if (lbl) lbl.style.opacity = "0";
      });
      const io = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          barGroups.forEach((g, i) => {
            g.style.transition = `transform 0.9s cubic-bezier(0.22,1,0.36,1) ${i * 110}ms`;
            g.style.transform = "scaleY(1)";
            const lbl = g.querySelector(".bar-label");
            if (lbl) {
              lbl.style.transition = `opacity 0.5s ease ${600 + i * 110}ms`;
              lbl.style.opacity = "1";
            }
          });
          io.unobserve(en.target);
        });
      }, { threshold: 0.35 });
      io.observe(host);
    }
  })();

  /* ── Count-up numerals ───────────────────────────────────────── */
  (function countUps() {
    const nodes = doc.querySelectorAll("[data-count]");
    if (!nodes.length) return;
    const ease = (t) => 1 - Math.pow(1 - t, 4);
    const run = (node) => {
      const target = parseFloat(node.dataset.count);
      const dec = parseInt(node.dataset.dec || "0", 10);
      const t0 = performance.now();
      const dur = 1100;
      const tick = (now) => {
        const p = Math.min(1, (now - t0) / dur);
        node.textContent = (target * ease(p)).toFixed(dec);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    if (reduceMotion || !("IntersectionObserver" in window)) {
      nodes.forEach((n) => { n.textContent = parseFloat(n.dataset.count).toFixed(parseInt(n.dataset.dec || "0", 10)); });
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { run(en.target); io.unobserve(en.target); }
      });
    }, { threshold: 0.6 });
    nodes.forEach((n) => io.observe(n));
  })();

  /* ── Footnote culture: tooltip + smooth scroll + flash ───────── */
  (function footnotes() {
    const tipEl = doc.getElementById("fnTip");
    if (!tipEl) return;
    let hideTimer = null;
    let shown = false;
    let activeBtn = null;
    const show = (btn) => {
      const n = btn.dataset.fn;
      if (!FOOTNOTES[n]) return;
      clearTimeout(hideTimer);
      shown = true;
      if (activeBtn && activeBtn !== btn) activeBtn.removeAttribute("aria-describedby");
      activeBtn = btn;
      btn.setAttribute("aria-describedby", "fnTip");
      tipEl.textContent = FOOTNOTES[n];
      tipEl.hidden = false;
      const r = btn.getBoundingClientRect();
      const tw = Math.min(320, window.innerWidth - 48);
      tipEl.style.maxWidth = tw + "px";
      let left = r.left + window.scrollX - 20;
      if (left + tw > window.scrollX + window.innerWidth - 24) left = window.scrollX + window.innerWidth - tw - 24;
      if (left < window.scrollX + 12) left = window.scrollX + 12;
      tipEl.style.left = left + "px";
      tipEl.style.top = (r.top + window.scrollY - 12) + "px";
      requestAnimationFrame(() => {
        if (!shown) return;
        const h = tipEl.offsetHeight;
        // flip below the trigger when there is no room under the fixed nav
        if (r.top - h - 10 < 72) tipEl.style.top = (r.bottom + window.scrollY + 10) + "px";
        else tipEl.style.top = (r.top + window.scrollY - h - 10) + "px";
        tipEl.classList.add("is-visible");
      });
    };
    const hide = () => {
      shown = false;
      if (activeBtn) { activeBtn.removeAttribute("aria-describedby"); activeBtn = null; }
      tipEl.classList.remove("is-visible");
      hideTimer = setTimeout(() => { tipEl.hidden = true; }, 220);
    };
    // The tooltip itself is hoverable (magnification users) — entering it cancels the hide
    tipEl.addEventListener("mouseenter", () => { clearTimeout(hideTimer); shown = true; tipEl.classList.add("is-visible"); tipEl.hidden = false; });
    tipEl.addEventListener("mouseleave", hide);
    doc.addEventListener("keydown", (e) => { if (e.key === "Escape") hide(); });
    doc.querySelectorAll(".fn").forEach((btn) => {
      btn.addEventListener("mouseenter", () => show(btn));
      btn.addEventListener("mouseleave", hide);
      btn.addEventListener("focus", () => show(btn));
      btn.addEventListener("blur", hide);
      btn.addEventListener("click", () => {
        const target = doc.getElementById("fn-" + btn.dataset.fn);
        if (!target) return;
        hide();
        target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
        setTimeout(() => {
          target.focus({ preventScroll: true });
          target.classList.remove("is-flash");
          void target.offsetWidth;
          target.classList.add("is-flash");
        }, reduceMotion ? 0 : 600);
      });
    });
  })();

  /* ── Contact form (demonstration only) ───────────────────────── */
  const form = doc.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      const done = doc.getElementById("formDone");
      if (done) done.hidden = false;
      form.reset();
    });
  }

  /* ── Print: reveal everything, settle counters ───────────────── */
  window.addEventListener("beforeprint", () => {
    doc.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-inview"));
    doc.querySelectorAll("[data-count]").forEach((n) => {
      n.textContent = parseFloat(n.dataset.count).toFixed(parseInt(n.dataset.dec || "0", 10));
    });
  });
})();
