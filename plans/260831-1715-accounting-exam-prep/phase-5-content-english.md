# Phase 5 — Nội dung: 100 câu Tiếng Anh kế toán

**Mục tiêu:** 8 file JSON song ngữ, tổng đúng 100 câu.

**Ước lượng:** 3–4h · **Phụ thuộc:** Phase 0, Phase 1 · **Chặn:** Phase 8

---

## Nguyên tắc riêng cho phần tiếng Anh

Đây **không phải bài kiểm tra tiếng Anh tổng quát** — là tiếng Anh dùng trong công việc kế toán tại một hãng dịch vụ có head office nước ngoài. Vì vậy:

- **Câu hỏi luôn viết bằng tiếng Anh ở cả hai chế độ ngôn ngữ** (bạn phải đọc được tiếng Anh — đó là điều đang kiểm tra). Bản `vi` dịch **phần dẫn dắt và lời giải**, giữ nguyên thuật ngữ/câu tiếng Anh cần đánh giá.
  - Ví dụ `vi.question`: *"Thuật ngữ nào chỉ khoản chi phí đã phát sinh nhưng chưa được lập hóa đơn tại thời điểm khóa sổ? (accrued expense / prepaid expense / deferred revenue / contingent liability)"* — đáp án vẫn là tiếng Anh, phần giải thích bằng tiếng Việt.
- Trọng tâm là **thuật ngữ đi vào ngữ cảnh câu**, không phải học vẹt từ vựng rời rạc.
- Lời giải bản `vi` phải cho **từ tương đương tiếng Việt chuẩn** — đây là giá trị lớn nhất, vì bạn học kế toán bằng tiếng Việt nhưng sẽ làm việc bằng tiếng Anh.

## Phân bổ 8 topic

| ID topic | File | Câu | Nội dung cụ thể |
|---|---|---|---|
| `a1-core-terminology` | `english/a1-core-terminology.json` | 15 | assets / liabilities / equity / revenue / expense; accounting equation; accrual vs cash basis; going concern; matching; prudence; materiality; consistency; entity concept |
| `a2-financial-statements` | `english/a2-financial-statements.json` | 15 | Tên và vị trí các dòng mục của Balance Sheet, Income Statement, Cash Flow, Statement of Changes in Equity; current vs non-current; gross profit / operating profit / net profit; EBIT, EBITDA; retained earnings; working capital |
| `a3-double-entry` | `english/a3-double-entry.json` | 15 | debit/credit, journal entry, general ledger, subsidiary ledger, trial balance, posting, closing entries, accrual, deferral, provision, write-off, reversal, reconciliation, opening/closing balance |
| `a4-ap-ar-invoicing` | `english/a4-ap-ar-invoicing.json` | 12 | invoice, credit note / debit note, remittance advice, statement of account, ageing report, bad debt, allowance for doubtful accounts, dunning, payment terms (net 30, 2/10 net 30), advance / deposit, offset |
| `a5-tax-payroll-english` | `english/a5-tax-payroll-english.json` | 12 | output/input VAT, VAT credit & refund, CIT, PIT, withholding tax, deductible vs non-deductible, tax base, tax finalisation, payroll, gross vs net salary, gross-up, social insurance contribution, dependant relief |
| `a6-audit-control` | `english/a6-audit-control.json` | 11 | audit trail, supporting documents, sampling, materiality, segregation of duties, working papers, management letter, internal control, substantive testing, AML/KYC, engagement letter |
| `a7-email-communication` | `english/a7-email-communication.json` | 10 | Chọn câu phù hợp nhất trong tình huống: xin chứng từ còn thiếu từ khách hàng, báo trễ hạn với head office, xác nhận số dư, làm rõ một khoản chi bất thường, escalate vấn đề, xin gia hạn. Chấm cả **mức độ lịch sự và rõ ràng**, không chỉ đúng ngữ pháp |
| `a8-grammar-traps` | `english/a8-grammar-traps.json` | 10 | accrue vs incur; cost vs expense vs expenditure; payable vs receivable; raise vs rise; charge **to** an account, account **for**, reconcile **to/with**, comprise vs consist of; viết số tiền (VND 1,500,000 / 1.5 million); viết ngày kiểu Anh vs Mỹ; số ít/số nhiều của *data*, *criteria*, *accrual* |

**Tổng: 15+15+15+12+12+11+10+10 = 100 ✓**

## Quy trình làm việc

Làm **từng topic một**, mỗi topic là một lần giao hàng độc lập:

1. Viết đủ số câu của topic vào file JSON.
2. Chạy `node tools/validate.mjs` → sửa hết lỗi.
3. Xem lại trên app local: đọc thử 3 câu bất kỳ ở cả hai ngôn ngữ.
4. Commit riêng cho topic đó: `content(english): A3 double-entry terms (15 câu)`.
5. Push → nội dung lên link public ngay, ôn được luôn.

## Kiểm tra hoàn thành Phase 5

- [ ] Đủ 8 file, tổng đúng 100 câu, validator 0 lỗi
- [ ] Mỗi câu có bản `vi` và `en` đầy đủ, lời giải bản `vi` có từ tương đương tiếng Việt
- [ ] Không cảnh báo W1 (lộ đáp án qua độ dài) chưa xử lý
- [ ] Đã đọc soát tay toàn bộ 100 câu ít nhất một lượt
