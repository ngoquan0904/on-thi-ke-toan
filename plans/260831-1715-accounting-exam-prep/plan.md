---
title: Bộ ôn tập thi tuyển Accounting Associate — Acclime Global Services
slug: accounting-exam-prep
created: 2026-08-31
status: in-progress
progress: 8.5/9 phase — nội dung & app hoàn tất, còn bước deploy công khai
updated: 2026-08-31
owner: duongcinhtom
blockedBy: []
blocks: []
tags: [content-authoring, static-web, github-pages, accounting, vietnam-2026]
---

# Bộ ôn tập thi tuyển Accounting Associate — Acclime Global Services

## 0. Trạng thái thực thi (cập nhật 31/08/2026)

**Hoàn tất Phase 0 → 8, trừ bước deploy công khai.**

| Hạng mục | Trạng thái |
|---|---|
| Nội dung | **300/300 câu** — 100 tiếng Anh (8 topic) + 200 chuyên môn (12 topic), tỷ lệ **140 VN / 60 quốc tế = 70,0% / 30,0%** |
| Validator | `node tools/validate.mjs` → **300 câu · 0 lỗi · 0 cảnh báo** |
| Độ khó | basic 146 · intermediate 109 · advanced 45 (≈ 49% / 36% / 15%) |
| Web app | Đủ chức năng trong scope; **47 kiểm thử trình duyệt tự động đều đạt** (30 luồng chung + 17 riêng cho engine bài test) |
| Rà soát nội dung | 49 câu thuế/chế độ (B6–B9) đối chiếu tay với `docs/reference-2026.md`; 35 câu có phép tính tính lại tay; 100 câu tiếng Anh đọc soát trọn vẹn; 340 cặp đáp án VI/EN đối chiếu số liệu |
| Repo | `git init` xong, 1 commit, cây làm việc sạch |
| **Còn lại** | **Push lên GitHub và bật Pages** — cần *GitHub username* và *tên repo* để chốt URL. Sau đó điền link vào `README.md` và tick nốt các mục còn mở ở phase 4 / 8 / DoD |

**Ghi chú QA — đã xử lý:** khi rà mobile phát hiện nút chuyển ngữ nổi (pill 87×44) nằm chồng lên tâm nút "Câu tiếp theo" ở 360×640 và lên ô lưới điều hướng ở 412×915. Đã đổi thành **nút tròn 44×44 chỉ hiện ngôn ngữ sẽ chuyển sang** (`.langfab` trong `assets/css/app.css`). Đo lại ở 320×568 · 360×640 · 360×740 · 390×800 · 412×915 · 768×1024: không còn nút thao tác chính nào bị che.


## 1. Bối cảnh & Mục tiêu

**Bối cảnh.** Đã qua vòng CV vị trí *Accounting Associate | Global Career Path* tại **Công ty TNHH Acclime Global Services** (Level 8, Hoa Binh International Towers, 106 Hoàng Quốc Việt, Cầu Giấy, Hà Nội). Vòng tiếp theo: **bài test năng lực chuyên môn**. Vị trí không yêu cầu kinh nghiệm nhưng yêu cầu bằng cấp kế toán/kiểm toán/tài chính, thành thạo tiếng Anh nói–viết, thành thạo phần mềm kế toán + MS Office.

**Đặc thù công việc suy ra từ JD** (quyết định trọng số nội dung):

- *Financial outsourcing services*: **bookkeeping** (ghi sổ, đóng sổ tháng) và **fund administration** (quản trị quỹ).
- *"Ensure deliverables to the head office meet quality and timeline standards"* → làm việc với **head office nước ngoài**, báo cáo tiếng Anh, có yếu tố chuẩn mực quốc tế.
- *"Liaise with clients"* → giao tiếp email tiếng Anh với khách hàng.
- Ưu tiên ACCA/CPA → đề có thể chạm tới **IFRS**, không chỉ VAS.

**Mục tiêu.** Xây dựng bộ ôn tập trắc nghiệm 300 câu **song ngữ Anh–Việt** + web app tĩnh, deploy **GitHub Pages** thành link public, ôn được trên điện thoại mọi lúc.

## 2. Phát hiện quan trọng từ research (ảnh hưởng trực tiếp tới nội dung)

