# Backend - Hệ thống Quản lý Hợp đồng/Hồ sơ Thư viện

Node.js + Express + TypeScript, kết nối MySQL qua Prisma ORM.

## Cấu trúc thư mục

```
backend/
├── prisma/
│   ├── schema.prisma     # Định nghĩa bảng: SystemUser, SupplierContract, Reader, Book, LoanSlip
│   └── seed.ts           # Dữ liệu mẫu (tài khoản admin, hợp đồng, độc giả, sách...)
├── src/
│   ├── config/            # Cấu hình env, khởi tạo Prisma Client
│   ├── common/             # ApiError, asyncHandler, tiện ích tham số
│   ├── middlewares/        # auth (JWT), validate (zod), error handler
│   ├── modules/            # Mỗi thư mục = 1 nghiệp vụ (route + controller + service + schema)
│   │   ├── auth/             # Đăng nhập
│   │   ├── contracts/        # Hợp đồng nhà cung cấp
│   │   ├── loans/            # Phiếu mượn / trả (có nghiệp vụ trừ/cộng số lượng sách)
│   │   ├── readers/          # Hồ sơ độc giả
│   │   ├── books/            # Hồ sơ sách / tài liệu
│   │   ├── users/            # Người dùng hệ thống (chỉ admin)
│   │   └── dashboard/        # Số liệu tổng quan
│   ├── routes/index.ts     # Gộp router của các module dưới tiền tố /api
│   ├── app.ts               # Cấu hình Express (cors, json, error handler)
│   └── server.ts            # Điểm khởi chạy server
├── .env.example
├── package.json
└── tsconfig.json
```

## Cài đặt & chạy

```bash
npm install
cp .env.example .env      # chỉnh DATABASE_URL trỏ tới MySQL (XAMPP) của bạn
npm run prisma:migrate    # tạo bảng trong database theo schema.prisma
npm run prisma:seed       # tạo dữ liệu mẫu + tài khoản đăng nhập
npm run dev                # chạy server tại http://localhost:4000
```

Tài khoản sau khi seed:
- `admin` / `admin` — quản trị viên, toàn quyền (dùng để đăng nhập nhanh khi test).
- `hoa.pham@thuvien.edu.vn` / `123456` — quản trị viên mẫu.
- `long.nguyen@thuvien.edu.vn` / `123456` — thủ thư mẫu (không có quyền quản lý người dùng, không xóa được hợp đồng/độc giả/sách).

## Quy ước

- Mỗi module theo pattern: `*.routes.ts` (khai báo endpoint) → `*.controller.ts` (nhận request, trả response) → `*.service.ts` (nghiệp vụ, gọi Prisma) → `*.schema.ts` (validate bằng zod).
- Route cần đăng nhập dùng middleware `requireAuth`; route chỉ admin dùng thêm `requireRole('admin')`.
- Toàn bộ API nằm dưới tiền tố `/api` (ví dụ `/api/contracts`, `/api/loans/:id/return`).
