// Nạp manifest và các file topic. Có cache-bust để GitHub Pages không phục vụ bản cũ.
// Tăng BUILD mỗi lần cập nhật nội dung rồi push.

export const BUILD = '20260831-2';

const cache = new Map();
let manifestPromise = null;

async function getJson(path) {
  const res = await fetch(`data/${path}?v=${BUILD}`);
  if (!res.ok) throw new Error(`${path} → HTTP ${res.status}`);
  return res.json();
}

export function loadManifest() {
  if (!manifestPromise) {
    manifestPromise = getJson('manifest.json').catch((e) => {
      manifestPromise = null;
      throw e;
    });
  }
  return manifestPromise;
}

export async function getBank(bankId) {
  const m = await loadManifest();
  return m.banks.find((b) => b.id === bankId) || null;
}

export async function getTopicMeta(bankId, topicId) {
  const bank = await getBank(bankId);
  return bank ? bank.topics.find((t) => t.id === topicId) || null : null;
}

/** Trả về mảng câu hỏi của một topic, mỗi câu được gắn thêm _bank và _topic. */
export async function loadTopic(bankId, topicId) {
  const key = `${bankId}/${topicId}`;
  if (cache.has(key)) return cache.get(key);

  const meta = await getTopicMeta(bankId, topicId);
  if (!meta) return [];

  const doc = await getJson(meta.file);
  const questions = (doc.questions || []).map((q) => ({ ...q, _bank: bankId, _topic: topicId, _group: meta.group }));
  cache.set(key, questions);
  return questions;
}

/** Nạp toàn bộ câu hỏi của một bank (dùng cho bài test và danh sách câu sai). */
export async function loadBankQuestions(bankId) {
  const bank = await getBank(bankId);
  if (!bank) return [];
  const chunks = await Promise.all(bank.topics.map((t) => loadTopic(bankId, t.id)));
  return chunks.flat();
}

/** Nạp câu hỏi của tất cả các bank — dùng cho màn hình đánh dấu xuyên phần. */
export async function loadAllQuestions() {
  const m = await loadManifest();
  const chunks = await Promise.all(m.banks.map((b) => loadBankQuestions(b.id)));
  return chunks.flat();
}