> **Hầu hết ngân hàng câu hỏi kế toán miễn phí trên mạng Việt Nam hiện đã LỖI THỜI.** Khung pháp lý kế toán – thuế Việt Nam vừa thay đổi toàn diện trong 2025–2026. Nếu ôn theo tài liệu cũ, bạn sẽ trả lời sai đúng những câu mà nhà tuyển dụng — một công ty dịch vụ kế toán chuyên nghiệp — chắc chắn đang cập nhật.

| Lĩnh vực | Quy định CŨ | Quy định MỚI đang hiệu lực (tại 31/08/2026) |
|---|---|---|
| Chế độ kế toán DN | TT 200/2014/TT-BTC | **TT 99/2025/TT-BTC** (ban hành 27/10/2025, hiệu lực **01/01/2026**) — thêm TK **215** Tài sản sinh học, TK **8213** Chi phí thuế TNDN bổ sung tối thiểu toàn cầu (GloBE 15%), quy định lại đồng tiền kế toán, mở rộng thuyết minh, có mẫu BCTC cho DN không hoạt động liên tục |
| Thuế GTGT | Luật 13/2008 + sửa đổi | **Luật GTGT 48/2024/QH15** (hiệu lực **01/07/2025**) + NĐ 181/2025 — **bỏ ngưỡng 20 triệu**, yêu cầu chứng từ thanh toán không dùng tiền mặt từ **5 triệu đồng**; giảm 10% → **8%** đến 31/12/2026; phân bón/máy nông nghiệp/tàu cá chuyển từ không chịu thuế sang **5%** |
| Thuế TNDN | Luật 14/2008 + 32/2013 | **Luật TNDN 67/2025/QH15** (hiệu lực **01/10/2025**, áp dụng từ kỳ tính thuế 2025) — thêm bậc **15%** (doanh thu ≤ 3 tỷ) và **17%** (3–50 tỷ), giữ **20%** phổ thông |
| Thuế TNCN | NQ 954/2020 (11tr / 4,4tr) | **NQ 110/2025/UBTVQH15** — giảm trừ bản thân **15,5 triệu/tháng**, người phụ thuộc **6,2 triệu/tháng**, áp dụng từ kỳ tính thuế **2026** |
| Hóa đơn | NĐ 123/2020 | NĐ 123/2020 **sửa đổi bởi NĐ 70/2025/NĐ-CP** (hiệu lực **01/06/2025**) — thời điểm lập hóa đơn theo từng loại giao dịch, quy tắc hóa đơn điều chỉnh vs thay thế |
| IFRS | Tự nguyện | **Bắt buộc từ năm tài chính 2026** với BCTC hợp nhất của DNNN lớn, công ty niêm yết, công ty đại chúng lớn (Quyết định 345/QĐ-BTC). DN FDI vẫn tự nguyện cho BCTC riêng |

**Hệ quả cho bộ đề:** nội dung phải viết trên nền **2026**, mỗi câu thuế/chế độ kế toán **bắt buộc trích dẫn căn cứ pháp lý**, và có riêng một topic *"TT 99/2025 — thay đổi so với TT 200"*, vì đây chính là điểm nóng mà một hãng dịch vụ kế toán đang phải đào tạo lại toàn bộ nhân sự.

*Lưu ý cân bằng:* trường đại học vẫn dạy TT 200 và người chấm bài có thể vẫn nói theo hệ tài khoản TT 200. Vì vậy phần định khoản **chỉ dùng nghiệp vụ mà hai thông tư giống nhau**, còn mọi khác biệt được đánh dấu rõ trong lời giải bằng nhãn `TT200 → TT99`.

## 3. Quyết định đã chốt với người dùng

| # | Quyết định | Giá trị |
|---|---|---|
| D1 | Ngôn ngữ | **Song ngữ đầy đủ**: câu hỏi, 4 đáp án và lời giải đều có bản VI và EN. Nút chuyển ngữ **nổi cố định (sticky) trên màn hình khi scroll**, click là đổi toàn bộ giao diện + nội dung tại chỗ, không mất trạng thái đang làm |
| D2 | Trọng số 200 câu chuyên môn | **70% Việt Nam (140 câu) / 30% quốc tế (60 câu)** |
| D3 | Deploy | GitHub Pages, tài khoản GitHub **đã có** (cần username lúc thực thi để chốt URL) |
| D4 | Thời gian | **Trên 1 tuần** → làm đầy đủ, có bước đối chiếu văn bản pháp luật và QA |

