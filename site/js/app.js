/* 列宾落地页 · 安装命令、任务包 zip、导航 */
(function () {
  const REPO = "https://github.com/ShaohuaDavidLee/Liebin.git";
  const INSTALL = {
    global: {
      cmd: "git clone " + REPO + " ~/.claude/skills/liebin",
      note: "重开一个 Claude Code 会话即可生效，或直接 /liebin 调用。Codex、Cursor、Grok、Openclaw、Kimi Work、WorkBuddy、Hermes、DeepSeek harness——把仓库放进项目里，让它读 SKILL.md 就行，不挑 agent。"
    },
    project: {
      cmd: "git clone " + REPO + " .claude/skills/liebin",
      note: "只对当前仓库生效，团队里其他人拉下代码就一起有了。重开一个 Claude Code 会话即可，或直接 /liebin 调用。别的 agent 就让它读仓库里的 SKILL.md，一样能走完五步。"
    }
  };

  const nav = document.getElementById("nav");
  const toggle = document.querySelector(".nav-toggle");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      const open = !nav.classList.contains("is-open");
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  const cmdEl = document.getElementById("install-cmd");
  const noteEl = document.getElementById("install-note");
  const copyInstall = document.getElementById("copy-install");
  document.querySelectorAll(".scope button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".scope button").forEach(function (b) {
        b.classList.toggle("is-on", b === btn);
        b.setAttribute("aria-pressed", String(b === btn));
      });
      const pack = INSTALL[btn.getAttribute("data-scope")] || INSTALL.global;
      cmdEl.textContent = pack.cmd;
      noteEl.textContent = pack.note;
    });
  });
  copyInstall.addEventListener("click", function () {
    copyText(cmdEl.textContent, copyInstall, "已复制", "复制");
  });

  const files = [];
  const drop = document.getElementById("drop");
  const fileInput = document.getElementById("files");
  const fileList = document.getElementById("file-list");
  const packHint = document.getElementById("pack-hint");
  const zipBtn = document.getElementById("download-zip");
  const briefBtn = document.getElementById("copy-brief");

  drop.addEventListener("dragover", function (e) {
    e.preventDefault();
    drop.classList.add("is-over");
  });
  drop.addEventListener("dragleave", function () { drop.classList.remove("is-over"); });
  drop.addEventListener("drop", function (e) {
    e.preventDefault();
    drop.classList.remove("is-over");
    addFiles(e.dataTransfer.files);
  });
  fileInput.addEventListener("change", function () {
    addFiles(fileInput.files);
    fileInput.value = "";
  });

  zipBtn.addEventListener("click", downloadZip);
  briefBtn.addEventListener("click", function () {
    copyText(buildBrief(), briefBtn, "已复制到剪贴板", "复制成一段话");
  });

  function addFiles(list) {
    const picked = Array.prototype.slice.call(list).filter(function (f) { return f && f.size; });
    if (!picked.length) return;
    Promise.all(picked.map(readFile)).then(function (next) {
      next.forEach(function (f) { files.push(f); });
      renderFiles();
    });
  }

  function readFile(f) {
    return f.arrayBuffer().then(function (buf) {
      return { name: f.name.replace(/[\\/]/g, "_"), bytes: new Uint8Array(buf) };
    });
  }

  function renderFiles() {
    fileList.innerHTML = "";
    files.forEach(function (f, i) {
      const chip = document.createElement("span");
      chip.className = "file";
      chip.appendChild(document.createTextNode(f.name));
      const x = document.createElement("button");
      x.type = "button";
      x.setAttribute("aria-label", "移除 " + f.name);
      x.textContent = "×";
      x.addEventListener("click", function () {
        files.splice(i, 1);
        renderFiles();
      });
      chip.appendChild(x);
      fileList.appendChild(chip);
    });
    packHint.textContent = files.length
      ? "包内：BRIEF.md + refs/（" + files.length + " 张图）"
      : "包内：BRIEF.md（还没有参考图也能用）";
  }

  function buildBrief() {
    const urls = (document.getElementById("refs").value || "").split("\n").map(trim).filter(Boolean);
    const notes = (document.getElementById("notes").value || "").trim();
    const d = new Date().toISOString().slice(0, 10);
    const L = [
      "# 列宾任务包 · Liebin brief",
      "",
      "> 用 liebin skill 走一遍：定轴 → 三个变体 × 三屏（首屏 / 核心操作屏 / 空状态）→ 确认对话 → 回写 DESIGN.md → 页面落地后验收。",
      "",
      "## 参考"
    ];
    if (urls.length) urls.forEach(function (u) { L.push("- " + u); });
    else L.push("- （没有网址参考）");
    if (files.length) {
      L.push("", "参考图在 `refs/`：");
      files.forEach(function (f) { L.push("- refs/" + f.name); });
    }
    L.push("", "## 要设计的是什么");
    L.push(notes || "（还没写。开工前先把三屏的真实文案定下来，别用占位文字。）");
    L.push("", "## 渲染约束");
    L.push("- 用上面的真实文案渲染，不许 Lorem ipsum");
    L.push("- 三个变体沿一条轴排开，第三个故意偏离参考");
    L.push("- 每个变体三屏，空状态屏不能跳过");
    L.push("- 参考里的 px 先除以字号转成 em；中文标题不用负字距，正文行高 1.7–1.9");
    L.push("- DESIGN.md 里每个数值标出处：量得 / 看图估的 / 我们定的");
    L.push("", "---", "生成于 " + d + " · liebin");
    return L.join("\n");
  }

  function downloadZip() {
    const enc = new TextEncoder();
    const entries = [{ name: "BRIEF.md", bytes: enc.encode(buildBrief()) }];
    files.forEach(function (f) { entries.push({ name: "refs/" + f.name, bytes: f.bytes }); });
    const url = URL.createObjectURL(zip(entries));
    const a = document.createElement("a");
    a.href = url;
    a.download = "liebin-brief.zip";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
    flash(zipBtn, "已下载", "打包下载 zip");
  }

  function copyText(text, btn, on, off) {
    const done = function () { flash(btn, on, off); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, done);
      return;
    }
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); } catch (e) {}
    document.body.removeChild(ta);
    done();
  }

  function flash(btn, on, off) {
    const arrow = btn.querySelector(".rn-btn__arrow");
    btn.childNodes[0].textContent = on;
    if (arrow) btn.appendChild(arrow);
    clearTimeout(btn._t);
    btn._t = setTimeout(function () {
      btn.childNodes[0].textContent = off;
      if (arrow) btn.appendChild(arrow);
    }, 1800);
  }

  function trim(s) { return s.trim(); }

  function crc32(u8) {
    if (!crc32.tab) {
      const t = new Uint32Array(256);
      for (let n = 0; n < 256; n++) {
        let c = n;
        for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
        t[n] = c >>> 0;
      }
      crc32.tab = t;
    }
    let c = 0xFFFFFFFF;
    for (let i = 0; i < u8.length; i++) c = crc32.tab[(c ^ u8[i]) & 255] ^ (c >>> 8);
    return (c ^ 0xFFFFFFFF) >>> 0;
  }

  function zip(entries) {
    const enc = new TextEncoder();
    const p16 = function (a, n) { a.push(n & 255, (n >>> 8) & 255); };
    const p32 = function (a, n) { a.push(n & 255, (n >>> 8) & 255, (n >>> 16) & 255, (n >>> 24) & 255); };
    const parts = [];
    const central = [];
    let offset = 0;
    entries.forEach(function (e) {
      const nb = enc.encode(e.name);
      const crc = crc32(e.bytes);
      const sz = e.bytes.length;
      const h = [];
      p32(h, 0x04034b50); p16(h, 20); p16(h, 0x0800); p16(h, 0); p16(h, 0); p16(h, 0);
      p32(h, crc); p32(h, sz); p32(h, sz); p16(h, nb.length); p16(h, 0);
      const head = Uint8Array.from(h);
      parts.push(head, nb, e.bytes);
      const c = [];
      p32(c, 0x02014b50); p16(c, 20); p16(c, 20); p16(c, 0x0800); p16(c, 0); p16(c, 0); p16(c, 0);
      p32(c, crc); p32(c, sz); p32(c, sz); p16(c, nb.length); p16(c, 0); p16(c, 0); p16(c, 0); p16(c, 0);
      p32(c, 0); p32(c, offset);
      central.push(Uint8Array.from(c), nb);
      offset += head.length + nb.length + sz;
    });
    let cSize = 0;
    central.forEach(function (x) { cSize += x.length; });
    const end = [];
    p32(end, 0x06054b50); p16(end, 0); p16(end, 0);
    p16(end, entries.length); p16(end, entries.length);
    p32(end, cSize); p32(end, offset); p16(end, 0);
    return new Blob(parts.concat(central, [Uint8Array.from(end)]), { type: "application/zip" });
  }
})();
