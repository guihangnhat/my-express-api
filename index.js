require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Cấu hình kết nối Pool tới Neon.tech
const pool = new Pool({
connectionString: process.env.DATABASE_URL,
ssl: {
rejectUnauthorized: false, // Bắt buộc phải có để tránh lỗi chứng chỉ SSL tự ký trên cloud
},
});

// Định nghĩa một route test lấy dữ liệu thời gian từ Postgres
app.get('/test-db', async (req, res) => {
try {
const client = await pool.connect();
const result = await client.query('SELECT NOW()');
client.release(); // Giải phóng client về lại pool

res.json({
success: true,
message: "Kết nối Neon.tech thành công!",
time: result.rows[0].now
});
} catch (err) {
console.error(err);
res.status(500).json({ success: false, error: err.message });
}
});

app.listen(PORT, () => {
console.log(`Server đang chạy tại port ${PORT}`);
});