## 4. Quyết định kỹ thuật (tôi chốt, theo KISS/YAGNI)

| Hạng mục | Chọn | Lý do |
|---|---|---|
| Stack | **HTML + CSS + Vanilla JS (ES modules)**, không framework, không build step, không npm dependency | GitHub Pages phục vụ file tĩnh trực tiếp. Không cần React/Vite cho một app 5 màn hình. Sửa nội dung = sửa JSON, push là xong. Không có build nghĩa là không bao giờ hỏng vì toolchain |
| Dữ liệu | **JSON tách theo topic** + `data/manifest.json` | Dễ viết nội dung tăng dần từng topic, dễ review, tránh một file 300 câu khổng lồ. Manifest cho phép app biết topic nào tồn tại mà không hardcode |
| Đáp án đúng | Lưu bằng **chỉ số (index) dùng chung cho cả 2 ngôn ngữ** | Thứ tự đáp án VI và EN **phải khớp nhau tuyệt đối**. Một trường `answer` duy nhất loại bỏ hoàn toàn nguy cơ lệch đáp án khi dịch |
| Lưu tiến độ | **localStorage** | Không cần backend, không cần đăng nhập. Đủ cho một người dùng ôn thi |
| Kiểm tra chất lượng | **Script Node `tools/validate.mjs`** (Node v24 đã có sẵn trên máy) | Tự động bắt: thiếu bản dịch, số đáp án VI ≠ EN, `answer` ngoài khoảng, id trùng, thiếu `explanation`, thiếu `ref` ở câu thuế. Rẻ và chặn được lỗi nội dung nguy hiểm nhất |
| Đường dẫn | **Toàn bộ dùng đường dẫn tương đối** | GitHub Pages dạng project site chạy ở subpath `/<repo>/`; đường dẫn tuyệt đối `/assets/...` sẽ vỡ |

**Đã kiểm tra môi trường:** Node v24.16.0 ✅ · Git 2.53.0 ✅ · GitHub CLI (`gh`) **chưa cài** → deploy bằng `git` thuần + HTTPS (Git Credential Manager), hoặc tạo repo trên giao diện web GitHub rồi `git remote add`.

## 5. Cấu trúc thư mục dự kiến

```
d:\Projects\Thùy Dương\
├─ index.html                    # shell + màn hình chọn 2 phần
├─ .nojekyll                     # tắt Jekyll của GitHub Pages
├─ README.md                     # giới thiệu + link public + cách cập nhật câu hỏi
├─ assets/
│  ├─ css/app.css                # mobile-first, sáng/tối theo hệ thống
│  └─ js/
│     ├─ main.js                 # bootstrap
│     ├─ router.js               # hash router: #/english, #/professional, #/practice/:topic, #/test/:bank
│     ├─ i18n.js                 # từ điển giao diện VI/EN + nút chuyển ngữ sticky
│     ├─ store.js                # localStorage: tiến độ, câu sai, bookmark, ngôn ngữ
│     ├─ data-loader.js          # nạp manifest + topic JSON, cache-bust
│     └─ views/                  # home, bank, practice, test, result, review
├─ data/
│  ├─ manifest.json
│  ├─ english/       (8 file JSON  — 100 câu)
│  └─ professional/  (12 file JSON — 200 câu)
├─ tools/validate.mjs            # validator schema + nội dung
├─ docs/
│  ├─ reference-2026.md          # TỔNG HỢP CĂN CỨ PHÁP LÝ 2026 (nguồn sự thật cho mọi câu hỏi)
│  └─ content-guidelines.md      # quy tắc viết câu hỏi & lời giải
└─ plans/260831-1715-accounting-exam-prep/
```

## 6. Lược đồ dữ liệu một câu hỏi (chuẩn hoá)

