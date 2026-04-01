const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

// الصفحة الرئيسية
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// تحميل فيديو عبر API
app.get("/download", async (req, res) => {
  try {
    const videoURL = req.query.url;

    if (!videoURL) {
      return res.send("❌ ضع رابط الفيديو");
    }

    // طلب من API (مثال YouTube Downloader)
    const response = await axios.get("https://youtube-media-downloader.p.rapidapi.com/v2/video/details", {
      params: { url: videoURL },
      headers: {
        "X-RapidAPI-Key": "48e08bf7d8msh02b813193f67b52p1788b5jsn890a5bd6e153",
        "X-RapidAPI-Host": "youtube-media-downloader.p.rapidapi.com"
      }
    });

    const data = response.data;

    // اختيار أول رابط تحميل
    const downloadLink = data.videos.items[0].url;

    if (!downloadLink) {
      return res.send("❌ لم يتم العثور على رابط تحميل");
    }

    // إعادة التوجيه للتحميل
    res.redirect(downloadLink);

  } catch (err) {
    console.log(err.response?.data || err.message);
    res.send("❌ خطأ في API أو الرابط غير صالح");
  }
});

// تشغيل السيرفر
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
