# Phase 2 — Lõi web app: router, chuyển ngữ, chế độ ôn theo topic

**Mục tiêu:** App chạy được đầy đủ chức năng ôn tập với dữ liệu seed. Đây là phần "trải nghiệm HTML" mà bạn yêu cầu.

**Ước lượng:** 2,5–3h · **Phụ thuộc:** Phase 1 · **Chặn:** Phase 3

---

## 2.1 Điều hướng (hash router)

Dùng hash để GitHub Pages không cần cấu hình rewrite.

| Route | Màn hình |
|---|---|
| `#/` | Trang chủ — 2 thẻ lớn: Tiếng Anh kế toán / Chuyên môn kế toán |
| `#/bank/english` · `#/bank/professional` | Danh sách topic của một phần + nút "Làm bài test" + nút "Ôn lại câu sai" |
| `#/practice/:bank/:topic` | Chế độ ôn theo topic |
| `#/practice/:bank/wrong` | Ôn lại các câu đã trả lời sai |
| `#/practice/:bank/bookmarked` | Ôn các câu đã đánh dấu |
| `#/test/:bank` | Đang làm bài test |
| `#/result/:bank` | Kết quả bài test vừa nộp + xem lại từng câu |

## 2.2 Nút chuyển ngữ nổi cố định (yêu cầu D1)

**Hành vi:**
- `position: fixed`, góc **dưới–phải**, `bottom: 16px; right: 16px` — trong tầm ngón cái khi cầm điện thoại, tránh vùng thanh địa chỉ trình duyệt.
- Dạng viên thuốc 2 nửa `VI | EN`, nửa đang chọn được tô nền. Click/chạm bất kỳ đâu trên nút = đổi ngôn ngữ.
- `z-index` cao hơn mọi thứ; có `backdrop-filter: blur()` + nền bán trong để không che mất chữ phía dưới.
- **Luôn hiển thị khi scroll** — không ẩn, không thu nhỏ.
- Kích thước tối thiểu 44×44px (chuẩn vùng chạm).
- `aria-label` mô tả rõ, `aria-pressed` cho trạng thái.

**Kỹ thuật:** đặt `lang` hiện tại vào `document.documentElement.dataset.lang`. Khi đổi:
1. Ghi vào `localStorage` (key `prep.lang`).
2. Phát sự kiện `langchange`.
3. Mỗi view đang mở **render lại phần nội dung tại chỗ** từ cùng đối tượng câu hỏi, **giữ nguyên**: câu đang ở, đáp án đã chọn, trạng thái đã hiện lời giải hay chưa, vị trí scroll, đồng hồ đang chạy trong bài test.

> Cách làm đúng: view giữ **state** (`currentIndex`, `selected`, `revealed`) tách khỏi **markup**. Đổi ngôn ngữ chỉ vẽ lại markup từ state + `q[lang]`. Không được reload trang, không được reset state.

Giao diện (nhãn nút, tiêu đề, thông báo) lấy từ `assets/js/i18n.js` — một object phẳng `{ key: { vi, en } }`.

## 2.3 `store.js` — localStorage

Một key gốc duy nhất `prep.v1` chứa JSON:

```js
{
  lang: "vi",
  progress: {
    "PRO-B1-001": { seen: 3, correct: 2, lastAnswer: 0, lastAt: 1756... , wrong: false }
  },
  bookmarks: ["PRO-B6-004", "ENG-A8-002"],
  lastTest: { bank: "professional", ids: [...], answers: {...}, startedAt, finishedAt, score }
}
```

Nguyên tắc:
- Ghi **debounce 300ms**, không ghi mỗi lần gõ.
- Bọc `try/catch` quanh mọi thao tác đọc/ghi — chế độ riêng tư của trình duyệt có thể ném lỗi. Lỗi thì app vẫn chạy, chỉ mất tính năng lưu.
- Có nút **"Xóa toàn bộ tiến độ"** trong trang chủ, hỏi xác nhận trước.
- `wrong: true` khi lần trả lời gần nhất sai → là nguồn cho màn hình "Ôn lại câu sai". Trả lời đúng lại thì gỡ cờ.

