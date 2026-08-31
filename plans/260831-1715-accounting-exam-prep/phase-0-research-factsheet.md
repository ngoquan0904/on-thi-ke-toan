# Phase 0 — Xác minh căn cứ pháp lý 2026 & quy tắc viết câu hỏi

**Mục tiêu:** Dựng một "nguồn sự thật duy nhất" trước khi viết bất kỳ câu hỏi nào. Đây là phase quan trọng nhất của cả plan — nếu bỏ qua, 140 câu chuyên môn VN sẽ dựa trên trí nhớ và tài liệu mạng lỗi thời.

**Ước lượng:** 1,5–2h · **Phụ thuộc:** không · **Chặn:** Phase 5, 6, 7

---

## 0.1 Đầu ra `docs/reference-2026.md`

Một bảng tra cứu ngắn gọn, mỗi mục gồm: *nội dung quy định → văn bản → hiệu lực → điểm khác so với quy định cũ*. Không sao chép nguyên văn luật, chỉ tóm tắt điều cần cho việc ra đề.

### Danh mục bắt buộc phải xác minh

| Nhóm | Mục cần chốt số liệu chính xác |
|---|---|
| **Chế độ kế toán** | TT 99/2025/TT-BTC: ngày ban hành, hiệu lực, phạm vi áp dụng; TT 133/2016 (DN nhỏ và vừa) còn hiệu lực hay đã bị thay?; danh sách tài khoản mới/bỏ/đổi tên so với TT 200; nội dung TK 215, TK 8213; quy định đồng tiền kế toán; mẫu biểu BCTC |
| **VAS** | Danh mục 26 chuẩn mực; các VAS hay hỏi: VAS 01 (chuẩn mực chung), 02 (HTK), 03 (TSCĐ hữu hình), 14 (doanh thu), 21 (trình bày BCTC) |
| **Thuế GTGT** | Luật 48/2024/QH15 + NĐ 181/2025: ngưỡng chứng từ thanh toán không dùng tiền mặt (**xác minh chính xác 5 triệu**); thời hạn áp dụng thuế suất 8%; nhóm 0%/5%/10%; điều kiện khấu trừ; điều kiện hoàn thuế; đối tượng không chịu thuế mới |
| **Thuế TNDN** | Luật 67/2025/QH15: hiệu lực, kỳ áp dụng đầu tiên, ngưỡng doanh thu cho 15%/17%, cách xác định doanh thu năm trước liền kề; các khoản chi không được trừ thường gặp; mức tạm nộp |
| **Thuế TNCN** | NQ 110/2025/UBTVQH15: 15,5tr / 6,2tr, kỳ áp dụng đầu tiên; **kiểm tra riêng** có Luật TNCN mới hiệu lực 2026 và biểu thuế lũy tiến có rút bậc không; ngưỡng đăng ký người phụ thuộc; thuế suất 10%/20% cho thu nhập vãng lai và cá nhân không cư trú |
| **Hóa đơn** | NĐ 70/2025/NĐ-CP sửa NĐ 123/2020: hiệu lực 01/06/2025; thời điểm lập hóa đơn cho bán hàng / dịch vụ / xuất khẩu / hoạt động liên tục; phân biệt hóa đơn **điều chỉnh** vs **thay thế**; xử lý hóa đơn sai sót và kê khai bổ sung |
| **Lao động – BHXH** | Tỷ lệ trích BHXH/BHYT/BHTN/KPCĐ phần doanh nghiệp và phần người lao động **năm 2026**; mức lương tối thiểu vùng hiện hành; trần đóng BHXH; Luật BHXH 41/2024 có gì đổi từ 01/07/2025 |
| **IFRS** | QĐ 345/QĐ-BTC: 3 giai đoạn và mốc thời gian; đối tượng bắt buộc từ 2026; nội dung cốt lõi IAS 1/2/16/36/37, IFRS 9/15/16 |
| **Fund administration** | Công thức NAV, NAV/unit; cơ chế phí quản lý và phí hiệu suất (high-water mark); subscription/redemption; accrual chi phí quỹ |

