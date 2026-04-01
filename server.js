const express = require('express');
const ytdl = require('ytdl-core');
const path = require('path');

const app = express();

// عرض الصفحة
app.use(express.static(path.join(__dirname, 'public')));

// تحميل MP3
app.get('/mp3', async (req, res) => {
  const url = req.query.url;

  if (!ytdl.validateURL(url)) {
    return res.send('❌ رابط غير صالح');
  }

  res.header('Content-Disposition', 'attachment; filename="audio.mp3"');
  ytdl(url, { filter: 'audioonly' }).pipe(res);
});

// تحميل فيديو
app.get('/video', async (req, res) => {
  const url = req.query.url;

  if (!ytdl.validateURL(url)) {
    return res.send('❌ رابط غير صالح');
  }

  res.header('Content-Disposition', 'attachment; filename="video.mp4"');
  ytdl(url, { quality: 'highestvideo' }).pipe(res);
});

app.listen(10000, () => {
  console.log('🚀 Server running on port 10000');
});
