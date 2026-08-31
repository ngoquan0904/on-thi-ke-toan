// Các mảnh giao diện dùng lại giữa chế độ ôn và màn hình xem lại bài test.

import { lang, t } from './i18n.js';
import { esc, LETTERS } from './util.js';

export function side(q) { return q[lang()] || q.vi || q.en || {}; }

export function difficultyPill(q) {
  const d = q.difficulty || 'basic';
  return `<span class="pill pill--${esc(d)}">${esc(t(d))}</span>`;
}

/**
 * Danh sách đáp án.
 * mode: 'answerable' | 'locked' | 'revealed'
 * picked: chỉ số đã chọn (hoặc null)
 */
export function optionsHtml(q, { mode, picked }) {
  const s = side(q);
  return `<div class="options">${(s.options || []).map((text, i) => {
    const classes = ['opt'];
    let disabled = '';
    if (mode === 'revealed') {
      disabled = 'disabled';
      if (i === q.answer) classes.push('opt--right');
      else if (i === picked) classes.push('opt--wrong');
    } else {
      if (i === picked) classes.push('opt--picked');
      if (mode === 'locked') disabled = 'disabled';
    }
    return `<button type="button" class="${classes.join(' ')}" data-choice="${i}" ${disabled}>
      <span class="opt__key">${LETTERS[i]}</span>
      <span class="opt__text">${esc(text)}</span>
    </button>`;
  }).join('')}</div>`;
}

export function verdictHtml(isCorrect) {
  return isCorrect
    ? `<div class="verdict verdict--ok">✔ ${esc(t('correct'))}</div>`
    : `<div class="verdict verdict--bad">✘ ${esc(t('incorrect'))}</div>`;
}

/** Khối lời giải: giải thích + vì sao các đáp án khác sai + căn cứ pháp lý. */
export function explanationHtml(q) {
  const s = side(q);
  const why = Array.isArray(s.distractors)
    ? s.distractors
        .map((d, i) => (i === q.answer || !d ? null : `<li><b>${LETTERS[i]}.</b> ${esc(d)}</li>`))
        .filter(Boolean)
        .join('')
    : '';

  return `<div class="explain">
    <h3>${esc(t('explanation'))}</h3>
    <p>${esc(s.explanation || '')}</p>
    ${why ? `<div class="explain__why"><h3>${esc(t('whyOthers'))}</h3><ul>${why}</ul></div>` : ''}
    ${q.ref ? `<div class="explain__ref"><b>${esc(t('basis'))}:</b> ${esc(q.ref)}</div>` : ''}
  </div>`;
}

export function progressBar(value, total, variant = '') {
  const w = total ? Math.round((value / total) * 100) : 0;
  return `<div class="progress"><div class="progress__fill ${variant}" style="width:${w}%"></div></div>`;
}

export function emptyState(msg, actionHtml = '') {
  return `<div class="empty"><span class="empty__icon">🗒️</span><p>${esc(msg)}</p>${actionHtml}</div>`;
}
