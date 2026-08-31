# Phase 6 — Nội dung: 140 câu chuyên môn kế toán Việt Nam

**Mục tiêu:** 9 file JSON song ngữ, tổng đúng 140 câu — phần nặng nhất và có giá trị cao nhất của bộ đề.

**Ước lượng:** 5–6h · **Phụ thuộc:** Phase 0 (bắt buộc — không được bắt đầu khi `docs/reference-2026.md` chưa xong) · **Chặn:** Phase 8

---

## Nguyên tắc riêng cho khối Việt Nam

1. **Mọi câu về thuế / hóa đơn / chế độ kế toán bắt buộc có trường `ref`** dẫn văn bản (và điều khoản nếu xác định được). Validator sẽ chặn nếu thiếu (luật V9).
2. **Lời giải phải nêu cả quy định cũ khi có thay đổi 2025–2026**, theo mẫu:
   > *"Từ 01/07/2025 ngưỡng này là 5 triệu đồng theo Luật GTGT 48/2024. Quy định cũ (Luật 13/2008) là 20 triệu đồng — nhiều tài liệu ôn thi trên mạng vẫn ghi con số cũ này."*

   Lý do: nếu đề thi của Acclime vẫn ra theo quy định cũ, bạn vẫn nhận diện được; nếu ra theo quy định mới, bạn trả lời đúng. Hai đầu đều an toàn.
3. **Phần định khoản (B2) chỉ dùng nghiệp vụ mà TT 200 và TT 99 giống nhau** — tránh dạy sai. Mọi khác biệt dồn vào topic B9.
4. **Câu tính toán dùng số tròn**, lời giải trình bày phép tính từng bước để tự kiểm tra được.
5. Bản `en`: dùng thuật ngữ kế toán Anh chuẩn, giữ nguyên số hiệu tài khoản và tên văn bản tiếng Việt (`Circular 99/2025/TT-BTC`, `Account 131 – Trade receivables`). Đây cũng chính là cách người ta viết trong môi trường làm việc thật ở Acclime.

## Phân bổ 9 topic

