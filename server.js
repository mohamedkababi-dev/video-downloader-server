const express = require("express");
const ytdl = require("ytdl-core");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());

// الصفحة الرئيسية (واجهة الموقع)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// تحميل فيديو
app.get("/download", async (req, res) => {
  try {
    let url = req.query.url;

    if (!url) return res.send("❌ ضع رابط الفيديو");

    // تنظيف الرابط (يحذف ?si وغيرها)
    url = url.split("&")[0];

    if (!ytdl.validateURL(url)) {
      return res.send("❌ رابط غير صالح");
    }

    res.header("Content-Disposition", 'attachment; filename="video.mp4"');
    ytdl(url, { quality: "highestvideo" }).pipe(res);

  } catch (err) {
    console.log(err);
    res.status(500).send("❌ خطأ في السيرفر");
  }
});

// تحميل MP3
app.get("/mp3", async (req, res) => {
  try {
    let url = req.query.url;

    if (!url) return res.send("❌ ضع رابط الفيديو");

    url = url.split("&")[0];

    if (!ytdl.validateURL(url)) {
      return res.send("❌ رابط غير صالح");
    }

    res.header("Content-Disposition", 'attachment; filename="audio.mp3"');
    ytdl(url, { filter: "audioonly" }).pipe(res);

  } catch (err) {
    console.log(err);
    res.status(500).send("❌ خطأ في السيرفر");
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 Server running on port " + PORT);
});
