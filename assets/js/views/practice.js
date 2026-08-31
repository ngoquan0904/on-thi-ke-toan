import { t, pick } from '../i18n.js';
import { getBank, getTopicMeta, loadTopic, loadBankQuestions } from '../data-loader.js';
import * as store from '../store.js';
import { esc, shuffle, pct } from '../util.js';
import { optionsHtml, verdictHtml, explanationHtml, difficultyPill, progressBar, emptyState } from '../components.js';

// Trạng thái tách khỏi markup, nhờ vậy đổi ngôn ngữ chỉ vẽ lại chứ không mất gì.
let s = null;

async function collect(bankId, source) {
  if (source === 'wrong') {
    const all = await loadBankQuestions(bankId);
    return all.filter((q) => store.getProgress(q.id)?.wrong);
  }
  if (source === 'bookmarked') {
    const all = await loadBankQuestions(bankId);
    return all.filter((q) => store.isBookmarked(q.id));
  }
  return loadTopic(bankId, source);
}

async function title(bankId, source) {
  if (source === 'wrong') return t('reviewWrong');
  if (source === 'bookmarked') return t('bookmarked');
  const meta = await getTopicMeta(bankId, source);
  return meta ? pick(meta.label) : source;
}

export const practice = {
  crumb: () => (s ? s.title : ''),

  async mount({ bankId, source }) {
    const bank = await getBank(bankId);
    const questions = await collect(bankId, source);
    s = {
      bankId,
      source,
      bank,
      title: await title(bankId, source),
      questions: shuffle(questions),
      idx: 0,
      answers: new Map(),   // id -> chỉ số đã chọn
      finished: false,
    };
  },

  render(root) {
    if (!s) return;

    if (!s.questions.length) {
      const msg = s.source === 'wrong' ? t('emptyWrong')
        : s.source === 'bookmarked' ? t('emptyBookmark')
        : t('emptyTopic');
      root.innerHTML = emptyState(msg,
        `<a class="btn" href="#/bank/${esc(s.bankId)}">${esc(t('backToTopics'))}</a>`);
      return;
    }

    if (s.finished) { renderSummary(root); return; }

    const q = s.questions[s.idx];
    const picked = s.answers.has(q.id) ? s.answers.get(q.id) : null;
    const revealed = picked !== null;
    const isCorrect = revealed && picked === q.answer;
    const last = s.idx === s.questions.length - 1;

    root.innerHTML = `
      <div class="qhead">
        <span class="qhead__pos">${s.idx + 1} / ${s.questions.length}</span>
        ${difficultyPill(q)}
        <span class="qhead__spacer"></span>
        <button class="qbookmark" id="bm" aria-pressed="${store.isBookmarked(q.id)}" aria-label="${esc(t('bookmark'))}" title="${esc(t('bookmark'))}">★</button>
      </div>
      ${progressBar(s.idx, s.questions.length)}

      <div class="card" style="margin-top:.8rem">
        <div class="qtext">${esc((q[langKey()] || q.vi).question)}</div>
        ${optionsHtml(q, { mode: revealed ? 'revealed' : 'answerable', picked })}
        ${revealed ? verdictHtml(isCorrect) + explanationHtml(q) : ''}
      </div>

      ${revealed ? `<div class="qnav">
        ${s.idx > 0 ? `<button class="btn" id="prev">← ${esc(t('prev'))}</button>` : ''}
        <button class="btn btn--primary" id="next">${esc(last ? t('finishTopic') : t('next'))} →</button>
      </div>` : ''}
    `;

    root.querySelector('#bm').addEventListener('click', (e) => {
      const on = store.toggleBookmark(q.id);
      e.currentTarget.setAttribute('aria-pressed', String(on));
    });

    if (!revealed) {
      root.querySelectorAll('.opt').forEach((btn) => {
        btn.addEventListener('click', () => {
          const choice = Number(btn.dataset.choice);
          s.answers.set(q.id, choice);
          store.recordAnswer(q.id, choice, choice === q.answer);
          practice.render(root);
          root.querySelector('.verdict')?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        });
      });
    } else {
      root.querySelector('#next')?.addEventListener('click', () => {
        if (last) s.finished = true; else s.idx += 1;
        practice.render(root);
        window.scrollTo({ top: 0 });
      });
      root.querySelector('#prev')?.addEventListener('click', () => {
        s.idx -= 1;
        practice.render(root);
        window.scrollTo({ top: 0 });
      });
    }
  },

  /** Phím tắt trên máy tính. */
  onKey(e, root) {
    if (!s || s.finished || !s.questions.length) return;
    const q = s.questions[s.idx];
    const revealed = s.answers.has(q.id);
    if (!revealed && ['1', '2', '3', '4'].includes(e.key)) {
      root.querySelector(`.opt[data-choice="${Number(e.key) - 1}"]`)?.click();
    } else if (revealed && (e.key === 'Enter' || e.key === 'ArrowRight')) {
      root.querySelector('#next')?.click();
    } else if (revealed && e.key === 'ArrowLeft') {
      root.querySelector('#prev')?.click();
    } else if (e.key.toLowerCase() === 'b') {
      root.querySelector('#bm')?.click();
    }
  },
};

function langKey() { return document.documentElement.dataset.lang || 'vi'; }

function renderSummary(root) {
  const answered = [...s.answers.entries()];
  const correct = answered.filter(([id, c]) => s.questions.find((q) => q.id === id)?.answer === c).length;
  const wrongList = s.questions.filter((q) => s.answers.has(q.id) && s.answers.get(q.id) !== q.answer);

  root.innerHTML = `
    <div class="card">
      <div class="score">
        <div class="tiny muted">${esc(t('topicDone'))} · ${esc(s.title)}</div>
        <div class="score__big">${correct}/${s.questions.length}</div>
        <div class="score__pct">${pct(correct, s.questions.length)}%</div>
      </div>
      <div class="btnrow">
        ${wrongList.length ? `<button class="btn btn--primary" id="redo-wrong">${esc(t('redoWrong'))} (${wrongList.length})</button>` : ''}
        <button class="btn" id="redo-all">${esc(t('redoAll'))}</button>
        <a class="btn btn--ghost" href="#/bank/${esc(s.bankId)}">${esc(t('backToTopics'))}</a>
      </div>
    </div>

    ${wrongList.length ? `
      <div class="card" style="margin-top:.75rem">
        <h2>${esc(t('filterWrong'))}</h2>
        ${wrongList.map((q, i) => `
          <div class="reviewitem">
            <div class="tiny muted">${esc(q.id)}</div>
            <div class="qtext" style="font-size:.95rem;margin:.3rem 0 .6rem">${esc((q[langKey()] || q.vi).question)}</div>
            ${optionsHtml(q, { mode: 'revealed', picked: s.answers.get(q.id) })}
            ${explanationHtml(q)}
          </div>`).join('')}
      </div>` : ''}
  `;

  root.querySelector('#redo-wrong')?.addEventListener('click', () => {
    s.questions = shuffle(wrongList);
    s.answers = new Map();
    s.idx = 0;
    s.finished = false;
    practice.render(root);
    window.scrollTo({ top: 0 });
  });
  root.querySelector('#redo-all')?.addEventListener('click', () => {
    s.questions = shuffle(s.questions);
    s.answers = new Map();
    s.idx = 0;
    s.finished = false;
    practice.render(root);
    window.scrollTo({ top: 0 });
  });
}
