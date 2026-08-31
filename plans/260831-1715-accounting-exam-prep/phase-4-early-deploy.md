# Phase 4 — Deploy sớm lên GitHub Pages

**Mục tiêu:** Có **link public dùng được ngay** khi app đã chạy nhưng nội dung mới có ~30 câu. Lý do deploy sớm: bắt lỗi đường dẫn/subpath ngay lập tức (rẻ), và bạn bắt đầu ôn trên điện thoại trong khi nội dung vẫn đang được bổ sung.

**Ước lượng:** 45 phút · **Phụ thuộc:** Phase 3 · **Chặn:** không (Phase 5–7 chạy song song được)

---

## 4.1 Chuẩn bị trước khi push

- [x] **Kiểm tra không có đường dẫn tuyệt đối.** Tìm trong toàn bộ mã nguồn: `src="/`, `href="/`, `fetch('/`, `url(/`. Tất cả phải là `./` hoặc đường dẫn tương đối trần.
- [x] `.nojekyll` tồn tại ở thư mục gốc (ngăn GitHub Pages bỏ qua file/thư mục bắt đầu bằng `_`).
- [x] `index.html` có `<meta name="viewport" content="width=device-width, initial-scale=1">`.
- [x] Thêm `<meta name="theme-color">` và một favicon dạng emoji SVG inline (tab dễ nhận ra khi ghim trên điện thoại).
- [x] Thêm `<link rel="manifest">` tối giản + `apple-mobile-web-app-capable` để **thêm được vào màn hình chính điện thoại** như một app.
- [x] `README.md` với: mục đích, link public, cấu trúc thư mục, hướng dẫn thêm câu hỏi, cách chạy validator.

## 4.2 Tạo repo và push

**Cần từ bạn:** GitHub **username** để chốt URL cuối cùng.

Tên repo đề xuất: `ke-toan-on-thi` (ngắn, gõ tay được trên điện thoại).

`gh` CLI chưa cài trên máy → dùng đường sau:

1. Vào github.com → **New repository** → tên `ke-toan-on-thi` → **Public** → **không** tick "Add README" (repo phải rỗng).
2. Tại máy:

```bash
cd "d:/Projects/Thùy Dương"
git add -A
git commit -m "feat: bộ ôn tập kế toán song ngữ - khung app + nội dung seed"
git branch -M main
git remote add origin https://github.com/<USERNAME>/ke-toan-on-thi.git
git push -u origin main
```

Lần push đầu sẽ mở cửa sổ đăng nhập của Git Credential Manager → đăng nhập bằng trình duyệt là xong, không cần tạo token thủ công.

## 4.3 Bật GitHub Pages

Repo → **Settings** → **Pages**:
- **Source:** `Deploy from a branch`
- **Branch:** `main` · **Folder:** `/ (root)`
- Save.

Chờ 1–3 phút. URL: **`https://<USERNAME>.github.io/ke-toan-on-thi/`**

## 4.4 Kiểm tra sau deploy (bắt buộc, đây là lý do deploy sớm)

- [ ] Mở link trên **máy tính** → không có lỗi 404 nào trong tab Network của DevTools
- [ ] Mở link trên **điện thoại** → giao diện vừa màn hình, không tràn ngang, chữ đọc được
- [ ] Nút chuyển ngữ nổi không bị thanh địa chỉ trình duyệt điện thoại che
- [ ] `data/manifest.json` và một file topic tải được (kiểm tra trực tiếp bằng cách mở URL của chúng)
- [ ] Làm thử 3 câu → tiến độ lưu được trên điện thoại
- [ ] "Thêm vào màn hình chính" trên điện thoại hoạt động
- [ ] Đăng xuất/dùng cửa sổ ẩn danh mở link → vẫn xem được (xác nhận repo thực sự public)

## 4.5 Quy trình cập nhật về sau

```bash
node tools/validate.mjs        # bắt buộc chạy trước mỗi lần push
git add -A && git commit -m "content: thêm topic B6 - thuế GTGT (15 câu)"
git push
```

Nếu điện thoại vẫn hiện nội dung cũ sau khi push: tăng `BUILD` trong `data-loader.js` (đây chính là cơ chế chống cache đã dựng ở Phase 2), hoặc tải lại kiểu cứng.

## Kiểm tra hoàn thành Phase 4

- [ ] Link public hoạt động, đã mở thử trên điện thoại
- [ ] Không có tài nguyên nào lỗi 404
- [ ] README ghi rõ link
- [ ] Đã lưu link vào màn hình chính điện thoại
