# Backend - Hệ thống Quản lý Hợp đồng/Hồ sơ Thư viện

Node.js (Express/NestJS). Cấu trúc sẽ được thiết kế chi tiết khi bắt đầu triển khai backend.

## Định hướng cấu trúc (dự kiến)

```
backend/
├── src/
│   ├── modules/         # Mỗi module = 1 nghiệp vụ (auth, contracts, documents, borrowers, users)
│   ├── common/          # Middleware, guard, filter, decorator dùng chung
│   ├── config/          # Cấu hình env, database connection
│   └── main.ts
├── .env.example
├── package.json
└── tsconfig.json
```

> Hiện tại chỉ tạo khung thư mục `src/`, chưa cài đặt code. Sẽ hoàn thiện khi triển khai backend.
