const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();

// قراءة الملفات من public
app.use(express.static("public"));

// الصفحة الرئيسية
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// تحميل فيديو
app.get("/video", async (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.send("❌ ضع رابط الفيديو");
  }

  try {
    const options = {
      method: "GET",
      url: "https://youtube-media-downloader.p.rapidapi.com/v2/video/details",
      params: { url: url },
      headers: {
        "X-RapidAPI-Key": "48e08bf7d8msh02b813193f67b52p1788b5jsn890a5bd6e153",
        "X-RapidAPI-Host": "youtube-media-downloader.p.rapidapi.com"
      }
    };

    const response = await axios.request(options);

    const video = response.data?.data?.videos?.[0]?.url;

    if (!video) {
      return res.send("❌ لم يتم العثور على فيديو");
    }

    res.redirect(video);

  } catch (err) {
    res.send("❌ خطأ في تحميل الفيديو");
  }
});

// تحميل MP3
app.get("/mp3", async (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.send("❌ ضع رابط الفيديو");
  }

  try {
    const options = {
      method: "GET",
      url: "https://youtube-media-downloader.p.rapidapi.com/v2/video/details",
      params: { url: url },
      headers: {
        "X-RapidAPI-Key": "48e08bf7d8msh02b813193f67b52p1788b5jsn890a5bd6e153",
        "X-RapidAPI-Host": "youtube-media-downloader.p.rapidapi.com"
      }
    };

    const response = await axios.request(options);

    const audio = response.data?.data?.audios?.[0]?.url;

    if (!audio) {
      return res.send("❌ لم يتم العثور على MP3");
    }

    res.redirect(audio);

  } catch (err) {
    res.send("❌ خطأ في تحميل MP3");
  }
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
