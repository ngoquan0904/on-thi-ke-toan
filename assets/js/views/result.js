import { t, pick, lang } from '../i18n.js';
import { getBank, loadBankQuestions } from '../data-loader.js';
import * as store from '../store.js';
import { esc, pct, fmtDuration, LETTERS } from '../util.js';
import { optionsHtml, explanationHtml, progressBar } from '../components.js';

let s = null;

export const result = {
  crumb: () => (s?.bank ? pick(s.bank.label) : ''),

  async mount({ bankId }) {
    const r = store.getLastResult();
    if (!r || r.bank !== bankId) { s = null; return; }
    const bank = await getBank(bankId);
    const all = await loadBankQuestions(bankId);
    const byId = new Map(all.map((q) => [q.id, q]));
    s = { bankId, bank, r, byId, filter: 'all' };
  },

  render(root) {
    if (!s) {
      root.innerHTML = `<div class="empty"><p>${esc(t('notFound'))}</p>
        <a class="btn" href="#/">${esc(t('backHome'))}</a></div>`;
      return;
    }

    const { r, bank, byId } = s;
    const topics = new Map(bank.topics.map((tp) => [tp.id, tp]));

    // Gộp theo chủ đề
    const byTopic = new Map();
    for (const it of r.items) {
      const g = byTopic.get(it.topic) || { n: 0, ok: 0 };
      g.n += 1; if (it.correct) g.ok += 1;
      byTopic.set(it.topic, g);
    }
    const topicRows = [...byTopic.entries()]
      .map(([id, g]) => ({ id, label: pick(topics.get(id)?.label) || id, ...g, p: pct(g.ok, g.n) }))
      .sort((a, b) => a.p - b.p);

    // Gộp theo độ khó
    const byDiff = new Map();
    for (const it of r.items) {
      const g = byDiff.get(it.difficulty) || { n: 0, ok: 0 };
      g.n += 1; if (it.correct) g.ok += 1;
      byDiff.set(it.difficulty, g);
    }

    const weakest = topicRows.filter((x) => x.p < 100).slice(0, 3);
    const shown = r.items.filter((it) => {
      if (s.filter === 'wrong') return !it.correct;
      if (s.filter === 'flagged') return r.flags.includes(it.id);
      return true;
    });

    const p = pct(r.score, r.total);
    const variant = p >= 80 ? 'progress__fill--ok' : p >= 50 ? '' : 'progress__fill--bad';

    root.innerHTML = `
      <div class="card">
        ${r.timedOut ? `<div class="notice notice--warn" style="margin-bottom:.8rem">${esc(t('timeUp'))}</div>` : ''}
        <div class="score">
          <div class="tiny muted">${esc(t('resultTitle'))} · ${esc(pick(bank.label))}</div>
          <div class="score__big">${r.score}<span style="font-size:1.4rem;color:var(--muted)">/${r.total}</span></div>
          <div class="score__pct">${p}%</div>
        </div>
        ${progressBar(r.score, r.total, variant)}
        <p class="tiny muted center" style="margin-top:.6rem">${esc(t('timeUsed'))}: ${esc(fmtDuration(r.finishedAt - r.startedAt, lang()))}</p>
        <div class="btnrow" style="margin-top:.5rem">
          <a class="btn btn--primary" href="#/test/${esc(s.bankId)}">${esc(t('retakeTest'))}</a>
          <button class="btn" id="add-wrong">${esc(t('addWrongToReview'))}</button>
          <a class="btn btn--ghost" href="#/bank/${esc(s.bankId)}">${esc(t('backToTopics'))}</a>
        </div>
      </div>

      <div class="card" style="margin-top:.75rem">
        <h2>${esc(t('byTopic'))}</h2>
        <div class="breakdown">
          ${topicRows.map((x) => `
            <div class="brow">
              <span class="brow__name">${esc(x.label)}</span>
              <span class="brow__num">${x.ok}/${x.n} · ${x.p}%</span>
              <div class="brow__bar">${progressBar(x.ok, x.n, x.p >= 80 ? 'progress__fill--ok' : x.p < 50 ? 'progress__fill--bad' : '')}</div>
            </div>`).join('')}
        </div>
      </div>

      <div class="card" style="margin-top:.75rem">
        <h2>${esc(t('byDifficulty'))}</h2>
        <div class="breakdown">
          ${['basic', 'intermediate', 'advanced'].filter((d) => byDiff.has(d)).map((d) => {
            const g = byDiff.get(d);
            const q = pct(g.ok, g.n);
            return `<div class="brow">
              <span class="brow__name">${esc(t(d))}</span>
              <span class="brow__num">${g.ok}/${g.n} · ${q}%</span>
              <div class="brow__bar">${progressBar(g.ok, g.n, q >= 80 ? 'progress__fill--ok' : q < 50 ? 'progress__fill--bad' : '')}</div>
            </div>`;
          }).join('')}
        </div>
      </div>

      ${weakest.length ? `
        <div class="card" style="margin-top:.75rem">
          <h2>${esc(t('weakest'))}</h2>
          <div class="btnrow">
            ${weakest.map((x) => `<a class="btn btn--sm" href="#/practice/${esc(s.bankId)}/${esc(x.id)}">${esc(x.label)} · ${x.p}%</a>`).join('')}
          </div>
        </div>` : ''}

      <div class="card" style="margin-top:.75rem">
        <h2>${esc(t('reviewAnswers'))}</h2>
        <div class="filterrow">
          <button class="chip" data-filter="all" aria-pressed="${s.filter === 'all'}">${esc(t('filterAll'))} (${r.items.length})</button>
          <button class="chip" data-filter="wrong" aria-pressed="${s.filter === 'wrong'}">${esc(t('filterWrong'))} (${r.items.filter((i) => !i.correct).length})</button>
          <button class="chip" data-filter="flagged" aria-pressed="${s.filter === 'flagged'}">${esc(t('filterFlagged'))} (${r.flags.length})</button>
        </div>
        ${shown.map((it, i) => {
          const q = byId.get(it.id);
          if (!q) return '';
          const sideQ = q[lang()] || q.vi;
          return `<div class="reviewitem">
            <div class="tiny muted">${i + 1}. ${esc(q.id)} ${it.correct ? '<span style="color:var(--ok)">✔</span>' : '<span style="color:var(--bad)">✘</span>'}</div>
            <div class="qtext" style="font-size:.95rem;margin:.3rem 0 .6rem">${esc(sideQ.question)}</div>
            ${optionsHtml(q, { mode: 'revealed', picked: it.chosen })}
            <p class="tiny muted" style="margin:.5rem 0 0">
              ${esc(t('yourAnswer'))}: <b>${it.chosen === null ? esc(t('notAnswered')) : LETTERS[it.chosen]}</b> ·
              ${esc(t('correctAnswer'))}: <b>${LETTERS[q.answer]}</b>
            </p>
            ${explanationHtml(q)}
          </div>`;
        }).join('')}
      </div>
    `;

    root.querySelectorAll('[data-filter]').forEach((b) => b.addEventListener('click', () => {
      s.filter = b.dataset.filter;
      result.render(root);
    }));

    root.querySelector('#add-wrong').addEventListener('click', (e) => {
      r.items.filter((it) => !it.correct).forEach((it) => store.markWrong(it.id));
      e.currentTarget.textContent = t('addedToReview');
      e.currentTarget.disabled = true;
    });
  },
};
