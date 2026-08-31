// Lưu tiến độ trong localStorage. Mọi thao tác đều bọc try/catch:
// ở chế độ riêng tư trình duyệt có thể ném lỗi, khi đó app vẫn chạy, chỉ mất tính năng lưu.

const KEY = 'prep.v1';

const blank = () => ({
  progress: {},     // id -> { seen, correct, wrong, lastAnswer, lastAt }
  bookmarks: [],
  liveTest: null,   // bài test đang làm dở
  lastResult: null, // kết quả vừa nộp, để màn hình result đọc
  history: [],      // 10 lần thi gần nhất
});

let state = load();
let timer = null;

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return blank();
    return { ...blank(), ...JSON.parse(raw) };
  } catch {
    return blank();
  }
}

function persist() {
  clearTimeout(timer);
  timer = setTimeout(() => {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* bỏ qua */ }
  }, 300);
}

/** Ghi ngay lập tức — dùng trước khi rời trang. */
export function flush() {
  clearTimeout(timer);
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* bỏ qua */ }
}

export function getProgress(id) { return state.progress[id]; }

export function recordAnswer(id, chosen, isCorrect) {
  const p = state.progress[id] || { seen: 0, correct: 0, wrong: false };
  p.seen += 1;
  if (isCorrect) p.correct += 1;
  p.wrong = !isCorrect;
  p.lastAnswer = chosen;
  p.lastAt = Date.now();
  state.progress[id] = p;
  persist();
}

/** Đánh dấu sai mà không tính là một lần làm — dùng khi đưa câu sai từ bài test vào danh sách ôn. */
export function markWrong(id) {
  const p = state.progress[id] || { seen: 0, correct: 0 };
  p.wrong = true;
  state.progress[id] = p;
  persist();
}

export function wrongIds(ids) { return ids.filter((id) => state.progress[id]?.wrong); }

export function isBookmarked(id) { return state.bookmarks.includes(id); }

export function toggleBookmark(id) {
  const i = state.bookmarks.indexOf(id);
  if (i >= 0) state.bookmarks.splice(i, 1);
  else state.bookmarks.push(id);
  persist();
  return i < 0;
}

export function bookmarkIds() { return [...state.bookmarks]; }

/** Thống kê cho một tập id: đã làm bao nhiêu, đúng bao nhiêu, đang sai bao nhiêu. */
export function statsFor(ids) {
  let seen = 0, correct = 0, wrong = 0;
  for (const id of ids) {
    const p = state.progress[id];
    if (!p || !p.seen) continue;
    seen += 1;
    if (p.correct > 0 && !p.wrong) correct += 1;
    if (p.wrong) wrong += 1;
  }
  return { total: ids.length, seen, correct, wrong };
}

export function getLiveTest() { return state.liveTest; }
export function setLiveTest(v) { state.liveTest = v; persist(); }
export function clearLiveTest() { state.liveTest = null; flush(); }

export function setLastResult(r) {
  state.lastResult = r;
  state.history.push({ bank: r.bank, score: r.score, total: r.total, at: r.finishedAt });
  if (state.history.length > 10) state.history = state.history.slice(-10);
  flush();
}
export function getLastResult() { return state.lastResult; }
export function getHistory(bank) { return state.history.filter((h) => h.bank === bank); }

export function resetAll() {
  state = blank();
  flush();
}
