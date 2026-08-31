import { t, pick } from '../i18n.js';
import { getBank, loadBankQuestions } from '../data-loader.js';
import * as store from '../store.js';
import { esc, sampleProportional, shuffle, fmtClock, pct } from '../util.js';
import { optionsHtml, difficultyPill } from '../components.js';

let s = null;
let ticker = null;

const SIZES = [30, 50, 100, 0];       // 0 = toàn bộ
const TIMES = [30, 45, 60, 90, 0];    // 0 = không giới hạn

export const test = {
  crumb: () => (s?.bank ? pick(s.bank.label) : ''),

  async mount({ bankId }) {
    stopTicker();
    const bank = await getBank(bankId);
    const all = await loadBankQuestions(bankId);

    s = {
      bankId, bank, all,
      phase: 'config',
      cfg: { size: bank?.testSize || 50, minutes: bank?.testMinutes || 60, scope: 'all' },
      questions: [], answers: new Map(), flags: new Set(), idx: 0,
      startedAt: 0, deadline: 0,
    };

    // Khôi phục bài đang làm dở
    const live = store.getLiveTest();
    if (live && live.bank === bankId && live.ids?.length) {
      const stillValid = live.ids.every((id) => all.some((q) => q.id === id));
      if (stillValid && confirm(t('resumeTest'))) {
        s.questions = live.ids.map((id) => all.find((q) => q.id === id));
        s.answers = new Map(Object.entries(live.answers || {}).map(([k, v]) => [k, Number(v)]));
        s.flags = new Set(live.flags || []);
        s.idx = Math.min(live.idx || 0, s.questions.length - 1);
        s.startedAt = live.startedAt;
        s.deadline = live.deadline;
        s.cfg = live.cfg || s.cfg;
        s.phase = 'running';
        startTicker();
      } else {
        store.clearLiveTest();
      }
    }
  },

  render(root) {
    if (!s) return;
    if (s.phase === 'config') renderConfig(root);
    else renderRunning(root);
  },

  unmount() { stopTicker(); },

  onKey(e, root) {
    if (!s || s.phase !== 'running') return;
    if (['1', '2', '3', '4'].includes(e.key)) {
      root.querySelector(`.opt[data-choice="${Number(e.key) - 1}"]`)?.click();
    } else if (e.key === 'ArrowRight') root.querySelector('#next')?.click();
    else if (e.key === 'ArrowLeft') root.querySelector('#prev')?.click();
  },
};

/* ── Màn hình thiết lập ─────────────────────────────────────────────── */

function scopeCount(scope) {
  return pool(scope).length;
}

function pool(scope) {
  if (scope === 'vn') return s.all.filter((q) => q._group === 'vn');
  if (scope === 'intl') return s.all.filter((q) => q._group === 'intl');
  if (scope === 'wrong') return s.all.filter((q) => store.getProgress(q.id)?.wrong);
  return s.all;
}

