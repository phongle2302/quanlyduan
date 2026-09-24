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

Lệnh seed sẽ **xóa sạch dữ liệu cũ** rồi tạo lại bộ dữ liệu mẫu đầy đủ: 3 tài khoản, 10 hợp đồng, 15 độc giả, 20 đầu sách và 18 phiếu mượn/trả (ngày tháng tính theo thời điểm chạy nên luôn có hợp đồng sắp hết hạn và phiếu quá hạn thực tế).

Tài khoản sau khi seed:
- `admin` / `admin` — quản trị viên, toàn quyền.
- `lananh.nguyen@thuvien.edu.vn` / `123456` — thủ thư.
- `quocbao.tran@thuvien.edu.vn` / `123456` — thủ thư (không quản lý được người dùng, không xóa được hợp đồng/độc giả/sách).

Mã của hợp đồng, độc giả, sách và phiếu mượn được **backend tự sinh tăng dần** (`HD-2026-001`, `DG-00001`, `S-00001`, `PM-000001`), không cần nhập tay khi thêm mới.

## Quy ước

- Mỗi module theo pattern: `*.routes.ts` (khai báo endpoint) → `*.controller.ts` (nhận request, trả response) → `*.service.ts` (nghiệp vụ, gọi Prisma) → `*.schema.ts` (validate bằng zod).
- Route cần đăng nhập dùng middleware `requireAuth`; route chỉ admin dùng thêm `requireRole('admin')`.
- Toàn bộ API nằm dưới tiền tố `/api` (ví dụ `/api/contracts`, `/api/loans/:id/return`).
