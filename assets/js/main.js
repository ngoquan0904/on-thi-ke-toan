import { applyStaticLabels, toggleLang, onLangChange, t } from './i18n.js';
import { handleRoute, rerender, currentView } from './router.js';
import { flush } from './store.js';
import { testInProgress } from './views/test.js';

const root = document.getElementById('app');

applyStaticLabels();

// Nút chuyển ngữ nổi: đổi tại chỗ, giữ nguyên mọi trạng thái đang có.
document.getElementById('lang-toggle').addEventListener('click', toggleLang);

onLangChange(() => {
  applyStaticLabels();
  rerender();
});

window.addEventListener('hashchange', handleRoute);

// Phím tắt trên máy tính
document.addEventListener('keydown', (e) => {
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  const tag = document.activeElement?.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA') return;

  if (e.key.toLowerCase() === 'l') { toggleLang(); return; }

  const view = currentView();
  if (view?.onKey) view.onKey(e, root);
});

// Không để mất bài test đang làm dở
window.addEventListener('beforeunload', (e) => {
  flush();
  if (testInProgress()) {
    e.preventDefault();
    e.returnValue = t('leaveWarning');
    return e.returnValue;
  }
});

document.addEventListener('visibilitychange', () => { if (document.hidden) flush(); });

handleRoute();
