# Phase 3 — Chế độ test, chấm điểm & ôn lại câu sai

**Mục tiêu:** Mô phỏng bài thi thật: random 50 câu trong 200, có đồng hồ, không hiện đáp án khi đang làm, nộp bài mới biết kết quả.

**Ước lượng:** 2h · **Phụ thuộc:** Phase 2 · **Chặn:** Phase 4

---

## 3.1 Tạo đề

**Thuật toán lấy mẫu theo tỷ lệ topic** (không random thuần) để đề luôn cân đối:

1. Nạp toàn bộ câu hỏi của bank.
2. Với mỗi topic, số câu được chọn = `round(testSize × countTopic / countBank)`.
3. Sửa sai lệch làm tròn: thêm/bớt ở các topic lớn nhất cho đủ đúng `testSize`.
4. Trong mỗi topic, xáo trộn (Fisher–Yates) rồi lấy đủ số lượng.
5. Xáo trộn lần cuối toàn bộ 50 câu để các topic không đứng thành cụm.

Ví dụ với bank chuyên môn: 25/200 × 50 ≈ 6 câu từ B1, 30/200 × 50 ≈ 8 câu từ B2, … tổng đúng 50.

**Tùy chọn trước khi bắt đầu (màn hình cấu hình test):**
- Số câu: 50 (mặc định) / 30 / 100 / toàn bộ.
- Thời gian: 60 phút (mặc định cho 50 câu) / không giới hạn.
- Phạm vi: toàn bộ · chỉ khối VN · chỉ khối quốc tế · chỉ những câu từng làm sai.
- Nút **"Bắt đầu"** hiện cảnh báo: đã bắt đầu thì không xem được lời giải cho tới khi nộp bài.

## 3.2 Trong lúc làm bài

- Hiện: **số câu / tổng**, **đồng hồ đếm ngược**, thanh tiến trình.
- **Không** phản hồi đúng/sai. Đáp án đã chọn chỉ được đánh dấu là "đã chọn".
- **Được phép quay lại sửa** câu trước (khác với chế độ ôn) — giống thi trắc nghiệm thật.
- **Lưới điều hướng câu**: bảng 50 ô số, ô đã trả lời tô đậm, ô đánh dấu "xem lại" viền vàng; chạm để nhảy tới câu.
- Nút **"Đánh dấu xem lại"** cho từng câu.
- Đồng hồ về 0 → **tự động nộp bài**.
- **Chống mất bài:** ghi trạng thái bài đang làm vào localStorage sau mỗi thao tác. Mở lại app → hỏi "Bạn có bài test đang dở, tiếp tục?".
- Cảnh báo `beforeunload` khi đang làm dở.
- Nút chuyển ngữ vẫn hoạt động bình thường, đồng hồ **không** bị reset.

## 3.3 Nộp bài & màn hình kết quả

Hiện xác nhận nếu còn câu chưa trả lời ("Còn 3 câu chưa làm, vẫn nộp?").

Màn hình kết quả gồm:

1. **Điểm lớn**: `38/50 · 76%` + thời gian đã dùng.
2. **Phân tích theo topic** — bảng: topic · số câu trong đề · số đúng · tỷ lệ, sắp xếp **tỷ lệ đúng tăng dần** để điểm yếu nổi lên đầu tiên. Kèm thanh ngang trực quan.
3. **Phân tích theo độ khó** (basic / intermediate / advanced) — cho biết bạn sai vì thiếu nền tảng hay vì câu khó.
4. **Gợi ý ôn tiếp**: liệt kê 3 topic yếu nhất, mỗi topic một nút nhảy thẳng vào chế độ ôn topic đó.
5. **Xem lại toàn bộ bài**: danh sách 50 câu, mỗi câu hiện đáp án bạn chọn, đáp án đúng, **lời giải đầy đủ** + `ref`. Có bộ lọc: tất cả / chỉ câu sai / chỉ câu đánh dấu.
6. Nút **"Đưa toàn bộ câu sai vào danh sách ôn lại"**.
7. Lưu kết quả vào lịch sử (giữ 10 lần gần nhất) → trang chủ hiện biểu đồ cột đơn giản điểm qua các lần thi để thấy tiến bộ.

## 3.4 Ôn lại câu sai

- Route `#/practice/:bank/wrong` gom mọi câu có cờ `wrong: true`.
- Hoạt động y hệt chế độ ôn theo topic (có phản hồi tức thì + lời giải).
- Trả lời đúng → gỡ cờ, câu rời khỏi danh sách. Trả lời sai → giữ cờ.
- Trang chủ hiện huy hiệu số câu đang sai của từng bank.

## Kiểm tra hoàn thành Phase 3

- [x] Test chuyên môn tạo đúng **50 câu**, phân bổ theo tỷ lệ topic, không trùng câu
- [x] Trong lúc làm không lộ đáp án; quay lại sửa được; lưới điều hướng đúng trạng thái
- [x] Đồng hồ đếm ngược đúng, hết giờ tự nộp
- [x] Chấm điểm chính xác (đối chiếu thủ công 5 câu)
- [x] Đổi ngôn ngữ giữa bài không mất đáp án đã chọn, không reset đồng hồ
- [x] Tải lại trang giữa chừng → khôi phục được bài đang làm
- [x] Câu sai chảy đúng vào danh sách "ôn lại câu sai" và tự gỡ khi làm đúng