```json
{
  "id": "PRO-VAT-007",
  "topic": "thue-gtgt",
  "difficulty": "intermediate",
  "answer": 2,
  "ref": "Luật GTGT 48/2024/QH15 (hiệu lực 01/07/2025); NĐ 181/2025/NĐ-CP",
  "tags": ["vat", "input-credit", "2026-update"],
  "vi": {
    "question": "Công ty mua hàng hóa trị giá 6.000.000 đồng (đã gồm thuế GTGT), thanh toán bằng tiền mặt vào tháng 8/2026. Thuế GTGT đầu vào của giao dịch này được xử lý thế nào?",
    "options": [
      "Được khấu trừ toàn bộ vì dưới 20 triệu đồng",
      "Được khấu trừ 50%",
      "Không được khấu trừ do không có chứng từ thanh toán không dùng tiền mặt",
      "Được khấu trừ nếu có hợp đồng bằng văn bản"
    ],
    "explanation": "Luật GTGT 48/2024 (hiệu lực 01/07/2025) đã BỎ ngưỡng 20 triệu đồng của luật cũ. Ngưỡng bắt buộc phải có chứng từ thanh toán không dùng tiền mặt hạ xuống 5 triệu đồng. Giao dịch 6 triệu thanh toán bằng tiền mặt → không đủ điều kiện khấu trừ đầu vào.",
    "distractors": [
      "Sai — ngưỡng 20 triệu là quy định CŨ, đã bị bãi bỏ từ 01/07/2025.",
      "Sai — pháp luật thuế GTGT không có cơ chế khấu trừ một phần theo tỷ lệ như vậy.",
      null,
      "Sai — hợp đồng không thay thế được chứng từ thanh toán không dùng tiền mặt."
    ]
  },
  "en": {
    "question": "...",
    "options": ["...", "...", "...", "..."],
    "explanation": "...",
    "distractors": ["...", "...", null, "..."]
  }
}
```

Quy tắc bất biến: `vi.options.length === en.options.length === 4` · `answer ∈ [0,3]` · phần tử thứ `answer` của `distractors` luôn là `null`.

## 7. Bản đồ nội dung 300 câu

### Phần A — Tiếng Anh chuyên ngành kế toán (100 câu / 8 topic)

| # | Topic | Số câu | Nội dung |
|---|---|---|---|
| A1 | Core terminology & accounting equation | 15 | assets/liabilities/equity, accrual vs cash basis, going concern, matching, prudence, materiality |
| A2 | Financial statements vocabulary | 15 | Dòng mục Balance Sheet / P&L / Cash Flow / Equity; current vs non-current; gross vs net; EBIT/EBITDA |
| A3 | Double-entry & bookkeeping terms | 15 | debit/credit, journal, ledger, trial balance, posting, reconciliation, accrual, deferral, write-off, provision |
| A4 | AP / AR, invoicing & payments | 12 | invoice, credit note, remittance advice, ageing, bad debt, dunning, payment terms (net 30, 2/10 n/30) |
| A5 | Tax & payroll English | 12 | VAT output/input tax, CIT, PIT, withholding tax, deductible/non-deductible, payroll, gross-up, social insurance |
| A6 | Audit, internal control & compliance | 11 | audit trail, sampling, materiality, segregation of duties, working papers, management letter, AML/KYC |
| A7 | Client & head-office email English | 10 | Mẫu câu xin chứng từ, báo trễ hạn, xác nhận số dư, escalate, hedging language, tone lịch sự |
| A8 | Grammar & usage traps | 10 | accrue/incur, cost/expense/expenditure, payable/receivable, raise/rise, giới từ (charged **to**, account **for**), viết số tiền & ngày kiểu Anh–Mỹ |

### Phần B — Chuyên môn kế toán (200 câu / 12 topic) — 140 VN + 60 quốc tế

**Khối Việt Nam (140 câu)**