## 2.4 Chế độ ôn theo topic (yêu cầu cốt lõi)

Luồng một câu:

1. Hiện **số thứ tự / tổng**, thanh tiến trình, nhãn độ khó, nút bookmark.
2. Hiện câu hỏi + 4 đáp án dạng nút lớn (mobile: xếp dọc, full width, tối thiểu 48px chiều cao).
3. **Chọn xong một đáp án:**
   - Khóa các đáp án lại (không cho đổi — mô phỏng thi thật).
   - Đáp án đúng: viền + nền xanh, icon ✔. Đáp án đã chọn nếu sai: viền + nền đỏ, icon ✘.
   - Hiện banner **"Chính xác"** / **"Chưa đúng"** ngay đầu khối lời giải.
   - Hiện **lời giải** (`explanation`), rồi **lý do sai của từng đáp án nhiễu** (`distractors`), rồi **căn cứ pháp lý** (`ref`) trong khối nhỏ có nền khác biệt.
   - Ghi kết quả vào store.
   - Hiện nút **"Câu tiếp theo"** (và tự cuộn tới phần lời giải).
4. Hết topic → màn hình tổng kết topic: đúng/tổng, danh sách câu sai kèm link nhảy thẳng vào từng câu, nút "Làm lại chỉ những câu sai".

**Tùy chọn ở đầu topic:** đảo thứ tự câu (mặc định bật), đảo thứ tự đáp án (mặc định **tắt** — vì lời giải `distractors` gắn theo vị trí; nếu bật thì phải hoán vị `distractors` cùng lúc với `options` và cập nhật `answer` tương ứng).

## 2.5 Giao diện

- **Mobile-first**, breakpoint duy nhất ở 720px cho màn hình lớn.
- Cỡ chữ thân bài tối thiểu 16px (tránh iOS tự zoom), dòng cao 1.6 — bạn sẽ đọc rất nhiều chữ.
- Sáng/tối theo `prefers-color-scheme`, định nghĩa màu bằng CSS custom properties.
- Không dùng thư viện ngoài, không webfont — dùng font hệ thống để tải tức thì và hiển thị tiếng Việt chuẩn.
- Hỗ trợ phím tắt trên desktop: `1–4` chọn đáp án, `Enter`/`→` câu tiếp, `L` đổi ngôn ngữ, `B` bookmark.
- `prefers-reduced-motion` → tắt animation.

## 2.6 `data-loader.js`

- `fetch('data/manifest.json?v=' + BUILD)` — `BUILD` là hằng số chuỗi cập nhật thủ công (hoặc `Date.now()` khi chạy local) để phá cache GitHub Pages.
- Nạp topic **theo yêu cầu** (khi vào một topic), cache trong `Map` của phiên làm việc.
- Chế độ test cần cả bank → `Promise.all` toàn bộ topic của bank đó.
- Có màn hình lỗi rõ ràng nếu fetch hỏng (mất mạng / sai đường dẫn), kèm nút thử lại.

## Kiểm tra hoàn thành Phase 2

- [x] Mở `index.html` qua server tĩnh local (`npx serve` hoặc `python -m http.server`) chạy được toàn bộ luồng ôn
- [x] Nút chuyển ngữ hiện ở mọi màn hình, luôn thấy khi scroll, đổi ngôn ngữ **không mất** đáp án đã chọn và lời giải đang mở
- [x] Chọn đáp án → phản hồi đúng/sai + lời giải + lý do đáp án sai + `ref` hiện đầy đủ
- [x] Đóng tab, mở lại → tiến độ và ngôn ngữ vẫn còn
- [x] Kiểm tra trên chiều rộng 360px không bị tràn ngang
