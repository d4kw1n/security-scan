npm-audit-container
Docker container để chạy npm audit nhằm quét lỗ hổng bảo mật trong các dự án Node.js. Container này được thiết kế để tích hợp vào GitHub Actions, giúp tự động hóa việc kiểm tra bảo mật trong quy trình CI/CD.
Mục tiêu

Xây dựng một Docker image nhẹ dựa trên node:20-alpine để chạy npm audit.
Đẩy image lên Docker Hub (d4kw1n/npm-audit:latest).
Tích hợp vào GitHub Actions để quét lỗ hổng bảo mật trong các dự án Node.js.

Yêu cầu

Docker được cài đặt trên máy cục bộ.
Tài khoản Docker Hub để đẩy image.
Repository GitHub với dự án Node.js (có package.json và package-lock.json).
Node.js 20.x (để tương thích với image).

Cấu trúc dự án
├── Dockerfile          # File định nghĩa Docker image
├── .dockerignore       # File loại bỏ các tệp không cần thiết khỏi build context
├── package.json        # File cấu hình npm tối thiểu (tùy chọn)
└── .github/
    └── workflows/
        └── npm-audit.yml  # Workflow GitHub Actions để quét bảo mật

Hướng dẫn sử dụng
1. Build Docker image

Clone repository hoặc tạo thư mục chứa các file sau:

Dockerfile: Xem nội dung
.dockerignore: Xem nội dung


Chạy lệnh build trong thư mục chứa Dockerfile:
docker build -t d4kw1n/npm-audit:latest .


Kiểm tra image đã được tạo:
docker images | grep d4kw1n



2. Kiểm tra container cục bộ
Chạy container để xác nhận npm audit hoạt động:
docker run --rm -v $(pwd):/app d4kw1n/npm-audit:latest


-v $(pwd):/app: Ánh xạ thư mục hiện tại (chứa package.json) vào /app trong container.
Container sẽ xuất kết quả npm audit ở định dạng JSON.

Lưu ý: Đảm bảo thư mục hiện tại có package.json và package-lock.json để có kết quả audit có ý nghĩa.
3. Đẩy image lên Docker Hub

Đăng nhập vào Docker Hub:docker login


Đẩy image:docker push d4kw1n/npm-audit:latest



4. Tích hợp vào GitHub Actions

Thêm file workflow vào repository của bạn tại .github/workflows/npm-audit.yml: Xem nội dung.
Commit và push lên GitHub:git add .github/workflows/npm-audit.yml
git commit -m "Add npm audit workflow"
git push origin main


Kiểm tra workflow trong tab Actions trên GitHub. Kết quả audit sẽ được lưu dưới dạng artifact (npm-audit-report).

5. Xem kết quả

Workflow tạo file audit-report.json chứa kết quả npm audit.
Tải artifact từ GitHub Actions để xem chi tiết.
Workflow sẽ thất bại nếu phát hiện lỗ hổng nghiêm trọng (critical).

File cấu hình
Dockerfile
# Sử dụng image Node.js 20 Alpine để hỗ trợ npm@latest
FROM node:20-alpine

# Tạo thư mục làm việc
WORKDIR /app

# Sao chép package.json và package-lock.json (nếu có)
COPY package*.json ./

# Kiểm tra sự tồn tại của package.json, nếu không có thì tạo file tối thiểu
RUN if [ ! -f package.json ]; then \
        echo '{"name": "npm-audit-container", "version": "1.0.0", "description": "Docker container for npm audit", "dependencies": {}}' > package.json; \
    fi && \
    if [ -f package-lock.json ]; then \
        npm ci --omit=dev; \
    else \
        npm install --omit=dev; \
    fi

# Cài đặt npm toàn cục để đảm bảo phiên bản mới nhất
RUN npm install -g npm@latest

# Lệnh mặc định để chạy npm audit
CMD ["npm", "audit", "--json"]

.dockerignore
node_modules
npm-debug.log
Dockerfile*
.git
.gitignore
*.md

GitHub Actions Workflow (npm-audit.yml)
name: Security Audit

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main
  schedule:
    - cron: '0 0 * * *' # Chạy hàng ngày lúc 00:00 UTC

jobs:
  audit:
    runs-on: ubuntu-latest

    steps:
      # Checkout mã nguồn
      - name: Checkout code
        uses: actions/checkout@v4

      # Cài đặt Node.js
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20' # Sử dụng Node.js 20 để tương thích với image

      # Cài đặt phụ thuộc
      - name: Install dependencies
        run: npm ci

      # Chạy npm audit bằng Docker container
      - name: Run npm audit
        run: |
          docker run --rm -v $(pwd):/app d4kw1n/npm-audit:latest > audit-report.json

      # Lưu kết quả audit
      - name: Upload audit report
        uses: actions/upload-artifact@v4
        with:
          name: npm-audit-report
          path: audit-report.json

      # (Tùy chọn) Kiểm tra và báo lỗi nếu có lỗ hổng nghiêm trọng
      - name: Check for critical vulnerabilities
        run: |
          if jq -e '.metadata.vulnerabilities.critical > 0' audit-report.json; then
            echo "Critical vulnerabilities found!"
            exit 1
          fi

Lưu ý

Môi trường cục bộ: Đảm bảo Docker được cài đặt và kernel Linux hỗ trợ /proc/sys/net/ipv4/ip_unprivileged_port_start (kernel 4.11+). Nếu dùng Docker Desktop trên WSL2, có thể gặp lỗi kernel; thử dùng máy Linux gốc (như Ubuntu 22.04).
Dự án Node.js: Thư mục chạy container phải chứa package.json và package-lock.json để npm audit tạo kết quả.
Tối ưu hóa: Để giảm kích thước image, có thể sử dụng multi-stage build (liên hệ để được hướng dẫn thêm).
Debug: Nếu gặp lỗi, chạy các lệnh sau và chia sẻ kết quả:docker version
uname -r
ls -la
docker images



Liên hệ

Docker Hub: d4kw1n/npm-audit
Hỗ trợ: Mở issue trên repository hoặc liên hệ qua email.


