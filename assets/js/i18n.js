// Từ điển giao diện + trạng thái ngôn ngữ toàn cục.
// Nội dung câu hỏi lấy từ q[lang]; file này chỉ lo phần "vỏ" giao diện.

const KEY = 'prep.lang';
const listeners = new Set();

let current = 'vi';
try {
  const saved = localStorage.getItem(KEY);
  if (saved === 'vi' || saved === 'en') current = saved;
} catch { /* chế độ riêng tư: dùng mặc định */ }

export const T = {
  appTitle:        { vi: 'Ôn thi Kế toán',                 en: 'Accounting Prep' },
  homeTitle:       { vi: 'Bộ ôn tập thi tuyển kế toán',    en: 'Accounting recruitment test prep' },
  homeSub:         { vi: 'Chọn phần bạn muốn ôn. Tiến độ được lưu ngay trên thiết bị này.',
                     en: 'Pick a section to study. Your progress is saved on this device.' },
  legalNote:       { vi: 'Nội dung cập nhật theo quy định pháp luật Việt Nam hiệu lực tại 31/08/2026.',
                     en: 'Content reflects Vietnamese regulations in force as at 31 Aug 2026.' },
  questions:       { vi: 'câu',                            en: 'questions' },
  topics:          { vi: 'chủ đề',                         en: 'topics' },
  done:            { vi: 'đã làm',                         en: 'attempted' },
  accuracy:        { vi: 'đúng',                           en: 'accuracy' },
  wrongCount:      { vi: 'đang sai',                       en: 'to review' },
  study:           { vi: 'Ôn theo chủ đề',                 en: 'Study by topic' },
  startTest:       { vi: 'Làm bài test',                   en: 'Take a test' },
  reviewWrong:     { vi: 'Ôn lại câu sai',                 en: 'Review wrong answers' },
  bookmarked:      { vi: 'Câu đã đánh dấu',                en: 'Bookmarked questions' },
  resetProgress:   { vi: 'Xóa toàn bộ tiến độ',            en: 'Clear all progress' },
  resetConfirm:    { vi: 'Xóa toàn bộ tiến độ, câu sai, đánh dấu và lịch sử điểm? Không khôi phục được.',
                     en: 'Clear all progress, wrong answers, bookmarks and score history? This cannot be undone.' },
  backHome:        { vi: 'Về trang chủ',                   en: 'Back to home' },
  shuffle:         { vi: 'Đảo thứ tự câu hỏi',             en: 'Shuffle question order' },
  start:           { vi: 'Bắt đầu',                        en: 'Start' },

  correct:         { vi: 'Chính xác',                      en: 'Correct' },
  incorrect:       { vi: 'Chưa đúng',                      en: 'Not quite' },
  explanation:     { vi: 'Lời giải',                       en: 'Explanation' },
  whyOthers:       { vi: 'Vì sao các đáp án khác sai',     en: 'Why the other options are wrong' },
  basis:           { vi: 'Căn cứ',                         en: 'Reference' },
  next:            { vi: 'Câu tiếp theo',                  en: 'Next question' },
  finishTopic:     { vi: 'Xem tổng kết',                   en: 'See summary' },
  prev:            { vi: 'Câu trước',                      en: 'Previous' },
  bookmark:        { vi: 'Đánh dấu câu này',               en: 'Bookmark this question' },

  topicDone:       { vi: 'Hoàn thành chủ đề',              en: 'Topic complete' },
  yourScore:       { vi: 'Kết quả của bạn',                en: 'Your result' },
  redoWrong:       { vi: 'Làm lại những câu sai',          en: 'Redo the ones you missed' },
  redoAll:         { vi: 'Làm lại từ đầu',                 en: 'Start over' },
  backToTopics:    { vi: 'Về danh sách chủ đề',            en: 'Back to topics' },

  testConfig:      { vi: 'Thiết lập bài test',             en: 'Test setup' },
  numQuestions:    { vi: 'Số câu',                         en: 'Number of questions' },
  timeLimit:       { vi: 'Thời gian',                      en: 'Time limit' },
  noLimit:         { vi: 'Không giới hạn',                 en: 'No limit' },
  minutes:         { vi: 'phút',                           en: 'min' },
  scope:           { vi: 'Phạm vi',                        en: 'Scope' },
  scopeAll:        { vi: 'Toàn bộ',                        en: 'Everything' },
  scopeVn:         { vi: 'Chỉ khối Việt Nam',              en: 'Vietnam topics only' },
  scopeIntl:       { vi: 'Chỉ khối quốc tế',               en: 'International topics only' },
  scopeWrong:      { vi: 'Chỉ câu từng làm sai',           en: 'Previously wrong only' },
  testWarning:     { vi: 'Trong lúc làm bài sẽ không hiện đáp án. Bạn được quay lại sửa câu trước và chỉ biết kết quả sau khi nộp bài.',
                     en: 'No answers are shown while the test is running. You can go back and change answers, and results appear only after you submit.' },
  timeLeft:        { vi: 'Còn lại',                        en: 'Time left' },
  submit:          { vi: 'Nộp bài',                        en: 'Submit' },
  answered:        { vi: 'đã trả lời',                     en: 'answered' },
  flagForReview:   { vi: 'Đánh dấu xem lại',               en: 'Flag for review' },
  submitConfirm:   { vi: 'Còn {n} câu chưa trả lời. Vẫn nộp bài?',
                     en: '{n} question(s) still unanswered. Submit anyway?' },
  timeUp:          { vi: 'Hết giờ — bài đã được nộp tự động.',
                     en: 'Time is up — your test was submitted automatically.' },
  resumeTest:      { vi: 'Bạn có một bài test đang làm dở. Tiếp tục?',
                     en: 'You have a test in progress. Resume it?' },
  leaveWarning:    { vi: 'Bài test đang làm dở sẽ bị mất.',
                     en: 'Your test in progress will be lost.' },

  resultTitle:     { vi: 'Kết quả bài test',               en: 'Test result' },
  timeUsed:        { vi: 'Thời gian làm bài',              en: 'Time used' },
  byTopic:         { vi: 'Phân tích theo chủ đề',          en: 'Breakdown by topic' },
  byDifficulty:    { vi: 'Phân tích theo độ khó',          en: 'Breakdown by difficulty' },
  weakest:         { vi: 'Nên ôn lại trước tiên',          en: 'Study these first' },
  reviewAnswers:   { vi: 'Xem lại từng câu',               en: 'Review each question' },
  filterAll:       { vi: 'Tất cả',                         en: 'All' },
  filterWrong:     { vi: 'Chỉ câu sai',                    en: 'Wrong only' },
  filterFlagged:   { vi: 'Đã đánh dấu',                    en: 'Flagged' },
  yourAnswer:      { vi: 'Bạn chọn',                       en: 'You chose' },
  correctAnswer:   { vi: 'Đáp án đúng',                    en: 'Correct answer' },
  notAnswered:     { vi: 'Chưa trả lời',                   en: 'Not answered' },
  addWrongToReview:{ vi: 'Đưa câu sai vào danh sách ôn lại', en: 'Add wrong answers to review list' },
  addedToReview:   { vi: 'Đã thêm vào danh sách ôn lại',   en: 'Added to your review list' },
  retakeTest:      { vi: 'Làm bài test khác',              en: 'Take another test' },
  history:         { vi: 'Lịch sử điểm',                   en: 'Score history' },

  emptyWrong:      { vi: 'Chưa có câu nào sai. Hãy ôn theo chủ đề hoặc làm một bài test trước.',
                     en: 'No wrong answers yet. Study a topic or take a test first.' },
  emptyBookmark:   { vi: 'Bạn chưa đánh dấu câu nào. Bấm ngôi sao ở góc câu hỏi để đánh dấu.',
                     en: 'No bookmarks yet. Tap the star on a question to bookmark it.' },
  emptyTopic:      { vi: 'Chủ đề này chưa có câu hỏi.',    en: 'This topic has no questions yet.' },
  loadError:       { vi: 'Không tải được dữ liệu.',        en: 'Could not load the data.' },
  retry:           { vi: 'Thử lại',                        en: 'Retry' },
  notFound:        { vi: 'Không tìm thấy trang này.',      en: 'Page not found.' },

  basic:           { vi: 'Cơ bản',                         en: 'Basic' },
  intermediate:    { vi: 'Trung bình',                     en: 'Intermediate' },
  advanced:        { vi: 'Nâng cao',                       en: 'Advanced' },
  groupVn:         { vi: 'Việt Nam',                       en: 'Vietnam' },
  groupIntl:       { vi: 'Quốc tế',                        en: 'International' },
};

export function lang() { return current; }

export function t(key, vars) {
  const entry = T[key];
  let s = entry ? (entry[current] ?? entry.vi) : key;
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.replace(`{${k}}`, v);
  return s;
}

/** Lấy nội dung theo ngôn ngữ hiện tại từ một object {vi, en}. */
export function pick(obj) {
  if (!obj) return '';
  return obj[current] ?? obj.vi ?? obj.en ?? '';
}

export function setLang(next) {
  if (next !== 'vi' && next !== 'en') return;
  if (next === current) return;
  current = next;
  document.documentElement.dataset.lang = next;
  document.documentElement.lang = next;
  try { localStorage.setItem(KEY, next); } catch { /* bỏ qua */ }
  for (const fn of listeners) fn(next);
}

export function toggleLang() { setLang(current === 'vi' ? 'en' : 'vi'); }

/** Đăng ký hàm chạy lại khi đổi ngôn ngữ. Trả về hàm hủy đăng ký. */
export function onLangChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function applyStaticLabels() {
  document.documentElement.dataset.lang = current;
  document.documentElement.lang = current;
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
}