function renderConfig(root) {
  const hasGroups = s.all.some((q) => q._group === 'intl') && s.all.some((q) => q._group === 'vn');
  const wrongN = scopeCount('wrong');

  const chip = (name, value, label, current, extra = '') =>
    `<button type="button" class="chip" data-${name}="${value}" aria-pressed="${String(current === value)}">${esc(label)}${extra}</button>`;

  root.innerHTML = `
    <h1>${esc(t('testConfig'))}</h1>
    <p class="muted small">${esc(pick(s.bank.label))}</p>

    <div class="card stack" style="margin-top:1rem">
      <div>
        <h3>${esc(t('numQuestions'))}</h3>
        <div class="filterrow">
          ${SIZES.map((n) => chip('size', n, n === 0 ? t('scopeAll') : String(n), s.cfg.size)).join('')}
        </div>
      </div>
      <div>
        <h3>${esc(t('timeLimit'))}</h3>
        <div class="filterrow">
          ${TIMES.map((m) => chip('minutes', m, m === 0 ? t('noLimit') : `${m} ${t('minutes')}`, s.cfg.minutes)).join('')}
        </div>
      </div>
      ${hasGroups || wrongN ? `<div>
        <h3>${esc(t('scope'))}</h3>
        <div class="filterrow">
          ${chip('scope', 'all', t('scopeAll'), s.cfg.scope, ` (${scopeCount('all')})`)}
          ${hasGroups ? chip('scope', 'vn', t('scopeVn'), s.cfg.scope, ` (${scopeCount('vn')})`) : ''}
          ${hasGroups ? chip('scope', 'intl', t('scopeIntl'), s.cfg.scope, ` (${scopeCount('intl')})`) : ''}
          ${wrongN ? chip('scope', 'wrong', t('scopeWrong'), s.cfg.scope, ` (${wrongN})`) : ''}
        </div>
      </div>` : ''}
      <div class="notice notice--warn">${esc(t('testWarning'))}</div>
      <button class="btn btn--primary btn--wide" id="go">${esc(t('start'))} →</button>
    </div>
  `;

  root.querySelectorAll('[data-size]').forEach((b) => b.addEventListener('click', () => {
    s.cfg.size = Number(b.dataset.size); renderConfig(root);
  }));
  root.querySelectorAll('[data-minutes]').forEach((b) => b.addEventListener('click', () => {
    s.cfg.minutes = Number(b.dataset.minutes); renderConfig(root);
  }));
  root.querySelectorAll('[data-scope]').forEach((b) => b.addEventListener('click', () => {
    s.cfg.scope = b.dataset.scope; renderConfig(root);
  }));

  root.querySelector('#go').addEventListener('click', () => {
    const src = pool(s.cfg.scope);
    if (!src.length) return;
    const size = s.cfg.size === 0 ? src.length : Math.min(s.cfg.size, src.length);
    s.questions = sampleProportional(src, size);
    s.answers = new Map();
    s.flags = new Set();
    s.idx = 0;
    s.startedAt = Date.now();
    s.deadline = s.cfg.minutes ? s.startedAt + s.cfg.minutes * 60000 : 0;
    s.phase = 'running';
    saveLive();
    startTicker();
    test.render(root);
    window.scrollTo({ top: 0 });
  });
}

/* ── Màn hình làm bài ───────────────────────────────────────────────── */

