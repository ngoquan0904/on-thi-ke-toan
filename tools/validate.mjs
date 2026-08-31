#!/usr/bin/env node
// Kiểm tra tính toàn vẹn của ngân hàng câu hỏi.
// Chạy: node tools/validate.mjs
// Exit 0 = không có lỗi. Exit 1 = có lỗi phải sửa.

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DATA = join(ROOT, 'data');

const DIFFICULTIES = ['basic', 'intermediate', 'advanced'];
const REF_REQUIRED = /^b[6789]-/;           // topic thuế / chế độ kế toán bắt buộc có căn cứ
const ID_PATTERN = /^(ENG|PRO)-[A-Z0-9]+-\d{3}$/;

const errors = [];
const warnings = [];
const err = (where, msg) => errors.push(`${where}: ${msg}`);
const warn = (where, msg) => warnings.push(`${where}: ${msg}`);

const readJson = async (p) => JSON.parse(await readFile(join(DATA, p), 'utf8'));

/** Độ tương đồng thô giữa hai chuỗi, dùng để phát hiện câu trùng. */
function similarity(a, b) {
  const norm = (s) => s.toLowerCase().replace(/[^\p{L}\p{N} ]/gu, '').split(/\s+/).filter(Boolean);
  const A = new Set(norm(a));
  const B = new Set(norm(b));
  if (!A.size || !B.size) return 0;
  let shared = 0;
  for (const w of A) if (B.has(w)) shared++;
  return shared / Math.max(A.size, B.size);
}

function checkSide(q, lang, where) {
  const side = q[lang];
  if (!side || typeof side !== 'object') {
    err(where, `thiếu khối ngôn ngữ "${lang}"`);
    return null;
  }
  for (const field of ['question', 'explanation']) {
    if (typeof side[field] !== 'string' || !side[field].trim()) {
      err(where, `${lang}.${field} rỗng hoặc không phải chuỗi`);
    }
  }
  if (!Array.isArray(side.options)) {
    err(where, `${lang}.options không phải mảng`);
    return null;
  }
  if (side.options.length !== 4) {
    err(where, `${lang}.options có ${side.options.length} phần tử, phải là 4`);
  }
  side.options.forEach((o, i) => {
    if (typeof o !== 'string' || !o.trim()) err(where, `${lang}.options[${i}] rỗng`);
  });
  // V11 — các trường cấp câu hỏi bị đặt nhầm vào trong khối ngôn ngữ sẽ không bao giờ hiển thị.
  for (const stray of ['ref', 'answer', 'difficulty', 'tags', 'id', 'topic']) {
    if (stray in side) err(where, `"${stray}" bị đặt nhầm trong khối "${lang}" — phải nằm ở cấp câu hỏi`);
  }
  if (typeof side.explanation === 'string' && side.explanation.trim().length < 80) {
    warn(where, `${lang}.explanation chỉ ${side.explanation.trim().length} ký tự — giải thích quá ngắn (W4)`);
  }
  return side;
}

function checkDistractors(side, answer, lang, where) {
  if (side.distractors === undefined) {
    warn(where, `${lang}: thiếu "distractors" — không giải thích được vì sao các đáp án khác sai (W7)`);
    return;
  }
  if (!Array.isArray(side.distractors) || side.distractors.length !== 4) {
    err(where, `${lang}.distractors phải là mảng 4 phần tử`);
    return;
  }
  side.distractors.forEach((d, i) => {
    if (i === answer) {
      if (d !== null) err(where, `${lang}.distractors[${i}] phải là null (vị trí đáp án đúng)`);
    } else if (typeof d !== 'string' || !d.trim()) {
      err(where, `${lang}.distractors[${i}] rỗng — phải giải thích vì sao đáp án này sai`);
    }
  });
}

