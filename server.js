const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.static(__dirname));

const PORT = process.env.PORT || 10000;

// استخراج ID من رابط يوتيوب
function getVideoId(url) {
  if (url.includes("youtu.be")) {
    return url.split("/").pop();
  } else if (url.includes("youtube.com")) {
    return url.split("v=")[1]?.split("&")[0];
  }
  return url;
}

// الصفحة الرئيسية
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// تحميل فيديو
app.get("/download", async (req, res) => {
  try {
    const videoId = getVideoId(req.query.url);

    const options = {
      method: "GET",
      url: "https://youtube-video-download-info.p.rapidapi.com/dl",
      params: { id: videoId },
      headers: {
        "X-RapidAPI-Key": "48e08bf7d8msh02b813193f67b52p1788b5jsn890a5bd6e153",
        "X-RapidAPI-Host": "youtube-video-download-info.p.rapidapi.com"
      }
    };

    const response = await axios.request(options);

    // إرسال رابط مباشر (أفضل من JSON)
    const link = response.data?.formats?.[0]?.url;

    if (!link) {
      return res.send("❌ لم يتم العثور على رابط التحميل");
    }

    res.redirect(link);

  } catch (err) {
    res.send("❌ خطأ في تحميل الفيديو");
  }
});

// تحميل MP3
app.get("/mp3", async (req, res) => {
  try {
    const videoId = getVideoId(req.query.url);

    const options = {
      method: "GET",
      url: "https://youtube-video-download-info.p.rapidapi.com/dl",
      params: { id: videoId },
      headers: {
        "X-RapidAPI-Key": "48e08bf7d8msh02b813193f67b52p1788b5jsn890a5bd6e153",
        "X-RapidAPI-Host": "youtube-video-download-info.p.rapidapi.com"
      }
    };

    const response = await axios.request(options);

    const audio = response.data?.adaptiveFormats?.find(f => f.mimeType.includes("audio"));

    if (!audio) {
      return res.send("❌ لا يوجد MP3");
    }

    res.redirect(audio.url);

  } catch (err) {
    res.send("❌ خطأ في MP3");
  }
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
