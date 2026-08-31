// Tiện ích dùng chung.

/** Thoát ký tự HTML — mọi nội dung câu hỏi đều đi qua hàm này trước khi chèn vào DOM. */
export function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Xáo trộn Fisher–Yates, không sửa mảng gốc. */
export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Lấy mẫu theo tỷ lệ số câu của từng topic, rồi xáo trộn toàn bộ. */
export function sampleProportional(questions, size) {
  if (questions.length <= size) return shuffle(questions);

  const byTopic = new Map();
  for (const q of questions) {
    if (!byTopic.has(q._topic)) byTopic.set(q._topic, []);
    byTopic.get(q._topic).push(q);
  }

  const total = questions.length;
  const picks = [];
  const quotas = [];

  for (const [topic, list] of byTopic) {
    const exact = (list.length / total) * size;
    const base = Math.floor(exact);
    quotas.push({ topic, list: shuffle(list), base, frac: exact - base });
  }

  let assigned = 0;
  for (const q of quotas) {
    q.take = Math.min(q.base, q.list.length);
    assigned += q.take;
  }

  // Phân phần dư cho các topic có phần thập phân lớn nhất
  quotas.sort((a, b) => b.frac - a.frac);
  let i = 0;
  while (assigned < size && quotas.length) {
    const q = quotas[i % quotas.length];
    if (q.take < q.list.length) { q.take += 1; assigned += 1; }
    i += 1;
    if (i > size * 4) break; // an toàn
  }

  for (const q of quotas) picks.push(...q.list.slice(0, q.take));
  return shuffle(picks).slice(0, size);
}

export function pct(n, d) { return d ? Math.round((n / d) * 100) : 0; }

export function fmtClock(sec) {
  const s = Math.max(0, Math.round(sec));
  const m = Math.floor(s / 60);
  return `${String(m).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

export function fmtDuration(ms, lang) {
  const total = Math.round(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return lang === 'en' ? `${m}m ${s}s` : `${m} phút ${s} giây`;
}

export const LETTERS = ['A', 'B', 'C', 'D'];