async function validateBank(bank) {
  const seenIds = new Set();
  const allQuestions = [];
  let totalDeclared = 0;

  for (const topic of bank.topics) {
    totalDeclared += topic.count;
    const where0 = `[${bank.id}/${topic.id}]`;
    let doc;
    try {
      doc = await readJson(topic.file);
    } catch (e) {
      err(where0, `không đọc được ${topic.file} — ${e.message}`);
      continue;
    }

    if (doc.topic !== topic.id) err(where0, `trường "topic" trong file là "${doc.topic}", không khớp manifest`);
    if (!Array.isArray(doc.questions)) {
      err(where0, 'thiếu mảng "questions"');
      continue;
    }
    if (doc.questions.length !== topic.count) {
      err(where0, `có ${doc.questions.length} câu, manifest khai ${topic.count}`);
    }

    const answerPositions = [0, 0, 0, 0];
    const longestHits = { vi: 0, en: 0 };
    const longestTotal = { vi: 0, en: 0 };

    doc.questions.forEach((q, idx) => {
      const where = `${where0}#${idx + 1} (${q.id ?? 'thiếu id'})`;

      if (typeof q.id !== 'string' || !ID_PATTERN.test(q.id)) {
        err(where, `id "${q.id}" sai định dạng, phải dạng PRO-B6-001`);
      } else if (seenIds.has(q.id)) {
        err(where, `id trùng lặp`);
      } else {
        seenIds.add(q.id);
      }

      if (q.topic !== topic.id) err(where, `q.topic = "${q.topic}", không khớp "${topic.id}"`);

      if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer > 3) {
        err(where, `answer = ${q.answer}, phải là số nguyên 0..3`);
      } else {
        answerPositions[q.answer]++;
      }

      if (!DIFFICULTIES.includes(q.difficulty)) {
        err(where, `difficulty = "${q.difficulty}", phải thuộc ${DIFFICULTIES.join('/')}`);
      }

      if (REF_REQUIRED.test(topic.id) && (typeof q.ref !== 'string' || !q.ref.trim())) {
        err(where, 'thiếu "ref" — câu về thuế/chế độ kế toán bắt buộc dẫn căn cứ pháp lý');
      }

      const vi = checkSide(q, 'vi', where);
      const en = checkSide(q, 'en', where);

      if (vi && en && Array.isArray(vi.options) && Array.isArray(en.options)
          && vi.options.length !== en.options.length) {
        err(where, `số đáp án lệch giữa hai ngôn ngữ: vi=${vi.options.length}, en=${en.options.length}`);
      }

      if (Number.isInteger(q.answer) && q.answer >= 0 && q.answer <= 3) {
        if (vi) checkDistractors(vi, q.answer, 'vi', where);
        if (en) checkDistractors(en, q.answer, 'en', where);

        // W1 — đáp án đúng dài bất thường (chỉ cảnh báo trường hợp cực đoan).
        // Câu định nghĩa vốn dĩ có đáp án đúng dài hơn; tín hiệu thật nằm ở W6 bên dưới.
        for (const [lang, side] of [['vi', vi], ['en', en]]) {
          if (!side || !Array.isArray(side.options) || side.options.length !== 4) continue;
          const correct = String(side.options[q.answer]).length;
          const others = side.options.filter((_, i) => i !== q.answer).map((o) => String(o).length);
          const avg = others.reduce((a, b) => a + b, 0) / others.length;
          if (avg > 0 && correct > avg * 2.2) {
            warn(where, `${lang}: đáp án đúng dài ${correct} ký tự vs trung bình ${Math.round(avg)} — lệch quá xa, dễ lộ đáp án (W1)`);
          }
          // Chỉ tính khi đáp án đúng dài hơn HẲN mọi phương án còn lại.
          // Bốn đáp án dài bằng nhau thì không rò rỉ thông tin gì, không phải thiên lệch.
          if (correct > Math.max(...others)) longestHits[lang] += 1;
          longestTotal[lang] += 1;
        }
      }

      if (vi?.question) allQuestions.push({ id: q.id, text: vi.question, topic: topic.id, difficulty: q.difficulty, group: topic.group });
    });

    // W2 — phân bố vị trí đáp án đúng
    const n = doc.questions.length;
    if (n >= 8) {
      answerPositions.forEach((count, pos) => {
        if (count / n > 0.35) {
          warn(where0, `${Math.round((count / n) * 100)}% đáp án đúng nằm ở vị trí ${'ABCD'[pos]} — nên phân bố đều hơn (W2)`);
        }
      });

      // W6 — thiên lệch hệ thống: đáp án đúng thường xuyên là đáp án DÀI NHẤT.
      // Đây mới là tín hiệu cho phép người làm bài đoán mò mà không cần kiến thức.
      for (const lang of ['vi', 'en']) {
        if (!longestTotal[lang]) continue;
        const rate = longestHits[lang] / longestTotal[lang];
        if (rate > 0.6) {
          warn(where0, `${lang}: đáp án đúng là phương án dài nhất ở ${Math.round(rate * 100)}% số câu — có thể đoán mò theo độ dài (W6)`);
        }
      }
    }
  }

  // W3 — trùng nội dung
  for (let i = 0; i < allQuestions.length; i++) {
    for (let j = i + 1; j < allQuestions.length; j++) {
      if (similarity(allQuestions[i].text, allQuestions[j].text) > 0.85) {
        warn(`[${bank.id}]`, `${allQuestions[i].id} và ${allQuestions[j].id} có nội dung gần trùng (W3)`);
      }
    }
  }

  return { allQuestions, totalDeclared };
}

