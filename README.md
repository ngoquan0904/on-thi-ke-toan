# Bộ ôn tập thi tuyển Accounting Associate

Bộ đề trắc nghiệm **song ngữ Anh–Việt, 300 câu** kèm web app tĩnh để ôn trên điện thoại.
Chuẩn bị cho bài test năng lực vị trí *Accounting Associate | Global Career Path* — **Acclime Global Services**.

> 🔗 **Link ôn tập:** `https://<github-username>.github.io/<tên-repo>/`
> *(thay bằng link thật sau khi bật GitHub Pages — xem mục “Deploy” bên dưới)*

---

## Nội dung

| | Số câu | Chủ đề |
|---|---|---|
| **Tiếng Anh kế toán** | 100 | 8 chủ đề — thuật ngữ, báo cáo tài chính, ghi sổ kép, AP/AR, thuế & lương, kiểm toán, email với khách hàng và head office, bẫy ngữ pháp |
| **Chuyên môn kế toán** | 200 | 12 chủ đề — **140 câu Việt Nam** (nguyên lý, định khoản, HTK, TSCĐ, doanh thu–chi phí, GTGT, TNDN–TNCN, hóa đơn–lương–BHXH, TT 99/2025) + **60 câu quốc tế** (IFRS/IAS, month-end close, fund administration) |

Mỗi câu có: 4 đáp án · lời giải **cả tiếng Việt và tiếng Anh** · giải thích vì sao từng đáp án khác sai · căn cứ pháp lý (`ref`) với mọi câu về thuế và chế độ kế toán.

> ⚠️ **Nội dung cập nhật theo quy định pháp luật Việt Nam hiệu lực tại 31/08/2026.**
> Khung pháp lý kế toán – thuế vừa thay đổi toàn diện trong 2025–2026, nên **phần lớn ngân hàng câu hỏi miễn phí trên mạng hiện đã lỗi thời**. Xem [`docs/reference-2026.md`](docs/reference-2026.md) — nguồn sự thật duy nhất cho toàn bộ 300 câu, mục 9 là bảng **“Mười điểm dễ bị hỏi mà tài liệu cũ ghi SAI”**, rất đáng đọc lại vào tối trước ngày thi.

## Chức năng

- **Ôn theo chủ đề** — chọn đáp án là biết đúng/sai ngay, kèm lời giải và căn cứ.
- **Chế độ test** — random 50/200 câu (hoặc 30/100 phần tiếng Anh), có đồng hồ, không lộ đáp án khi đang làm; nộp bài xong có điểm, phân tích theo chủ đề và độ khó, xem lại từng câu.
- **Nút chuyển ngữ VI ⇄ EN nổi cố định** — đổi tại chỗ ở mọi màn hình, không mất trạng thái đang làm.
- **Ôn lại câu sai · đánh dấu câu khó · lưu tiến độ** bằng `localStorage`, sống qua việc đóng/mở lại trình duyệt.
- Mobile-first, có chế độ tối, thêm được vào màn hình chính điện thoại như một app.

Phím tắt trên máy tính: `1`–`4` chọn đáp án · `←` `→` chuyển câu · `L` đổi ngôn ngữ · `B` đánh dấu.

## Chạy tại máy

Không có build step, không cần `npm install`. Chỉ cần một static server bất kỳ:

```bash
python3 -m http.server 8000
# rồi mở http://localhost:8000
```

Mở thẳng bằng `file://` sẽ **không chạy** — trình duyệt chặn ES modules và `fetch` ở giao thức này.

## Kiểm tra chất lượng nội dung

```bash
node tools/validate.mjs
```

Validator chặn các lỗi nguy hiểm nhất: thiếu bản dịch, số đáp án VI ≠ EN, `answer` ngoài khoảng, id trùng, thiếu `explanation`, thiếu `ref` ở câu thuế/chế độ kế toán, và cảnh báo các lỗi ra đề làm lộ đáp án (đáp án đúng dài bất thường, lệch vị trí, trùng nội dung, lệch tỷ lệ độ khó).