### Cách xác minh

1. Ưu tiên nguồn: **Big4 Vietnam** (KPMG/PwC/EY/Deloitte tax alerts) → **LuatVietnam / Thư viện pháp luật** → **Acclime Vietnam insights** (chính công ty đang ứng tuyển, đọc luôn để nắm giọng điệu và quan điểm của họ).
2. Mỗi số liệu phải có **ít nhất 2 nguồn độc lập** trùng khớp, hoặc 1 nguồn là văn bản gốc.
3. Số liệu nào không xác minh được → ghi `⚠️ CHƯA XÁC MINH` trong file và **không ra câu hỏi về nó**.

> **Cảnh báo cụ thể đã phát hiện trong lúc research:** các nguồn đưa ra hai con số khác nhau cho ngưỡng chứng từ thanh toán không dùng tiền mặt (một số nói "mọi giao dịch", một số nói "từ 5 triệu đồng"). **Phải chốt dứt điểm** ở phase này vì đây gần như chắc chắn là một câu hỏi trong đề.

## 0.2 Đầu ra `docs/content-guidelines.md`

Quy tắc viết, áp dụng cho toàn bộ 300 câu:

1. **Một câu = một khái niệm.** Không gộp hai kiến thức vào một câu.
2. **4 đáp án, 1 đúng.** Các đáp án nhiễu phải **hợp lý** — lấy từ lỗi sai thật mà người học hay mắc (ví dụ: dùng ngưỡng 20 triệu đã bị bãi bỏ, nhầm TK 641 với 642, nhầm khấu trừ với hoàn thuế). Cấm đáp án nhiễu buồn cười hoặc dài bất thường.
3. **Độ dài đáp án đồng đều** — không để đáp án đúng luôn là đáp án dài nhất (lỗi ra đề kinh điển làm lộ đáp án).
4. **Vị trí đáp án đúng phân bố đều** trên 4 vị trí (validator sẽ thống kê; lệch quá 35% ở một vị trí là cảnh báo).
5. **Lời giải phải trả lời "tại sao"**, không chỉ nhắc lại đáp án. Có 3 phần: khẳng định đáp án đúng → giải thích cơ chế/quy định → nêu bẫy của các đáp án sai (trường `distractors`).
6. **Mọi câu về thuế, hóa đơn, chế độ kế toán bắt buộc có `ref`** trỏ tới văn bản + điều khoản nếu có.
7. **Câu tính toán dùng số tròn, dễ nhẩm**, và lời giải phải trình bày phép tính từng bước.
8. **Song ngữ viết cùng lúc**, không dịch máy. Bản EN phải dùng đúng thuật ngữ kế toán chuẩn (deductible input VAT, not "subtractable tax").
9. Với nội dung có thay đổi 2025–2026: lời giải **phải nêu rõ quy định cũ là gì** để phòng trường hợp đề thi vẫn theo quy định cũ — bạn nhận diện được cả hai.
10. Thuật ngữ kế toán tiếng Anh trong bản VI được để trong ngoặc để học kèm, ví dụ: "khấu trừ thuế đầu vào (*input VAT credit*)".

## Kiểm tra hoàn thành Phase 0

- [ ] `docs/reference-2026.md` tồn tại, đủ 9 nhóm ở bảng trên, mỗi mục có nguồn
- [ ] Không còn mục nào gắn `⚠️ CHƯA XÁC MINH` trong nhóm Thuế GTGT / TNDN / TNCN / Hóa đơn
- [ ] Đã chốt dứt điểm ngưỡng chứng từ thanh toán không dùng tiền mặt
- [ ] Đã chốt TT 133/2016 còn hay hết hiệu lực
- [ ] `docs/content-guidelines.md` tồn tại với đủ 10 quy tắc