function renderRunning(root) {
  const q = s.questions[s.idx];
  const picked = s.answers.has(q.id) ? s.answers.get(q.id) : null;
  const remain = s.deadline ? (s.deadline - Date.now()) / 1000 : null;
  const low = remain !== null && remain < 300;
  const last = s.idx === s.questions.length - 1;

  root.innerHTML = `
    <div class="testbar">
      <span>${s.idx + 1}/${s.questions.length}</span>
      <span class="muted">· ${s.answers.size} ${esc(t('answered'))}</span>
      <span class="testbar__spacer"></span>
      ${remain !== null ? `<span class="testbar__clock ${low ? 'testbar__clock--low' : ''}" id="clock">${fmtClock(remain)}</span>` : ''}
      <button class="btn btn--sm btn--primary" id="submit">${esc(t('submit'))}</button>
    </div>

    <div class="qhead">
      <span class="qhead__pos">${s.idx + 1} / ${s.questions.length}</span>
      ${difficultyPill(q)}
      <span class="qhead__spacer"></span>
      <button class="chip" id="flag" aria-pressed="${s.flags.has(q.id)}">⚑ ${esc(t('flagForReview'))}</button>
    </div>

    <div class="card">
      <div class="qtext">${esc((q[langKey()] || q.vi).question)}</div>
      ${optionsHtml(q, { mode: 'answerable', picked })}
    </div>

    <div class="qnav">
      <button class="btn" id="prev" ${s.idx === 0 ? 'disabled' : ''}>← ${esc(t('prev'))}</button>
      <button class="btn btn--primary" id="next" ${last ? 'disabled' : ''}>${esc(t('next'))} →</button>
    </div>

    <div class="card" style="margin-top:1rem">
      <h3 class="muted">${esc(t('reviewAnswers'))}</h3>
      <div class="qgrid">
        ${s.questions.map((qq, i) => {
          const cls = ['qgrid__cell'];
          if (s.answers.has(qq.id)) cls.push('qgrid__cell--done');
          if (s.flags.has(qq.id)) cls.push('qgrid__cell--flag');
          if (i === s.idx) cls.push('qgrid__cell--now');
          return `<button type="button" class="${cls.join(' ')}" data-goto="${i}">${i + 1}</button>`;
        }).join('')}
      </div>
    </div>
  `;

  root.querySelectorAll('.opt').forEach((btn) => btn.addEventListener('click', () => {
    const choice = Number(btn.dataset.choice);
    if (s.answers.get(q.id) === choice) s.answers.delete(q.id);
    else s.answers.set(q.id, choice);
    saveLive();
    if (!last && s.answers.has(q.id)) { s.idx += 1; window.scrollTo({ top: 0 }); }
    test.render(root);
  }));

  root.querySelector('#flag').addEventListener('click', () => {
    if (s.flags.has(q.id)) s.flags.delete(q.id); else s.flags.add(q.id);
    saveLive();
    test.render(root);
  });

  root.querySelector('#prev').addEventListener('click', () => { s.idx -= 1; saveLive(); test.render(root); window.scrollTo({ top: 0 }); });
  root.querySelector('#next').addEventListener('click', () => { s.idx += 1; saveLive(); test.render(root); window.scrollTo({ top: 0 }); });
  root.querySelectorAll('[data-goto]').forEach((b) => b.addEventListener('click', () => {
    s.idx = Number(b.dataset.goto); saveLive(); test.render(root); window.scrollTo({ top: 0 });
  }));

  root.querySelector('#submit').addEventListener('click', () => {
    const missing = s.questions.length - s.answers.size;
    if (missing > 0 && !confirm(t('submitConfirm', { n: missing }))) return;
    finish(false);
  });
}

function langKey() { return document.documentElement.dataset.lang || 'vi'; }

/* ── Đồng hồ & lưu bài đang làm ─────────────────────────────────────── */

function startTicker() {
  stopTicker();
  if (!s.deadline) return;
  ticker = setInterval(() => {
    const el = document.getElementById('clock');
    const remain = (s.deadline - Date.now()) / 1000;
    if (remain <= 0) { finish(true); return; }
    if (el) {
      el.textContent = fmtClock(remain);
      el.classList.toggle('testbar__clock--low', remain < 300);
    }
  }, 1000);
}

function stopTicker() { if (ticker) { clearInterval(ticker); ticker = null; } }

function saveLive() {
  if (!s || s.phase !== 'running') return;
  store.setLiveTest({
    bank: s.bankId,
    ids: s.questions.map((q) => q.id),
    answers: Object.fromEntries(s.answers),
    flags: [...s.flags],
    idx: s.idx,
    startedAt: s.startedAt,
    deadline: s.deadline,
    cfg: s.cfg,
  });
}

function finish(timedOut) {
  stopTicker();
  const items = s.questions.map((q) => {
    const chosen = s.answers.has(q.id) ? s.answers.get(q.id) : null;
    const correct = chosen === q.answer;
    if (chosen !== null) store.recordAnswer(q.id, chosen, correct);
    return { id: q.id, topic: q._topic, difficulty: q.difficulty, chosen, correct };
  });

  store.setLastResult({
    bank: s.bankId,
    score: items.filter((i) => i.correct).length,
    total: items.length,
    startedAt: s.startedAt,
    finishedAt: Date.now(),
    timedOut,
    items,
    flags: [...s.flags],
  });
  store.clearLiveTest();
  location.hash = `#/result/${s.bankId}`;
}

export function testInProgress() {
  return !!(s && s.phase === 'running' && s.answers.size > 0);
}

export { pct };
