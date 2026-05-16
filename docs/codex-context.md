# Codex Context

Đọc file này khi bắt đầu một phiên Codex mới trong repo.

## Repo

Repo GitHub: `vanthinh26102005/ie402-gis-nhom-4`

Thư mục chính:

- `be/`: backend Express/PostgreSQL.
- `fe/`: frontend Next.js App Router.
- `docs/`: tài liệu project từ báo cáo và source hiện tại.

## Báo Cáo Gốc

File báo cáo nằm ngoài repo:

```text
/Users/a23521500/Documents/NAM_3/IE402-GIS/FINAL/IE402.Q21_DoAn_Nhom4.docx
```

Khi cần kiểm tra lại yêu cầu nghiệp vụ, dùng Documents plugin đọc file này.

## Nắm Nhanh Project

Ứng dụng là WebGIS du lịch 2D cho Quảng Trị - Huế - Đà Nẵng.

Core cần làm:

- Bản đồ 2D đa lớp.
- Điểm du lịch, dịch vụ hỗ trợ, ranh giới, tuyến đường.
- Tìm kiếm/lọc/chi tiết POI.
- Chỉ đường/tạo tour/đánh giá.
- Thời tiết/giao thông/thông báo.
- Admin CRUD dữ liệu.

Không mặc định làm:

- GIS 3D.
- HBIM.
- Point cloud.
- Payment/booking thật.
- IoT/camera/trạm đo thật.

## Lệnh Hay Dùng

Frontend:

```bash
npm --prefix fe install
npm --prefix fe run dev
npm --prefix fe run lint
npm --prefix fe run build
```

Backend:

```bash
npm --prefix be install
cd be && docker compose up -d
npm --prefix be run dev
```

## Lưu Ý Git

Repo đã từng có lỗi folder duplicate `BE/FE` và `be/fe`. Canonical path là lowercase:

- `be/`
- `fe/`

Không tạo lại folder uppercase.