Trạng thái hiện tại: **300 câu · 0 lỗi · 0 cảnh báo.**

## Thêm hoặc sửa câu hỏi

1. Mở file JSON của chủ đề trong `data/english/` hoặc `data/professional/`.
2. Thêm một phần tử vào mảng `questions` theo đúng lược đồ:

```jsonc
{
  "id": "PRO-B6-016",              // duy nhất trong toàn bộ bộ đề
  "topic": "b6-thue-gtgt",         // trùng id chủ đề trong data/manifest.json
  "difficulty": "intermediate",    // basic | intermediate | advanced
  "answer": 2,                     // chỉ số 0–3, DÙNG CHUNG cho cả VI và EN
  "ref": "Luật GTGT 48/2024/QH15", // bắt buộc với chủ đề b6–b9
  "tags": ["vat"],
  "vi": {
    "question": "...",
    "options": ["...", "...", "...", "..."],
    "explanation": "...",
    "distractors": ["vì sao A sai", "vì sao B sai", null, "vì sao D sai"]
  },
  "en": { "...": "giống hệt cấu trúc trên" }
}
```

**Quy tắc bắt buộc phải giữ:**
- `vi.options` và `en.options` phải **cùng 4 phần tử và cùng thứ tự** — chỉ có một trường `answer` dùng chung, nên lệch thứ tự là sai đáp án ở một ngôn ngữ.
- Phần tử thứ `answer` của `distractors` luôn là `null`.
- Đáp án đúng **không được dài hơn hẳn** các đáp án còn lại, và vị trí đáp án đúng phải rải đều trên A/B/C/D.
- Quy tắc viết đầy đủ: [`docs/content-guidelines.md`](docs/content-guidelines.md).

3. Cập nhật `count` của chủ đề trong `data/manifest.json`.
4. Chạy `node tools/validate.mjs` cho tới khi sạch.
5. **Tăng hằng số `BUILD`** trong `assets/js/data-loader.js` — đây là tham số cache-bust, không tăng thì GitHub Pages vẫn phục vụ file JSON cũ.
6. Commit và push.

## Deploy lên GitHub Pages

```bash
git init && git add -A && git commit -m "feat: bộ ôn tập 300 câu song ngữ"
git branch -M main
git remote add origin https://github.com/<github-username>/<tên-repo>.git
git push -u origin main
```

Sau đó trên GitHub: **Settings → Pages → Source: Deploy from a branch → Branch: `main` / `(root)` → Save.**
Sau 1–2 phút link `https://<github-username>.github.io/<tên-repo>/` sẽ hoạt động.

Lưu ý:
- File `.nojekyll` ở thư mục gốc là **bắt buộc** — không có nó GitHub Pages bỏ qua các file/thư mục bắt đầu bằng `_`.
- Toàn bộ mã nguồn **chỉ dùng đường dẫn tương đối**, để site chạy đúng ở subpath `/<tên-repo>/`. Đừng đổi thành đường dẫn tuyệt đối `/assets/...`.
- Sau khi cập nhật nội dung, mở link ở **chế độ ẩn danh** để chắc chắn thấy bản mới chứ không phải bản cache.

## Cấu trúc thư mục

```
index.html                 shell + nút chuyển ngữ nổi
.nojekyll                  tắt Jekyll của GitHub Pages
assets/css/app.css         mobile-first, sáng/tối theo hệ thống
assets/js/                 main · router · i18n · store · data-loader · components · util
assets/js/views/           home · bank · practice · test · result
data/manifest.json         danh sách 2 bank và 20 chủ đề
data/english/              8 file JSON — 100 câu
data/professional/         12 file JSON — 200 câu
tools/validate.mjs         validator lược đồ + chất lượng ra đề
docs/reference-2026.md     căn cứ pháp lý 2026 — nguồn sự thật duy nhất
docs/content-guidelines.md quy tắc viết câu hỏi và lời giải
plans/                     kế hoạch triển khai theo phase
```
