const express = require('express');
const fs = require('fs');
const routes = require('./routes');
require('dotenv').config();
const uploadDir = process.env.UPLOAD_DIR || 'uploads';
const PORT = process.env.PORT || 4000;

const app = express();


// Создаём папку для загрузок, если её нет
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Подключаем роуты
app.use('/', routes);

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});