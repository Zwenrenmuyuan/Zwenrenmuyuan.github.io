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
  if (textEl) {
    let buf = '';
    window.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === 'Backspace') {
        buf = buf.slice(0, -1);
        textEl.textContent = buf;
        e.preventDefault();
      } else if (e.key === 'Enter') {
        const target = window.ZWENRENMUYUAN_ROUTES && window.ZWENRENMUYUAN_ROUTES[buf.trim()];
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
      }
    });
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
