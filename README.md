# Hệ thống Quản lý Hợp đồng/Hồ sơ cho Thư viện

Ứng dụng quản lý hợp đồng và hồ sơ (mượn/trả, hợp đồng nhà cung cấp, hồ sơ độc giả...) cho thư viện.

## Kiến trúc dự án

Monorepo chia theo 3 tầng, mỗi tầng phát triển và triển khai độc lập:

```
quanlyduan/
├── frontend/   # Giao diện người dùng - React + Vite + TypeScript
├── backend/    # API server - Node.js (Express/NestJS)
├── database/   # Schema, migrations, seed data - MySQL
└── docs/       # Tài liệu thiết kế, đặc tả nghiệp vụ
```

Chi tiết cấu trúc từng phần xem README trong thư mục tương ứng:
- [frontend/README.md](frontend/README.md)
- [backend/README.md](backend/README.md)
- [database/README.md](database/README.md)

## Công nghệ dự kiến

| Tầng      | Công nghệ                  |
|-----------|-----------------------------|
| Frontend  | React, Vite, TypeScript     |
| Backend   | Node.js, Express/NestJS     |
| Database  | MySQL                       |

## Trạng thái hiện tại

Đang thiết kế và xây dựng **Frontend**.
