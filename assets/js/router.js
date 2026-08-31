import { t } from './i18n.js';
import { esc } from './util.js';
import { home } from './views/home.js';
import { bankView } from './views/bank.js';
import { practice } from './views/practice.js';
import { test } from './views/test.js';
import { result } from './views/result.js';

const root = document.getElementById('app');
const crumbEl = document.getElementById('crumb');
const backBtn = document.getElementById('btn-back');

let current = null;

const ROUTES = [
  [/^\/?$/,                                  () => ({ view: home, params: {} })],
  [/^\/bank\/([\w-]+)$/,                     (m) => ({ view: bankView, params: { bankId: m[1] } })],
  [/^\/practice\/([\w-]+)\/([\w-]+)$/,       (m) => ({ view: practice, params: { bankId: m[1], source: m[2] } })],
  [/^\/test\/([\w-]+)$/,                     (m) => ({ view: test, params: { bankId: m[1] } })],
  [/^\/result\/([\w-]+)$/,                   (m) => ({ view: result, params: { bankId: m[1] } })],
];

function parse() {
  const path = location.hash.replace(/^#/, '') || '/';
  for (const [re, build] of ROUTES) {
    const m = path.match(re);
    if (m) return build(m);
  }
  return null;
}

export function currentView() { return current?.view || null; }

export async function handleRoute() {
  const match = parse();

  if (current?.view?.unmount) current.view.unmount();

  if (!match) {
    current = null;
    root.innerHTML = `<div class="empty"><span class="empty__icon">🧭</span><p>${esc(t('notFound'))}</p>
      <a class="btn" href="#/">${esc(t('backHome'))}</a></div>`;
    updateChrome();
    return;
  }

  root.innerHTML = '<div class="loading"><span class="spinner"></span></div>';
  current = match;

  try {
    await match.view.mount(match.params);
    // Người dùng có thể đã điều hướng tiếp trong lúc chờ nạp dữ liệu
    if (current !== match) return;
    match.view.render(root);
  } catch (e) {
    console.error(e);
    root.innerHTML = `<div class="empty"><span class="empty__icon">⚠️</span>
      <p>${esc(t('loadError'))}</p>
      <p class="tiny muted">${esc(e.message || '')}</p>
      <button class="btn" onclick="location.reload()">${esc(t('retry'))}</button></div>`;
  }
  updateChrome();
  window.scrollTo({ top: 0 });
}

/** Vẽ lại màn hình hiện tại mà không nạp lại dữ liệu — dùng khi đổi ngôn ngữ. */
export function rerender() {
  if (!current) return;
  const y = window.scrollY;
  current.view.render(root);
  updateChrome();
  window.scrollTo({ top: y });
}

function updateChrome() {
  const isHome = (location.hash.replace(/^#/, '') || '/') === '/';
  backBtn.hidden = isHome;
  crumbEl.textContent = current?.view?.crumb ? current.view.crumb() : '';
}

backBtn.addEventListener('click', () => history.back());
