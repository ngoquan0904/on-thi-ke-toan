# Phase 1 — Khởi tạo repo, lược đồ dữ liệu & validator

**Mục tiêu:** Dựng bộ khung thư mục, chốt schema JSON, và viết validator TRƯỚC khi có nội dung — để mọi câu hỏi sinh ra sau đó đều được kiểm tra tự động ngay từ câu đầu tiên.

**Ước lượng:** 1h · **Phụ thuộc:** không · **Chặn:** Phase 2

---

## 1.1 Khởi tạo

```bash
cd "d:/Projects/Thùy Dương"
git init
mkdir -p assets/css assets/js/views data/english data/professional tools docs
touch .nojekyll
```

`.gitignore`:
```
.DS_Store
Thumbs.db
node_modules/
*.log
```

> **Lưu ý:** thư mục `plans/` và `docs/` **được commit** — chúng là tài liệu của dự án, và việc public chúng không có gì nhạy cảm.

## 1.2 `data/manifest.json`

Nguồn khai báo duy nhất về cấu trúc bộ đề. App đọc file này, không hardcode topic ở đâu khác.

```json
{
  "version": "1.0.0",
  "updatedAt": "2026-08-31",
  "banks": [
    {
      "id": "english",
      "label": { "vi": "Tiếng Anh kế toán", "en": "Accounting English" },
      "desc": { "vi": "100 câu thuật ngữ & tiếng Anh chuyên ngành", "en": "100 questions on terminology & professional English" },
      "testSize": 30,
      "testMinutes": 30,
      "topics": [
        { "id": "a1-core-terminology", "file": "english/a1-core-terminology.json", "count": 15,
          "label": { "vi": "Thuật ngữ nền tảng & phương trình kế toán", "en": "Core terminology & accounting equation" } }
      ]
    },
    {
      "id": "professional",
      "label": { "vi": "Chuyên môn kế toán", "en": "Accounting Knowledge" },
      "desc": { "vi": "200 câu nghiệp vụ, thuế, chuẩn mực", "en": "200 questions on bookkeeping, tax and standards" },
      "testSize": 50,
      "testMinutes": 60,
      "topics": [
        { "id": "b1-nguyen-ly", "file": "professional/b1-nguyen-ly.json", "count": 25, "group": "vn",
          "label": { "vi": "Nguyên lý kế toán & ghi sổ kép", "en": "Accounting principles & double entry" } }
      ]
    }
  ]
}
```

Trường `group` (`vn` | `intl`) dùng cho thống kê tỷ lệ 70/30 và cho phép lọc khi ôn.

## 1.3 File topic mẫu

`data/professional/b1-nguyen-ly.json`:
```json
{
  "topic": "b1-nguyen-ly",
  "questions": [ { /* theo schema ở plan.md mục 6 */ } ]
}
```

**Quy ước `id`:** `<BANK>-<TOPIC>-<3 chữ số>` — ví dụ `PRO-B1-001`, `ENG-A3-014`. Không bao giờ đánh lại số khi xóa câu (id đã lưu trong localStorage của tiến độ).

## 1.4 `tools/validate.mjs`

Node thuần, không dependency. Chạy: `node tools/validate.mjs`

**Kiểm tra bắt buộc (lỗi → exit code 1):**

| # | Luật kiểm tra |
|---|---|
| V1 | Mọi file khai trong manifest đều tồn tại và parse được JSON |
| V2 | `id` duy nhất toàn cục; đúng định dạng quy ước |
| V3 | `topic` trong câu hỏi khớp `topic` của file và khớp id topic trong manifest |
| V4 | Có đủ cả `vi` và `en`; mỗi khối có `question`, `options`, `explanation` không rỗng |
| V5 | `vi.options.length === en.options.length === 4` |
| V6 | `answer` là số nguyên trong `[0, 3]` |
| V7 | Nếu có `distractors`: độ dài = 4, phần tử tại vị trí `answer` là `null`, các vị trí còn lại là chuỗi không rỗng |
| V8 | `difficulty ∈ {basic, intermediate, advanced}` |
| V9 | Câu thuộc topic b6/b7/b8/b9 **bắt buộc** có `ref` không rỗng |
| V10 | Số câu thực tế của mỗi topic khớp `count` trong manifest |

**Cảnh báo (không chặn, nhưng phải xử lý trước khi kết thúc Phase 8):**

| # | Luật cảnh báo |
|---|---|
| W1 | Đáp án đúng dài hơn 1,4× độ dài trung bình các đáp án còn lại (lộ đáp án) |
| W2 | Phân bố vị trí đáp án đúng lệch quá 35% ở một vị trí trong phạm vi một topic |
| W3 | Hai câu có `vi.question` giống nhau trên 85% (trùng lặp nội dung) |
| W4 | `explanation` ngắn hơn 80 ký tự (giải thích hời hợt) |
| W5 | Tỷ lệ độ khó lệch xa mốc 50/35/15 |

**Đầu ra chuẩn của validator:**
```
✔ english      100/100 câu  · 8 topic  · 0 lỗi · 2 cảnh báo
✔ professional 200/200 câu  · 12 topic · 0 lỗi · 0 cảnh báo
  → VN 140 (70,0%) · Quốc tế 60 (30,0%)
  → basic 149 · intermediate 106 · advanced 45
```

## 1.5 Seed nội dung để phát triển

Viết **10 câu mẫu song ngữ hoàn chỉnh** (5 cho mỗi bank) ngay ở phase này để Phase 2–3 có dữ liệu thật mà chạy. Các câu này sau đó **giữ lại và tính vào tổng**, không bỏ đi.

## Kiểm tra hoàn thành Phase 1

- [x] `git init` xong, `.nojekyll` và `.gitignore` tồn tại
- [x] `data/manifest.json` khai đủ 2 bank / 20 topic với `count` mục tiêu
- [x] `node tools/validate.mjs` chạy được và báo đúng trạng thái (thiếu file = báo lỗi rõ ràng, không crash)
- [x] 10 câu seed song ngữ đã qua validator không lỗi
