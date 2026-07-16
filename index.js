const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const { Pool } = require('pg');

const pool = new Pool({
// Render sẽ tự động truyền chuỗi kết nối của Aiven từ biến môi trường vào đây
connectionString: process.env.DATABASE_URL,
ssl: {
// Bắt buộc giữ cấu hình này để chấp nhận chứng chỉ SSL bảo mật từ Aiven trên cloud
rejectUnauthorized: false
}
});

// Middleware để Express có thể đọc được dữ liệu JSON từ request body
app.use(express.json());

// Giả lập một database nhỏ bằng mảng dữ liệu (Data Mockup)
let users = [
{ id: 1, name: "Nguyễn Văn A", email: "a@gmail.com" },
{ id: 2, name: "Trần Thị B", email: "b@gmail.com" }
];

// 1. GET - Lấy toàn bộ danh sách users
app.get('/api/users', (req, res) => {
res.status(200).json(users);
});

// 2. GET - Lấy thông tin chi tiết của 1 user theo ID
app.get('/api/users/:id', (req, res) => {
const userId = parseInt(req.params.id);
const user = users.find(u => u.id === userId);

if (!user) {
return res.status(404).json({ message: "Không tìm thấy người dùng!" });
}
res.status(200).json(user);
});

// 3. POST - Thêm mới một user
app.post('/api/users', (req, res) => {
const { name, email } = req.body;

if (!name || !email) {
return res.status(400).json({ message: "Vui lòng nhập đầy đủ name và email" });
}

const newUser = {
id: users.length + 1,
name: name,
email: email
};

users.push(newUser);
res.status(201).json({ message: "Tạo user thành công!", data: newUser });
});

// 4. PUT - Cập nhật toàn bộ thông tin user theo ID
app.put('/api/users/:id', (req, res) => {
const userId = parseInt(req.params.id);
const user = users.find(u => u.id === userId);

if (!user) {
return res.status(404).json({ message: "Không tìm thấy người dùng để cập nhật!" });
}

user.name = req.body.name || user.name;
user.email = req.body.email || user.email;

res.status(200).json({ message: "Cập nhật thành công!", data: user });
});

// 5. DELETE - Xóa một user theo ID
app.delete('/api/users/:id', (req, res) => {
const userId = parseInt(req.params.id);
const userIndex = users.findIndex(u => u.id === userId);

if (userIndex === -1) {
return res.status(404).json({ message: "Không tìm thấy người dùng để xóa!" });
}

users.splice(userIndex, 1);
res.status(200).json({ message: "Xóa người dùng thành công!" });
});


// Khởi chạy server tại cổng 3000
app.listen(PORT, () => {
console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
});