| ID topic | File | Câu | Nội dung cụ thể |
|---|---|---|---|
| `b1-nguyen-ly` | `professional/b1-nguyen-ly.json` | 25 | Phương trình kế toán và tác động của nghiệp vụ; tính chất tài khoản tài sản/nguồn vốn/doanh thu/chi phí; quy tắc ghi Nợ–Có; định khoản đơn vs phức; chứng từ kế toán; sổ nhật ký chung, sổ cái, sổ chi tiết; bảng cân đối số phát sinh; kỳ kế toán, năm tài chính; các nguyên tắc: cơ sở dồn tích, hoạt động liên tục, giá gốc, phù hợp, nhất quán, thận trọng, trọng yếu |
| `b2-dinh-khoan` | `professional/b2-dinh-khoan.json` | 30 | Định khoản nghiệp vụ theo nhóm: tiền mặt/TGNH (111, 112) và chênh lệch tỷ giá; phải thu khách hàng (131), dự phòng (229); tạm ứng (141); hàng tồn kho (152, 153, 156) mua – xuất dùng – xuất bán; TSCĐ (211, 214) mua sắm – khấu hao; phải trả người bán (331); lương và các khoản trích theo lương (334, 338); thuế GTGT được khấu trừ (133) và phải nộp (333); vốn chủ sở hữu (411); doanh thu (511), giá vốn (632), chi phí bán hàng (641), chi phí QLDN (642), thu nhập khác (711), chi phí khác (811); kết chuyển 911 |
| `b3-hang-ton-kho` | `professional/b3-hang-ton-kho.json` | 12 | Xác định giá gốc hàng nhập kho (gồm/không gồm chi phí nào); FIFO và bình quân gia quyền (cả liên hoàn và cuối kỳ) — có bài tính; kê khai thường xuyên vs kiểm kê định kỳ; dự phòng giảm giá HTK; hao hụt trong định mức và ngoài định mức; hàng gửi bán (157) |
| `b4-tscd-khau-hao` | `professional/b4-tscd-khau-hao.json` | 12 | Tiêu chuẩn ghi nhận TSCĐ (TT 45/2013, ngưỡng 30 triệu); xác định nguyên giá; khấu hao đường thẳng — có bài tính theo tháng; khung thời gian khấu hao; TSCĐ đã khấu hao hết còn sử dụng; thanh lý/nhượng bán và ghi nhận lãi/lỗ; sửa chữa thường xuyên vs nâng cấp; chi phí trả trước (242) và tiêu chí phân bổ |
| `b5-doanh-thu-chi-phi` | `professional/b5-doanh-thu-chi-phi.json` | 12 | Điều kiện ghi nhận doanh thu bán hàng và cung cấp dịch vụ (VAS 14); thời điểm ghi nhận vs thời điểm thu tiền; chiết khấu thương mại, giảm giá hàng bán, hàng bán bị trả lại — hạch toán và ảnh hưởng tới doanh thu thuần; doanh thu chưa thực hiện (3387); phân biệt chi phí bán hàng và chi phí QLDN; kết chuyển xác định KQKD |
| `b6-thue-gtgt` | `professional/b6-thue-gtgt.json` | 15 | **Luật 48/2024/QH15 + NĐ 181/2025.** Đối tượng chịu thuế / không chịu thuế (kể cả nhóm vừa đổi: phân bón, máy nông nghiệp, tàu cá → 5%); thuế suất 0%/5%/8%/10% và thời hạn áp dụng 8%; điều kiện khấu trừ thuế đầu vào — **trọng tâm: chứng từ thanh toán không dùng tiền mặt, ngưỡng đã chốt ở Phase 0**; phương pháp khấu trừ vs trực tiếp; hoàn thuế; hàng xuất khẩu; kê khai tháng/quý; thuế GTGT hàng nhập khẩu |
| `b7-thue-tndn-tncn` | `professional/b7-thue-tndn-tncn.json` | 15 | **TNDN (Luật 67/2025):** thuế suất 15% / 17% / 20% và ngưỡng doanh thu; thu nhập tính thuế = thu nhập chịu thuế − thu nhập miễn − lỗ kết chuyển; chi phí được trừ và các khoản **không** được trừ hay gặp (chi không hóa đơn, chi vượt định mức, tiền phạt vi phạm hành chính, lãi vay vượt trần, chi phúc lợi vượt 1 tháng lương bình quân); tạm nộp và quyết toán. **TNCN (NQ 110/2025):** cá nhân cư trú / không cư trú; **giảm trừ bản thân 15,5tr và người phụ thuộc 6,2tr từ kỳ tính thuế 2026**; biểu lũy tiến từng phần — có bài tính; thu nhập vãng lai và mức khấu trừ 10%; quyết toán thay |
| `b8-hoa-don-luong-bhxh` | `professional/b8-hoa-don-luong-bhxh.json` | 12 | **NĐ 123/2020 sửa bởi NĐ 70/2025:** nội dung bắt buộc trên hóa đơn điện tử; **thời điểm lập hóa đơn** với bán hàng / cung cấp dịch vụ / hoạt động cung cấp liên tục / xuất khẩu; xử lý hóa đơn sai sót — **phân biệt hóa đơn điều chỉnh và hóa đơn thay thế**, trường hợp nào dùng cái nào; kê khai bổ sung. **Lương – BHXH:** tỷ lệ trích phần doanh nghiệp và phần người lao động (BHXH, BHYT, BHTN, KPCĐ); tiền lương làm căn cứ đóng; lương tối thiểu vùng; làm thêm giờ; hợp đồng thử việc |
| `b9-tt99-2025` | `professional/b9-tt99-2025.json` | 7 | Ngày ban hành, hiệu lực **01/01/2026**, phạm vi áp dụng, văn bản bị thay thế; **TK 215 – Tài sản sinh học**; **TK 8213 – Chi phí thuế TNDN bổ sung tối thiểu toàn cầu (GloBE 15%)**; điều kiện chọn đồng tiền kế toán là ngoại tệ và nghĩa vụ vẫn phải nộp BCTC bằng VND; thuyết minh mở rộng (cơ sở đồng tiền kế toán, ảnh hưởng chênh lệch tỷ giá, rủi ro tài chính); mẫu BCTC cho doanh nghiệp **không hoạt động liên tục**; những gì **không** đổi so với TT 200 |

**Tổng: 25+30+12+12+12+15+15+12+7 = 140 ✓**

## Thứ tự thực hiện đề xuất

Làm theo thứ tự giá trị giảm dần, để nếu hết thời gian thì phần bỏ lại là phần ít khả năng bị hỏi nhất:

**B2 (định khoản) → B1 (nguyên lý) → B6 (GTGT) → B7 (TNDN/TNCN) → B8 (hóa đơn, lương) → B3 → B4 → B5 → B9**

Lý do: định khoản và nguyên lý gần như chắc chắn chiếm phần lớn bài test cho vị trí fresher bookkeeping; thuế đứng ngay sau vì đó là dịch vụ cốt lõi Acclime bán cho khách hàng.

## Quy trình mỗi topic

1. Mở `docs/reference-2026.md`, đối chiếu số liệu **trước khi viết**, không viết theo trí nhớ.
2. Viết đủ số câu song ngữ.
3. `node tools/validate.mjs` → 0 lỗi.
4. **Tự kiểm tra chéo:** đọc lại từng câu và tự hỏi *"nếu người chấm bảo đáp án này sai, tôi lấy gì bảo vệ?"* — nếu không trả lời được bằng `ref`, viết lại câu đó.
5. Commit: `content(vn): B6 thuế GTGT (15 câu)` → push.

## Kiểm tra hoàn thành Phase 6

- [ ] Đủ 9 file, tổng đúng 140 câu, validator 0 lỗi
- [ ] 100% câu ở B6, B7, B8, B9 có `ref` dẫn văn bản cụ thể
- [ ] Mọi số liệu thuế trong lời giải khớp `docs/reference-2026.md`
- [ ] Các câu có thay đổi 2025–2026 đều nêu rõ quy định cũ để đối chiếu
- [ ] Câu tính toán đã tự tính lại tay một lượt và khớp đáp án
