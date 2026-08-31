# Phase 7 — Nội dung: 60 câu chuyên môn quốc tế (IFRS · month-end close · fund administration)

**Mục tiêu:** 3 file JSON song ngữ, tổng đúng 60 câu — phần khiến bạn khác biệt so với ứng viên chỉ ôn kiến thức trong nước.

**Ước lượng:** 2,5–3h · **Phụ thuộc:** Phase 0, Phase 1 · **Chặn:** Phase 8

---

## Vì sao phần này quan trọng dù chỉ 30%

JD ghi rõ hai điều mà phần lớn ứng viên fresher sẽ bỏ qua:
- *"fund administration"* — hầu như không được dạy ở đại học Việt Nam. Chỉ cần trả lời được vài câu cơ bản về NAV là đã tạo ấn tượng rõ rệt.
- *"deliverables to the head office"* — làm việc theo chuẩn của tập đoàn nước ngoài, tức là quen với chu trình đóng sổ (month-end close) kiểu quốc tế và IFRS.

Ngoài ra ACCA/CPA là điểm cộng trong JD → khả năng đề có câu IFRS là có thật.

## Phân bổ 3 topic

| ID topic | File | Câu | Nội dung cụ thể |
|---|---|---|---|
| `b10-ifrs-vas` | `professional/b10-ifrs-vas.json` | 25 | **IAS 1** — bộ báo cáo tài chính đầy đủ, nguyên tắc trình bày, phân loại ngắn hạn/dài hạn. **IAS 2** — giá gốc HTK, giá trị thuần có thể thực hiện được (NRV), **IFRS cấm LIFO**. **IAS 16** — nguyên giá, mô hình giá gốc vs mô hình đánh giá lại (VAS không cho đánh giá lại), khấu hao theo bộ phận. **IAS 36** — tổn thất tài sản, giá trị có thể thu hồi. **IAS 37** — dự phòng vs nợ tiềm tàng vs tài sản tiềm tàng. **IFRS 9** — phân loại tài sản tài chính, mô hình tổn thất tín dụng dự kiến (ECL) so với mô hình tổn thất đã phát sinh. **IFRS 15** — mô hình 5 bước ghi nhận doanh thu. **IFRS 16** — thuê tài sản lên bảng cân đối bên đi thuê. **Khác biệt VAS ↔ IFRS**: giá gốc vs giá trị hợp lý, không có bất động sản đầu tư theo giá trị hợp lý trong VAS, không đánh giá lại TSCĐ, khác biệt về suy giảm giá trị. **Lộ trình QĐ 345/QĐ-BTC**: ba giai đoạn, đối tượng bắt buộc từ năm tài chính 2026 |
| `b11-month-end-close` | `professional/b11-month-end-close.json` | 20 | Quy trình đóng sổ tháng chuẩn: cut-off; adjusting entries; accruals (chi phí đã phát sinh chưa có hóa đơn) và prepayments; unearned revenue; depreciation run; **bank reconciliation** — các khoản làm lệch (outstanding cheque, deposit in transit, bank charge, NSF) và bên nào phải điều chỉnh; **control account** vs sổ chi tiết và cách tìm chênh lệch; **suspense account**; intercompany reconciliation và loại trừ giao dịch nội bộ; trial balance → financial statements; close checklist và tie-out; phân biệt lỗi làm lệch cân đối và lỗi **không** làm lệch cân đối (lỗi ghi nhầm tài khoản, ghi trùng, đảo bút toán) |
| `b12-fund-administration` | `professional/b12-fund-administration.json` | 15 | **NAV = tổng tài sản − tổng nợ phải trả**; **NAV/unit = NAV ÷ số đơn vị quỹ đang lưu hành** — có bài tính; ảnh hưởng của subscription và redemption tới NAV và số đơn vị; **management fee** (tính theo NAV, trích trước hàng ngày/tháng) và **performance fee** (high-water mark, hurdle rate); expense accrual của quỹ và vì sao phải trích trước hàng ngày; định giá tài sản (pricing / valuation) và kiểm tra giá độc lập; capital account / partner capital allocation; **corporate action** (cổ tức, chia tách) ảnh hưởng NAV thế nào; đối chiếu **GL ↔ investor registry ↔ custodian**; vai trò của fund administrator so với custodian và investment manager; chu trình NAV hàng ngày vs hàng tháng |

**Tổng: 25+20+15 = 60 ✓**

## Nguyên tắc riêng

1. Phần này **giữ nguyên thuật ngữ tiếng Anh** trong cả bản `vi` — vì trong thực tế công việc không ai dịch "high-water mark" hay "trial balance" sang tiếng Việt. Bản `vi` giải thích nghĩa, không thay thế thuật ngữ.
2. Câu IFRS nên ra dạng **so sánh với VAS** khi có thể — vừa ôn được cả hai, vừa đúng thứ mà một công ty dịch vụ phục vụ khách FDI quan tâm.
3. Câu fund administration giữ ở **mức khái niệm và tính toán cơ bản**. Không đi vào định giá phái sinh hay waterfall phức tạp — vị trí này là Associate, không phải senior fund accountant. Ra đề quá sâu là lãng phí thời gian ôn.
4. `ref` ở phần này ghi số hiệu chuẩn mực (`IAS 2.9`, `IFRS 15 – five-step model`) thay vì văn bản pháp luật Việt Nam.

## Kiểm tra hoàn thành Phase 7

- [ ] Đủ 3 file, tổng đúng 60 câu, validator 0 lỗi
- [ ] Tỷ lệ tổng thể bank chuyên môn đạt đúng 140 VN / 60 quốc tế (validator báo 70,0% / 30,0%)
- [ ] Câu IFRS có nêu điểm khác biệt với VAS ở lời giải khi liên quan
- [ ] Câu fund administration ở mức Associate, có ít nhất 3 câu tính NAV/phí có số liệu
