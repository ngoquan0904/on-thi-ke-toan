import { t, pick } from '../i18n.js';
import { getBank, loadTopic } from '../data-loader.js';
import * as store from '../store.js';
import { esc, pct } from '../util.js';
import { progressBar } from '../components.js';

let bank = null;
let rows = [];   // { meta, ids, stats }
let totals = null;

export const bankView = {
  crumb: () => (bank ? pick(bank.label) : ''),

  async mount({ bankId }) {
    bank = await getBank(bankId);
    if (!bank) return;
    rows = [];
    const allIds = [];
    for (const meta of bank.topics) {
      const qs = await loadTopic(bank.id, meta.id);
      const ids = qs.map((q) => q.id);
      allIds.push(...ids);
      rows.push({ meta, ids, stats: store.statsFor(ids) });
    }
    totals = store.statsFor(allIds);
  },

  render(root) {
    if (!bank) { root.innerHTML = `<div class="empty">${esc(t('notFound'))}</div>`; return; }

    const history = store.getHistory(bank.id);
    const best = history.length ? Math.max(...history.map((h) => pct(h.score, h.total))) : null;

    root.innerHTML = `
      <h1>${esc(pick(bank.label))}</h1>
      <p class="muted small">${esc(pick(bank.desc))}</p>

      <div class="card" style="margin:1rem 0">
        <div class="statgrid">
          <div class="stat"><span class="stat__num">${totals.total}</span><span class="stat__lbl">${esc(t('questions'))}</span></div>
          <div class="stat"><span class="stat__num">${totals.seen}</span><span class="stat__lbl">${esc(t('done'))}</span></div>
          <div class="stat"><span class="stat__num">${totals.seen ? pct(totals.correct, totals.seen) + '%' : '—'}</span><span class="stat__lbl">${esc(t('accuracy'))}</span></div>
        </div>
        <div style="margin-top:.7rem">${progressBar(totals.seen, totals.total)}</div>
        <div class="btnrow" style="margin-top:.9rem">
          <a class="btn btn--primary" href="#/test/${esc(bank.id)}">🎯 ${esc(t('startTest'))}</a>
          <a class="btn" href="#/practice/${esc(bank.id)}/wrong">↻ ${esc(t('reviewWrong'))}${totals.wrong ? ` (${totals.wrong})` : ''}</a>
          <a class="btn" href="#/practice/${esc(bank.id)}/bookmarked">★ ${esc(t('bookmarked'))}</a>
        </div>
        ${history.length > 1 ? `
          <div style="margin-top:1rem">
            <div class="tiny muted">${esc(t('history'))}${best !== null ? ` · ${best}%` : ''}</div>
            <div class="history">
              ${history.map((h) => {
                const p = pct(h.score, h.total);
                return `<div class="history__bar" style="height:${Math.max(6, p)}%" title="${h.score}/${h.total}"><span>${p}%</span></div>`;
              }).join('')}
            </div>
          </div>` : ''}
      </div>

      <h2>${esc(t('study'))}</h2>
      <div class="topiclist">
        ${rows.map(({ meta, stats }) => {
          const acc = stats.seen ? pct(stats.correct, stats.seen) : null;
          return `
          <a class="topicrow" href="#/practice/${esc(bank.id)}/${esc(meta.id)}">
            <div class="topicrow__top">
              <span class="topicrow__name">${esc(pick(meta.label))}</span>
              <span class="topicrow__count">${stats.seen}/${stats.total}</span>
            </div>
            <div class="topicrow__bar">${progressBar(stats.seen, stats.total)}</div>
            <div class="topicrow__stats">
              ${meta.group === 'vn' ? `<span class="pill pill--vn">${esc(t('groupVn'))}</span>` : ''}
              ${meta.group === 'intl' ? `<span class="pill pill--intl">${esc(t('groupIntl'))}</span>` : ''}
              ${acc !== null ? `<span>${acc}% ${esc(t('accuracy'))}</span>` : ''}
              ${stats.wrong ? `<span style="color:var(--bad)">● ${stats.wrong} ${esc(t('wrongCount'))}</span>` : ''}
            </div>
          </a>`;
        }).join('')}
      </div>
    `;
  },
};
