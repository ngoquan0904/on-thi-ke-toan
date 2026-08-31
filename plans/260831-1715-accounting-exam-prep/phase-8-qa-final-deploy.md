# Phase 8 — QA, đối chiếu pháp lý & deploy hoàn chỉnh

**Mục tiêu:** Chốt chất lượng. Một bộ đề 300 câu mà có 10 câu sai đáp án còn tệ hơn bộ đề 200 câu đúng hết — vì bạn sẽ học thuộc cái sai và mang vào phòng thi.

**Ước lượng:** 2–2,5h · **Phụ thuộc:** Phase 5, 6, 7

---

## 8.1 Chạy validator ở chế độ nghiêm ngặt

```bash
node tools/validate.mjs
```

Mục tiêu: **0 lỗi và 0 cảnh báo**. Xử lý từng cảnh báo:

| Cảnh báo | Cách xử lý |
|---|---|
| W1 — đáp án đúng dài bất thường | Viết lại cho các đáp án dài tương đương, hoặc bổ sung chi tiết cho đáp án nhiễu |
| W2 — vị trí đáp án đúng lệch | Hoán vị đáp án (nhớ **hoán vị `distractors` cùng lúc** và cập nhật `answer`) |
| W3 — trùng nội dung | Xóa hoặc viết lại câu bị trùng, giữ đúng tổng số câu của topic |
| W4 — lời giải quá ngắn | Bổ sung phần "tại sao" và căn cứ |
| W5 — lệch tỷ lệ độ khó | Điều chỉnh nhãn `difficulty` hoặc thay vài câu |

## 8.2 Rà soát nội dung bằng tay (không thể tự động hóa)

**Ưu tiên rà theo mức rủi ro:**

1. **Nhóm rủi ro cao nhất — toàn bộ B6, B7, B8, B9 (49 câu).** Với mỗi câu: mở `docs/reference-2026.md`, đối chiếu số liệu trong lời giải với `ref`. Đánh dấu ✅ vào một checklist khi đã đối chiếu xong.
2. **Toàn bộ câu có phép tính** (B3, B4, B7, B12): tính lại tay, so với đáp án. Số học sai là lỗi hay gặp nhất và dễ phát hiện nhất.
3. **B2 định khoản (30 câu):** kiểm tra mỗi bút toán có cân Nợ = Có và đúng bản chất tài khoản.
4. **Đọc soát bản EN:** tìm câu dịch máy, thuật ngữ sai (`subtractable tax`, `arising cost`…). Đối chiếu nghĩa với bản VI xem có lệch không.
5. **Kiểm tra chéo `answer` với `distractors`:** phần tử tại vị trí `answer` phải là `null` — validator đã kiểm, nhưng đọc mắt thêm 10 câu ngẫu nhiên để chắc chắn logic không bị lệch ở đâu đó.

**Cách kiểm tra rẻ và hiệu quả:** làm thử 2 bài test 50 câu trên chính app. Câu nào đọc lời giải mà thấy gợn hoặc không thuyết phục → ghi lại id, sửa ngay. Đây vừa là QA vừa là buổi ôn thật.

## 8.3 Kiểm thử ứng dụng

| Hạng mục | Kiểm tra |
|---|---|
| Chức năng | Cả 2 bank vào được; đủ 20 topic hiện đúng số câu; ôn theo topic có phản hồi tức thì; test random 50 chạy đúng; chấm điểm khớp khi đối chiếu tay 5 câu |
| Chuyển ngữ | Đổi ngôn ngữ ở **mọi** màn hình (chủ, danh sách topic, đang ôn, đang test, kết quả) — không mất trạng thái, không reset đồng hồ, không mất vị trí scroll |
| Lưu trữ | Đóng trình duyệt mở lại → tiến độ, ngôn ngữ, danh sách câu sai, lịch sử điểm còn nguyên |
| Trường hợp biên | Chọn "ôn lại câu sai" khi chưa sai câu nào → hiện thông báo tử tế, không trắng màn hình. Bấm nộp bài khi chưa trả lời câu nào. Route sai (`#/practice/xxx/yyy`) → về trang chủ |
| Điện thoại | Chiều rộng 360px không tràn ngang; nút chạm ≥ 44px; nút chuyển ngữ không bị thanh trình duyệt che; chữ đọc được ngoài trời |
| Hiệu năng | Tải lần đầu trên 4G dưới 3 giây; chuyển câu không giật |
| Chế độ tối | Kiểm tra ở cả sáng và tối, đủ tương phản cho màu đúng/sai |

## 8.4 Deploy hoàn chỉnh

```bash
node tools/validate.mjs                       # phải sạch
# tăng hằng số BUILD trong assets/js/data-loader.js
git add -A
git commit -m "content: hoàn thiện 300 câu + QA"
git push
```

- Cập nhật `README.md`: link public, tổng số câu, ngày cập nhật nội dung, ghi chú *"nội dung cập nhật theo quy định pháp luật Việt Nam hiệu lực tại 31/08/2026"*.
- Mở link trên điện thoại ở chế độ ẩn danh, kiểm tra thấy nội dung mới (không phải bản cache).

## 8.5 Bàn giao

Tài liệu cuối cùng gửi lại người dùng gồm:
- **Link public** để ôn.
- **Bảng đồ nội dung** 20 topic — dùng làm danh sách kiểm tra kiến thức trước khi thi.
- **Danh sách "10 điểm dễ bị hỏi nhất mà tài liệu cũ ghi sai"** rút ra từ `docs/reference-2026.md` — đây là phần đáng đọc lại vào tối trước ngày thi.

## Kiểm tra hoàn thành Phase 8

- [ ] Validator: 300 câu, 0 lỗi, 0 cảnh báo
- [ ] Toàn bộ 49 câu nhóm thuế/chế độ đã đối chiếu tay với `docs/reference-2026.md`
- [ ] Toàn bộ câu có phép tính đã tính lại tay và khớp
- [ ] Đã làm thử trọn vẹn 2 bài test 50 câu trên app, sửa hết câu gợn
- [ ] Bảng kiểm thử ở 8.3 xanh hết
- [ ] Link public cập nhật nội dung mới, xem được trên điện thoại
- [ ] README đầy đủ, đã bàn giao 3 mục ở 8.5
