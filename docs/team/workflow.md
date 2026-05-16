# Team Workflow

## Branch

Mỗi task nên có branch riêng:

```text
feature/<short-task-name>
fix/<short-fix-name>
docs/<short-doc-name>
```

Ví dụ:

- `feature/map-layers`
- `feature/admin-destinations`
- `feature/postgis-schema`

## Pull Request

Mỗi PR cần có:

- Link issue.
- Summary thay đổi.
- Screenshot nếu là FE.
- API contract nếu là BE.
- Checklist test/lint/build đã chạy.

Reviewer chính hiện tại là `vanthinh26102005`, không nhận issue implementation chính.

## Chia Mảng Hiện Tại

| Mảng | Thành viên | Issue |
|---|---|---|
| BE API | Thoáng | #3 |
| BE DB/PostGIS | Phước Thịnh | #9 |
| FE Map/GIS layers | Vy | #6 |
| FE Destinations/Route/Weather | Đạt | #10 |
| FE Auth/Tour/Review | Hoàng Anh | #11 |
| FE Admin | Bảo Thắng | #12 |

## Quy Tắc Tránh Conflict

- Người làm BE không sửa FE nếu không cần.
- Người làm FE không sửa schema/API nếu chưa thống nhất.
- Nếu cần sửa `fe/lib/routes.ts`, báo trước vì file này ảnh hưởng navigation toàn app.
- Nếu cần đổi data shape API, cập nhật docs/backend và báo FE.
- Không commit `node_modules`, `.next`, `.DS_Store`.

## Agent/AI Folders

Team có thể dùng `.agent/`, `.agents/`, `.claude/`, `.codex/` cho workflow hoặc skill local.

Trước khi commit các folder đó:

- Chỉ commit file instruction thật sự cần share.
- Không commit token, key, cache, output tạm.
- Nếu folder chỉ phục vụ máy cá nhân, đưa vào `.gitignore`.

## Checklist PR Chung

- [ ] Scope bám issue.
- [ ] Không sửa file ngoài scope nếu không giải thích.
- [ ] App chạy được sau khi pull.
- [ ] Có cập nhật docs nếu đổi kiến trúc/API/route.
- [ ] Không để console/debug log không cần thiết.
