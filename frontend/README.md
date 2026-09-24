# Frontend - Hệ thống Quản lý Hợp đồng/Hồ sơ Thư viện

React + Vite + TypeScript. Tổ chức theo hướng **feature-based** kết hợp các layer dùng chung.

## Cấu trúc thư mục

```
frontend/
├── public/                  # Tài nguyên tĩnh (favicon, index.html...)
├── src/
│   ├── assets/               # Ảnh, icon, font
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   │
│   ├── components/            # Component dùng chung, không gắn với 1 nghiệp vụ cụ thể
│   │   ├── common/             # Button, Input, Modal, Table, Pagination...
│   │   ├── layout/             # Header, Sidebar, Footer, MainLayout
│   │   └── ui/                 # Component UI thuần trang trí (Badge, Spinner...)
│   │
│   ├── features/              # Mỗi thư mục = 1 nghiệp vụ, tự chứa component/hook/service riêng
│   │   ├── auth/                # Đăng nhập, phân quyền
│   │   ├── contracts/           # Quản lý hợp đồng (nhà cung cấp, thanh lý...)
│   │   ├── documents/           # Quản lý hồ sơ/tài liệu
│   │   ├── borrowers/           # Quản lý độc giả / người mượn
│   │   ├── users/               # Quản lý người dùng hệ thống (admin, thủ thư)
│   │   └── dashboard/           # Trang tổng quan, thống kê
│   │
│   ├── hooks/                 # Custom hooks dùng chung (useDebounce, usePagination...)
│   ├── services/              # Gọi API (axios instance, các hàm gọi endpoint theo module)
│   ├── store/                  # Quản lý state toàn cục (Redux Toolkit / Zustand)
│   ├── routes/                 # Khai báo route, route guard theo phân quyền
│   ├── types/                   # Định nghĩa TypeScript type/interface dùng chung
│   ├── utils/                   # Hàm tiện ích (format ngày, validate...)
│   ├── constants/               # Hằng số (enum trạng thái hợp đồng, role...)
│   ├── config/                  # Cấu hình app (env, base URL...)
│   ├── styles/                  # CSS/SCSS toàn cục, biến theme
│   ├── App.tsx
│   └── main.tsx
│
├── .env.example
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Quy ước

- Mỗi thư mục trong `features/` chỉ chứa code riêng của nghiệp vụ đó (components, hooks, api con, types con). Cái gì dùng chung ≥ 2 feature mới đưa lên `components/`, `hooks/`, `types/` ở ngoài.
- `services/` là nơi duy nhất gọi API — component không gọi `fetch`/`axios` trực tiếp.
- Đặt tên component theo PascalCase, hook theo `useXxx`.
