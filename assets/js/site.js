(function () {
  // 时间换色：傍晚琥珀，深夜冷蓝，其余跟随主题
  const h = new Date().getHours();
  let c = null;
  if (h >= 21 || h < 6) c = '#7aa2f7';
  else if (h >= 17) c = '#e0a76c';
  if (c) document.documentElement.style.setProperty('--cursor', c);

  // 标题循环：body 上声明 data-title-cycle="·|··|···"
  const cycle = document.body.dataset.titleCycle;
  if (cycle) {
    const seq = cycle.split('|');
    let i = 0;
    setInterval(() => { document.title = seq[i++ % seq.length]; }, 800);
  }

  // 打字:有 #text 才启用
  const textEl = document.getElementById('text');
  let locked = false;

  // --- 工具函数 ---

  // 打字机：逐字符写入元素
  function typewrite(el, text, speed) {
    return new Promise((resolve) => {
      let i = 0;
      const tick = setInterval(() => {
        el.textContent += text[i++];
        if (i >= text.length) { clearInterval(tick); resolve(); }
      }, speed);
    });
  }

  // 退格：逐字符删除元素内容
  function backspace(el, speed) {
    return new Promise((resolve) => {
      const tick = setInterval(() => {
        const t = el.textContent;
        if (t.length === 0) { clearInterval(tick); resolve(); return; }
        el.textContent = t.slice(0, -1);
      }, speed);
    });
  }

  function wait(ms) { return new Promise((r) => setTimeout(r, ms)); }

  // --- help 命令 ---

  async function showHelp() {
    const routes = window.ZWENRENMUYUAN_ROUTES;
    if (!routes) return;
    locked = true;

    const box = document.createElement('div');
    box.className = 'help-box';
    document.body.appendChild(box);

    // 显式排序：. 最前，数字键最后，其余按字母序
    const entries = Object.entries(routes).sort(([a], [b]) => {
      if (a === '.') return -1;
      if (b === '.') return 1;
      const aNum = /^\d+$/.test(a);
      const bNum = /^\d+$/.test(b);
      if (aNum !== bNum) return aNum ? 1 : -1;
      return a.localeCompare(b);
    });
    const maxKey = Math.max(...entries.map(([k]) => k.length));

    for (const [key, url] of entries) {
      const row = document.createElement('div');
      box.appendChild(row);
      const display = key.padEnd(maxKey) + '  →  ' + url;
      await typewrite(row, display, 35);
      await wait(120);
    }

    await wait(2000);
    box.classList.add('fade-out');
    await wait(600);
    box.remove();
    locked = false;
  }

  // --- 路由提示 ---

  let hintEl = null;

  function dismissHint() {
    if (!hintEl) return;
    const el = hintEl;
    hintEl = null;
    el.classList.remove('visible');
    el.addEventListener('transitionend', () => el.remove(), { once: true });
  }

  function updateHint(buf) {
    const routes = window.ZWENRENMUYUAN_ROUTES;
    const key = buf.trim();
    const target = routes && key && routes[key];
    const display = key === 'help'
      ? 'help  →  list all commands'
      : target ? key + '  →  ' + target : null;

    if (display) {
      if (!hintEl) {
        hintEl = document.createElement('div');
        hintEl.className = 'hint';
        document.body.appendChild(hintEl);
        requestAnimationFrame(() => requestAnimationFrame(() => {
          if (hintEl) hintEl.classList.add('visible');
        }));
      }
      hintEl.textContent = display;
    } else {
      dismissHint();
    }
  }

  // --- 键盘路由 ---

  if (textEl) {
    let buf = textEl.textContent;
    window.addEventListener('keydown', (e) => {
      if (locked) { e.preventDefault(); return; }
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === 'Backspace') {
        buf = buf.slice(0, -1);
        textEl.textContent = buf;
        updateHint(buf);
        e.preventDefault();
      } else if (e.key === 'Enter') {
        dismissHint();
        const cmd = buf.trim();
        if (cmd === 'help') {
          buf = '';
          textEl.textContent = '';
          showHelp();
          return;
        }
        const target = window.ZWENRENMUYUAN_ROUTES && window.ZWENRENMUYUAN_ROUTES[cmd];
        if (target) {
          buf = '';
          textEl.textContent = '';
          window.location.href = target;
          return;
        }
        buf = '';
        textEl.textContent = '';
      } else if (e.key.length === 1) {
        buf += e.key;
        textEl.textContent = buf;
        updateHint(buf);
      }
    });

    // --- 欢迎打字机 ---
    const welcome = document.body.dataset.welcome;
    if (welcome) {
      (async () => {
        locked = true;
        await wait(400);
        await typewrite(textEl, welcome, 90);
        await wait(1500);
        await backspace(textEl, 40);
        buf = '';
        locked = false;
      })();
    }
  }

  // 点击光标随机传送
  const cursor = document.getElementById('cursor');
  const line = document.getElementById('line');
  if (cursor && line) {
    cursor.addEventListener('click', (e) => {
      e.stopPropagation();
      line.style.left = (10 + Math.random() * 80) + '%';
      line.style.top  = (10 + Math.random() * 80) + '%';
    });
  }
})();
