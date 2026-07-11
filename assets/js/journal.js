/* The Journal — renders article + media cards from
   window.CGSI_ARTICLES (articles.js) and MEDIA (media.js).
   Runs before main.js so rendered .reveal cards join the observers.
   All containers are optional; the script only fills what exists. */
(function () {
  "use strict";
  const doc = document;
  const A = window.CGSI_ARTICLES || [];
  const M = typeof MEDIA !== "undefined" ? MEDIA : [];

  const THAI_MONTHS = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
  function thaiDate(iso) {
    const d = new Date(iso + "T00:00:00");
    if (isNaN(d)) return iso;
    return d.getDate() + " " + THAI_MONTHS[d.getMonth()] + " " + (d.getFullYear() + 543);
  }

  /* ── Article cards (มีรูป cover แบบ rakpatai) ─────────────────── */
  function card(a, i, base) {
    const el = doc.createElement("a");
    el.className = "insight-card reveal";
    el.style.setProperty("--i", String(i % 3));
    el.href = base + "articles/" + a.slug + ".html";
    if (a.cover) {
      const cover = doc.createElement("span");
      cover.className = "insight-card__cover";
      cover.style.backgroundImage = "url('" + a.cover + "')";
      el.appendChild(cover);
    }
    const body = doc.createElement("span");
    body.className = "insight-card__body";
    const no = doc.createElement("span");
    no.className = "insight-card__no";
    no.setAttribute("aria-hidden", "true");
    no.textContent = "No. " + a.no;
    const cat = doc.createElement("span");
    cat.className = "insight-card__cat";
    cat.textContent = a.cat;
    const h = doc.createElement("h3");
    h.className = "insight-card__title";
    h.textContent = a.title;
    const ex = doc.createElement("p");
    ex.className = "insight-card__excerpt";
    ex.textContent = a.excerpt;
    const meta = doc.createElement("span");
    meta.className = "insight-card__meta";
    meta.textContent = a.date + " · อ่าน " + a.read + " นาที";
    const more = doc.createElement("span");
    more.className = "insight-card__more";
    more.append("อ่านบทความ ");
    const dash = doc.createElement("span");
    dash.setAttribute("aria-hidden", "true");
    dash.textContent = "—";
    more.appendChild(dash);
    body.append(no, cat, h, ex, meta, more);
    el.appendChild(body);
    return el;
  }

  if (A.length) {
    /* Homepage — latest three articles */
    const home = doc.getElementById("insightsGrid");
    if (home) A.slice(0, 3).forEach((a, i) => home.appendChild(card(a, i, "")));

    /* Journal index — featured (latest) + the rest */
    const featHost = doc.getElementById("journalFeatured");
    if (featHost) {
      const a = A[0];
      const el = doc.createElement("a");
      el.className = "feature-card reveal";
      el.href = "articles/" + a.slug + ".html";
      const text = doc.createElement("span");
      const label = doc.createElement("span");
      label.className = "feature-card__label";
      label.textContent = "Latest · No. " + a.no;
      const cat = doc.createElement("span");
      cat.className = "insight-card__cat";
      cat.textContent = a.cat;
      const h = doc.createElement("h2");
      h.className = "feature-card__title";
      h.textContent = a.title;
      const ex = doc.createElement("p");
      ex.className = "insight-card__excerpt feature-card__excerpt";
      ex.textContent = a.excerpt;
      const meta = doc.createElement("span");
      meta.className = "insight-card__meta";
      meta.textContent = a.date + " · อ่าน " + a.read + " นาที";
      const more = doc.createElement("span");
      more.className = "insight-card__more";
      more.append("อ่านบทความ ");
      const dash = doc.createElement("span");
      dash.setAttribute("aria-hidden", "true");
      dash.textContent = "—";
      more.appendChild(dash);
      text.append(label, cat, h, ex, meta, more);
      el.appendChild(text);
      if (a.cover) {
        const cover = doc.createElement("span");
        cover.className = "feature-card__cover";
        cover.style.backgroundImage = "url('" + a.cover + "')";
        el.appendChild(cover);
      }
      featHost.appendChild(el);
    }
    const list = doc.getElementById("journalList");
    if (list) A.slice(1).forEach((a, i) => list.appendChild(card(a, i, "")));

    /* Article pages — "continue reading" (everything except current) */
    const moreHost = doc.getElementById("moreArticles");
    if (moreHost) {
      const cur = doc.body.dataset.slug || "";
      A.filter((a) => a.slug !== cur).slice(0, 3).forEach((a, i) => moreHost.appendChild(card(a, i, "../")));
    }

    /* Article pages — prev/next (rakpatai post-nav) */
    const navHost = doc.getElementById("postNav");
    if (navHost) {
      const cur = doc.body.dataset.slug || "";
      const idx = A.findIndex((a) => a.slug === cur);
      if (idx !== -1) {
        const mk = (a, cls, labelText) => {
          const link = doc.createElement("a");
          link.className = cls;
          link.href = a.slug + ".html";
          const lb = doc.createElement("div");
          lb.className = "nav-label";
          lb.textContent = labelText;
          const t = doc.createElement("div");
          t.className = "nav-title";
          t.textContent = a.title;
          link.append(lb, t);
          return link;
        };
        const prev = A[idx + 1]; // เก่ากว่า
        const next = A[idx - 1]; // ใหม่กว่า
        navHost.appendChild(prev ? mk(prev, "prev", "← บทความก่อนหน้า") : doc.createElement("span"));
        if (next) navHost.appendChild(mk(next, "next", "บทความถัดไป →"));
      }
    }
  }

  /* ── Share buttons (rakpatai format) ─────────────────────────── */
  doc.addEventListener("click", (e) => {
    const btn = e.target.closest(".share-btn[data-share]");
    if (!btn) return;
    const url = location.href;
    const title = doc.title;
    const kind = btn.dataset.share;
    if (kind === "facebook") {
      window.open("https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(url), "_blank", "noopener,width=640,height=480");
    } else if (kind === "x") {
      window.open("https://twitter.com/intent/tweet?url=" + encodeURIComponent(url) + "&text=" + encodeURIComponent(title), "_blank", "noopener,width=640,height=480");
    } else if (kind === "copy") {
      const done = () => {
        const old = btn.textContent;
        btn.textContent = "คัดลอกแล้ว ✓";
        setTimeout(() => { btn.textContent = old; }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(done, done);
      else done();
    }
  });

  /* ── Media cards (วีดีโอ & พอดแคสต์) ─────────────────────────── */
  function mediaCard(m, i, base) {
    const isPod = m.type === "podcast";
    const el = doc.createElement("a");
    el.className = "media-card reveal";
    el.style.setProperty("--i", String(i % 3));
    el.dataset.type = m.type;
    el.href = base + "media/" + m.slug + ".html";
    const cover = doc.createElement("span");
    cover.className = "media-card__cover";
    cover.style.backgroundImage = "url('" + m.cover + "')";
    const badge = doc.createElement("span");
    badge.className = "media-card__badge" + (isPod ? " media-card__badge--pod" : "");
    badge.textContent = isPod ? "◉ Podcast" : "▶ Video";
    cover.appendChild(badge);
    if (m.duration && m.duration !== "—") {
      const dur = doc.createElement("span");
      dur.className = "media-card__duration";
      dur.textContent = m.duration;
      cover.appendChild(dur);
    }
    const body = doc.createElement("span");
    body.className = "media-card__body";
    const cat = doc.createElement("span");
    cat.className = "insight-card__cat";
    cat.textContent = isPod ? "Podcast" : "Video Session";
    const h = doc.createElement("h3");
    h.className = "insight-card__title";
    h.textContent = m.title;
    const ex = doc.createElement("p");
    ex.className = "insight-card__excerpt";
    ex.textContent = m.excerpt;
    const meta = doc.createElement("span");
    meta.className = "insight-card__meta";
    meta.textContent = thaiDate(m.date) + (m.duration && m.duration !== "—" ? " · " + m.duration : "");
    const more = doc.createElement("span");
    more.className = "insight-card__more";
    more.append(isPod ? "รับฟัง " : "รับชม ");
    const dash = doc.createElement("span");
    dash.setAttribute("aria-hidden", "true");
    dash.textContent = "—";
    more.appendChild(dash);
    body.append(cat, h, ex, meta, more);
    el.append(cover, body);
    return el;
  }

  if (M.length) {
    /* Homepage — latest three media items */
    const homeMedia = doc.getElementById("mediaGrid");
    if (homeMedia) M.slice(0, 3).forEach((m, i) => homeMedia.appendChild(mediaCard(m, i, "")));

    /* media.html — grid + filter chips + search */
    const grid = doc.getElementById("mediaListGrid");
    if (grid) {
      const chips = doc.getElementById("mediaFilter");
      const searchEl = doc.getElementById("mediaSearch");
      const emptyEl = doc.getElementById("mediaEmpty");
      let curType = "all";
      const render = () => {
        const q = (searchEl && searchEl.value ? searchEl.value : "").trim().toLowerCase();
        const list = M.filter((m) => {
          if (curType !== "all" && m.type !== curType) return false;
          if (q && !(m.title + " " + m.excerpt).toLowerCase().includes(q)) return false;
          return true;
        });
        grid.textContent = "";
        list.forEach((m, i) => {
          const el = mediaCard(m, i, "");
          el.classList.add("is-inview"); // re-renders must not re-hide behind the observer
          grid.appendChild(el);
        });
        if (emptyEl) emptyEl.hidden = list.length > 0;
      };
      if (chips) {
        chips.addEventListener("click", (e) => {
          const btn = e.target.closest("[data-type]");
          if (!btn) return;
          curType = btn.dataset.type;
          chips.querySelectorAll("[data-type]").forEach((c) => {
            c.classList.toggle("is-active", c === btn);
            c.setAttribute("aria-pressed", String(c === btn));
          });
          render();
        });
      }
      if (searchEl) searchEl.addEventListener("input", render);
      render();
    }

    /* Media pages — "continue watching" (everything except current) */
    const moreMedia = doc.getElementById("moreMedia");
    if (moreMedia) {
      const cur = doc.body.dataset.slug || "";
      M.filter((m) => m.slug !== cur).slice(0, 3).forEach((m, i) => moreMedia.appendChild(mediaCard(m, i, "../")));
    }

    /* Click-to-play — loads the embed only when pressed */
    doc.addEventListener("click", (e) => {
      const thumb = e.target.closest(".media-thumb[data-embed-id]");
      if (!thumb) return;
      const type = thumb.dataset.embedType;
      const id = thumb.dataset.embedId;
      const wrap = doc.createElement("div");
      if (type === "youtube") {
        wrap.className = "ratio-16x9";
        const f = doc.createElement("iframe");
        f.src = "https://www.youtube.com/embed/" + id + "?autoplay=1&rel=0";
        f.title = "วิดีโอ";
        f.setAttribute("allow", "autoplay; encrypted-media; picture-in-picture; fullscreen");
        f.setAttribute("allowfullscreen", "");
        wrap.appendChild(f);
      } else if (type === "spotify") {
        const f = doc.createElement("iframe");
        f.className = "spotify-embed";
        f.src = "https://open.spotify.com/embed/" + id;
        f.title = "พอดแคสต์";
        f.setAttribute("allow", "autoplay; encrypted-media");
        f.loading = "lazy";
        wrap.appendChild(f);
      } else return;
      thumb.replaceWith(wrap);
    });
  }
})();
