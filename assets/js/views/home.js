import { t, pick, lang } from '../i18n.js';
import { loadManifest, loadBankQuestions } from '../data-loader.js';
import * as store from '../store.js';
import { esc, pct } from '../util.js';
import { progressBar } from '../components.js';

let data = null; // [{ bank, stats }]

export const home = {
  crumb: () => '',

  async mount() {
    const manifest = await loadManifest();
    data = [];
    for (const bank of manifest.banks) {
      const questions = await loadBankQuestions(bank.id);
      data.push({ bank, ids: questions.map((q) => q.id), stats: store.statsFor(questions.map((q) => q.id)) });
    }
  },

  render(root) {
    const history = [];
    root.innerHTML = `
      <section class="hero">
        <h1>${esc(t('homeTitle'))}</h1>
        <p class="muted small">${esc(t('homeSub'))}</p>
      </section>

      <div class="stack">
        ${data.map(({ bank, stats }) => {
          const acc = stats.seen ? pct(stats.correct, stats.seen) : 0;
          return `
          <a class="card bankcard" href="#/bank/${esc(bank.id)}">
            <div class="bankcard__head">
              <span class="bankcard__icon">${esc(bank.icon || '📘')}</span>
              <span class="bankcard__name">${esc(pick(bank.label))}</span>
            </div>
            <p class="muted small" style="margin:0">${esc(pick(bank.desc))}</p>
            <div class="statgrid">
              <div class="stat"><span class="stat__num">${stats.total}</span><span class="stat__lbl">${esc(t('questions'))}</span></div>
              <div class="stat"><span class="stat__num">${stats.seen}</span><span class="stat__lbl">${esc(t('done'))}</span></div>
              <div class="stat"><span class="stat__num">${stats.seen ? acc + '%' : '—'}</span><span class="stat__lbl">${esc(t('accuracy'))}</span></div>
            </div>
            <div style="margin-top:.6rem">${progressBar(stats.seen, stats.total)}</div>
            ${stats.wrong ? `<p class="tiny" style="margin:.5rem 0 0;color:var(--bad)">● ${stats.wrong} ${esc(t('wrongCount'))}</p>` : ''}
          </a>`;
        }).join('')}
      </div>

      <p class="tiny muted center" style="margin-top:1.5rem">${esc(t('legalNote'))}</p>
      <div class="center" style="margin-top:.75rem">
        <button class="btn btn--ghost btn--sm" id="btn-reset">${esc(t('resetProgress'))}</button>
      </div>
      ${history.join('')}
    `;

    root.querySelector('#btn-reset').addEventListener('click', () => {
      if (confirm(t('resetConfirm'))) {
        store.resetAll();
        location.reload();
      }
    });
  },
};