| # | Topic | Số câu | Nội dung |
|---|---|---|---|
| B1 | Nguyên lý kế toán & ghi sổ kép | 25 | Phương trình kế toán, tính chất tài khoản, nợ/có, chứng từ, sổ sách, kỳ kế toán, các nguyên tắc cơ bản |
| B2 | Hệ thống tài khoản & định khoản nghiệp vụ | 30 | Tiền (111/112), phải thu (131), phải trả (331), tạm ứng (141), HTK (152/153/156), TSCĐ (211/214), lương & BH (334/338), thuế (133/333), vốn (411), doanh thu/chi phí (511/632/641/642/811/711) |
| B3 | Hàng tồn kho & giá vốn | 12 | FIFO, bình quân gia quyền, kê khai thường xuyên vs kiểm kê định kỳ, dự phòng giảm giá, hao hụt |
| B4 | TSCĐ, khấu hao & chi phí trả trước | 12 | Tiêu chuẩn ghi nhận, nguyên giá, khấu hao đường thẳng (TT 45/2013), thanh lý/nhượng bán, sửa chữa lớn, phân bổ TK 242 |
| B5 | Doanh thu, chi phí & xác định KQKD | 12 | Điều kiện ghi nhận doanh thu, chiết khấu/giảm giá/hàng trả lại, kết chuyển TK 911, lãi/lỗ |
| B6 | Thuế GTGT (Luật 48/2024) | 15 | Đối tượng chịu thuế, thuế suất 0/5/8/10%, điều kiện khấu trừ đầu vào, **ngưỡng chứng từ không dùng tiền mặt 5 triệu**, phương pháp khấu trừ vs trực tiếp, hoàn thuế, kê khai |
| B7 | Thuế TNDN (Luật 67/2025) & TNCN (NQ 110/2025) | 15 | Bậc 15/17/20%, chi phí được trừ – không được trừ, tạm nộp & quyết toán; TNCN: cư trú/không cư trú, **giảm trừ 15,5tr / 6,2tr từ 2026**, biểu lũy tiến từng phần |
| B8 | Hóa đơn điện tử, chứng từ, lương & BHXH | 12 | NĐ 123/2020 sửa bởi **NĐ 70/2025**: thời điểm lập hóa đơn, hóa đơn sai sót — điều chỉnh vs thay thế; tỷ lệ trích BHXH/BHYT/BHTN, lương tối thiểu vùng, hợp đồng lao động |
| B9 | Chế độ kế toán mới TT 99/2025 | 7 | Hiệu lực 01/01/2026, phạm vi áp dụng, **TK 215**, **TK 8213**, đồng tiền kế toán, thuyết minh mở rộng, mẫu BCTC không hoạt động liên tục, bản đồ chuyển đổi từ TT 200 |

**Khối quốc tế (60 câu)**

| # | Topic | Số câu | Nội dung |
|---|---|---|---|
| B10 | IFRS/IAS căn bản & khác biệt VAS–IFRS | 25 | IAS 1, IAS 2, IAS 16, IAS 36, IAS 37, IFRS 9, IFRS 15 (mô hình 5 bước), IFRS 16; fair value vs historical cost; revaluation; impairment; lộ trình QĐ 345 bắt buộc từ 2026 |
| B11 | Bookkeeping & month-end close (chuẩn quốc tế) | 20 | Adjusting entries, accruals & prepayments, bank reconciliation, intercompany, trial balance → FS, close checklist, control account, suspense account, tie-out |
| B12 | Fund administration & NAV | 15 | NAV = tài sản − nợ phải trả; NAV/unit; subscription & redemption; management fee & performance fee; expense accrual; capital account / partner allocation; pricing & valuation; corporate action; đối chiếu GL ↔ investor registry |

**Phân bổ độ khó (áp dụng cho cả hai phần):** ~50% `basic` · ~35% `intermediate` · ~15% `advanced`.

## 8. Chức năng web app

**Trong scope**

1. Màn hình chủ: chọn **Tiếng Anh kế toán** hoặc **Chuyên môn kế toán** — 2 component độc lập.
2. Mỗi phần: danh sách topic kèm số câu, tiến độ đã làm, tỷ lệ đúng.
3. **Chế độ ôn theo topic**: chọn 1 đáp án → hiện ngay **Đúng/Sai**, tô màu đáp án đúng, hiện **lời giải** + lý do từng đáp án sai + căn cứ pháp lý.
4. **Chế độ test**: random **50 câu trong 200** câu chuyên môn (mặc định), không hiện đáp án trong lúc làm, có đồng hồ, nộp bài → điểm + phân tích theo topic + xem lại từng câu kèm lời giải. Engine dùng chung nên phần tiếng Anh cũng có test random (mặc định 30/100).
5. **Nút chuyển ngữ nổi cố định** (VI ⇄ EN) luôn hiện khi scroll, đổi tại chỗ, nhớ lựa chọn giữa các lần mở.
6. Lưu tiến độ bằng localStorage; **ôn lại riêng các câu đã trả lời sai**; đánh dấu (bookmark) câu khó.
7. Mobile-first, font đủ lớn để đọc trên điện thoại, vùng bấm đủ rộng cho ngón tay.