const bar = (n, total) => {
  const w = total ? Math.round((n / total) * 24) : 0;
  return '█'.repeat(w) + '░'.repeat(24 - w);
};

async function main() {
  let manifest;
  try {
    manifest = await readJson('manifest.json');
  } catch (e) {
    console.error(`✘ Không đọc được data/manifest.json — ${e.message}`);
    process.exit(1);
  }

  console.log('\n  Kiểm tra ngân hàng câu hỏi\n  ' + '─'.repeat(52));

  let grandTotal = 0;
  for (const bank of manifest.banks) {
    const errBefore = errors.length;
    const warnBefore = warnings.length;
    const { allQuestions, totalDeclared } = await validateBank(bank);
    grandTotal += allQuestions.length;

    const e = errors.length - errBefore;
    const w = warnings.length - warnBefore;
    const mark = e === 0 ? '✔' : '✘';

    console.log(`\n  ${mark} ${bank.id.padEnd(13)} ${String(allQuestions.length).padStart(3)}/${totalDeclared} câu · ${bank.topics.length} topic · ${e} lỗi · ${w} cảnh báo`);

    const byGroup = {};
    const byDiff = {};
    for (const q of allQuestions) {
      byGroup[q.group] = (byGroup[q.group] || 0) + 1;
      byDiff[q.difficulty] = (byDiff[q.difficulty] || 0) + 1;
    }
    const t = allQuestions.length || 1;
    if (Object.keys(byGroup).length > 1) {
      const parts = Object.entries(byGroup).map(([g, c]) => `${g} ${c} (${((c / t) * 100).toFixed(1)}%)`);
      console.log(`      nhóm      : ${parts.join(' · ')}`);
    }
    console.log(`      độ khó    : ${DIFFICULTIES.map((d) => `${d} ${byDiff[d] || 0}`).join(' · ')}`);

    // W5 — lệch tỷ lệ độ khó
    const target = { basic: 0.5, intermediate: 0.35, advanced: 0.15 };
    if (allQuestions.length >= 20) {
      for (const d of DIFFICULTIES) {
        const actual = (byDiff[d] || 0) / t;
        if (Math.abs(actual - target[d]) > 0.15) {
          warnings.push(`[${bank.id}]: tỷ lệ "${d}" là ${(actual * 100).toFixed(0)}%, mục tiêu ${target[d] * 100}% (W5)`);
        }
      }
    }

    for (const topic of bank.topics) {
      const have = allQuestions.filter((q) => q.topic === topic.id).length;
      const ok = have === topic.count ? ' ' : '!';
      console.log(`      ${ok} ${topic.id.padEnd(26)} ${bar(have, topic.count)} ${String(have).padStart(3)}/${topic.count}`);
    }
  }

  console.log('\n  ' + '─'.repeat(52));
  console.log(`  Tổng: ${grandTotal} câu · ${errors.length} lỗi · ${warnings.length} cảnh báo\n`);

  if (errors.length) {
    console.log('  LỖI (phải sửa)');
    errors.forEach((e) => console.log(`   ✘ ${e}`));
    console.log('');
  }
  if (warnings.length) {
    console.log('  CẢNH BÁO (nên sửa trước khi bàn giao)');
    warnings.forEach((w) => console.log(`   ⚠ ${w}`));
    console.log('');
  }
  if (!errors.length && !warnings.length) console.log('  Sạch. Không lỗi, không cảnh báo.\n');

  process.exit(errors.length ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