**Ngoài scope (cố tình loại bỏ — YAGNI)**

- Đăng nhập / tài khoản / đồng bộ nhiều thiết bị.
- Backend, database, analytics.
- Thuật toán spaced repetition đầy đủ — thay bằng "ôn lại câu sai", đủ hiệu quả cho một tuần ôn.
- Trình soạn thảo câu hỏi trên web (sửa trực tiếp JSON là đủ).

## 9. Các phase

| Phase | Tên | File | Đầu ra | Ước lượng |
|---|---|---|---|---|
| 0 | Xác minh căn cứ pháp lý 2026 | [phase-0-research-factsheet.md](phase-0-research-factsheet.md) | `docs/reference-2026.md` + `docs/content-guidelines.md` | 1,5–2h |
| 1 | Khởi tạo repo, schema & validator | [phase-1-scaffold-schema.md](phase-1-scaffold-schema.md) | Cấu trúc thư mục, `manifest.json`, `tools/validate.mjs` | 1h |
| 2 | Lõi web app + chuyển ngữ + chế độ ôn | [phase-2-core-app.md](phase-2-core-app.md) | Router, i18n sticky toggle, store, practice engine | 2,5–3h |
| 3 | Chế độ test + kết quả + ôn câu sai | [phase-3-test-mode.md](phase-3-test-mode.md) | Test random, đồng hồ, màn hình kết quả, review | 2h |
| 4 | Deploy sớm lên GitHub Pages | [phase-4-early-deploy.md](phase-4-early-deploy.md) | **Link public dùng được ngay** với ~30 câu seed | 45p |
| 5 | Nội dung — Tiếng Anh 100 câu | [phase-5-content-english.md](phase-5-content-english.md) | 8 file JSON song ngữ | 3–4h |
| 6 | Nội dung — Chuyên môn VN 140 câu | [phase-6-content-vn.md](phase-6-content-vn.md) | 9 file JSON song ngữ, có trích dẫn pháp lý | 5–6h |
| 7 | Nội dung — Quốc tế 60 câu | [phase-7-content-international.md](phase-7-content-international.md) | 3 file JSON song ngữ | 2,5–3h |
| 8 | QA, đối chiếu pháp lý & deploy hoàn chỉnh | [phase-8-qa-final-deploy.md](phase-8-qa-final-deploy.md) | Validator sạch, rà soát đáp án, test mobile, redeploy | 2–2,5h |

**Tổng ước lượng: 20–25 giờ làm việc.** Với mốc "trên 1 tuần" là hoàn toàn khả thi, và **có link ôn được từ cuối Phase 4** (khoảng 1/3 chặng đường).

## 10. Rủi ro & cách xử lý

| # | Rủi ro | Mức độ | Xử lý |
|---|---|---|---|
| R1 | **Câu hỏi/lời giải sai về pháp luật** do quy định 2025–2026 mới, tài liệu trên mạng lỗi thời | 🔴 Cao | Phase 0 dựng `docs/reference-2026.md` từ nguồn uy tín (KPMG/PwC/EY/Deloitte, LuatVietnam, Acclime) làm **nguồn sự thật duy nhất**; mọi câu thuế/chế độ **bắt buộc** có trường `ref`; validator chặn câu thiếu `ref`; Phase 8 rà lại toàn bộ |
| R2 | Nhầm lẫn TT 200 vs TT 99 gây học sai | 🔴 Cao | Topic B9 riêng cho TT 99; mọi khác biệt gắn nhãn `TT200 → TT99` trong lời giải; phần định khoản chỉ dùng nghiệp vụ hai thông tư giống nhau |
| R3 | Bản dịch EN lệch nghĩa hoặc lệch thứ tự đáp án | 🟠 Trung bình | Một trường `answer` dùng chung; validator so khớp số lượng option và vị trí `null` trong `distractors`; viết VI và EN cùng lúc trong một lần, không dịch tách rời |
| R4 | Không biết đề thật hỏi gì → ôn lệch | 🟠 Trung bình | Thiết kế **bao phủ rộng, ưu tiên nền tảng**: 50% mức cơ bản (gần như chắc chắn được hỏi), 35% trung bình, 15% nâng cao. Đây là giới hạn không thể loại bỏ, chỉ có thể giảm thiểu |
| R5 | GitHub Pages cache file JSON cũ sau khi cập nhật nội dung | 🟡 Thấp | Thêm tham số `?v=<timestamp>` khi fetch data; ghi rõ trong README |
| R6 | Đường dẫn tuyệt đối làm vỡ site ở subpath `/<repo>/` | 🟡 Thấp | Quy ước bắt buộc: **chỉ dùng đường dẫn tương đối**; kiểm tra ngay ở Phase 4 khi deploy lần đầu |
| R7 | Khối lượng 300 câu song ngữ lớn, dễ đuối giữa chừng | 🟠 Trung bình | Chia nhỏ theo topic, mỗi topic là một đơn vị giao hàng độc lập; deploy sớm ở Phase 4 để có động lực; app hoạt động bình thường dù mới có một phần nội dung |

## 11. Tiêu chí hoàn thành (Definition of Done)

- [x] `node tools/validate.mjs` chạy sạch: **300 câu**, 0 lỗi, 0 cảnh báo
- [x] Đủ **100 câu** tiếng Anh / 8 topic và **200 câu** chuyên môn / 12 topic, đúng phân bổ 140 VN + 60 quốc tế
- [x] 100% câu có lời giải ở **cả VI và EN**; 100% câu thuộc topic B6–B9 có trường `ref` trích dẫn văn bản
- [x] Nút chuyển ngữ nổi hoạt động ở mọi màn hình, giữ nguyên trạng thái câu đang làm
- [x] Chế độ ôn theo topic: chọn đáp án → phản hồi đúng/sai + giải thích tức thì
- [x] Chế độ test: random 50/200 chạy đúng, chấm điểm đúng, phân tích theo topic
- [x] Tiến độ và danh sách câu sai lưu bền qua việc đóng/mở lại trình duyệt
- [ ] Link `https://<username>.github.io/<repo>/` mở được trên điện thoại, không lỗi 404 tài nguyên
- [ ] README ghi rõ link public và cách thêm/sửa câu hỏi

## 12. Bước tiếp theo

Chạy: `/ck:cook d:\Projects\Thùy Dương\plans\260831-1715-accounting-exam-prep\plan.md`

## Nguồn tham khảo (research)

- [Circular 99/2025 replaces Circular 200/2014 — Alitium](https://www.alitium.com/vietnams-accounting-enters-a-new-phase-circular-99-2025-replaces-circular-200-2014/)
- [Draft Circular to Replace Circular 200 and Vietnam's IFRS Roadmap — KPMG Vietnam](https://kpmg.com/vn/en/insights/2025/08/draft-circular-replace-circular-200-and-vietnam-ifrs-roadmap.html)
- [IFRS and VAS in Vietnam: The 2026 Guide — Acclime Vietnam](https://vietnam.acclime.com/guides/vietnam-ifrs-and-vas/)
- [Circular 99: Vietnam Further Aligns Accounting Regime with IFRS — Vietnam Briefing](https://www.vietnam-briefing.com/news/circular-99-vietnam-accounting-regime-means-for-ifrs-alignment.html/)
- [New features of the VAT Law No. 48/2024/QH15 — Crowe Vietnam](https://www.crowe.com/vn/news/new-features-of-the-value-added-tax-law-no-482024qh15)
- [Vietnam's New Corporate Income Tax Law 2025 — Alitium](https://www.alitium.com/vietnams-new-corporate-income-tax-law-2025practical-implications/)
- [Vietnam's New Personal Income Tax Law in 2026 — Acclime Vietnam](https://vietnam.acclime.com/news-insights/vietnams-new-personal-income-tax-law-in-2026-major-updates-and-business-impact/)
- [Vietnam PIT Deduction Levels from January 01, 2026 — Viet An Law](https://vietanlaw.com/vietnam-pit-deduction-levels-from-january-01-2026/)
- [Decree 70: Key Amendments to Invoice Regulations — Vietnam Briefing](https://www.vietnam-briefing.com/news/decree-70-key-amendments-to-invoice-regulations-in-vietnam.html/)
- [Accounting & Tax Compliance Services in Vietnam — Acclime Vietnam](https://vietnam.acclime.com/accounting/)
- [Top 30 Fund Accountant Interview Questions](https://www.mockinterviewpro.com/interview-questions/fund-accountant)
