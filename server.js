const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.static(__dirname));

const PORT = process.env.PORT || 10000;

// الصفحة الرئيسية
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// تحميل فيديو
app.get("/download", async (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.send("❌ ضع رابط يوتيوب");
  }

  try {
    const response = await axios.get(
      "https://youtube-video-download-info.p.rapidapi.com/dl",
      {
        params: { id: url },
        headers: {
          "X-RapidAPI-Key": "48e08bf7d8msh02b813193f67b52p1788b5jsn890a5bd6e153",
          "X-RapidAPI-Host": "youtube-video-download-info.p.rapidapi.com"
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    res.send("❌ خطأ في API");
  }
});

// تحميل MP3
app.get("/mp3", async (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.send("❌ ضع رابط يوتيوب");
  }

  try {
    const response = await axios.get(
      "https://youtube-video-download-info.p.rapidapi.com/dl",
      {
        params: { id: url },
        headers: {
          "X-RapidAPI-Key": "PUT_YOUR_API_KEY_HERE",
          "X-RapidAPI-Host": "youtube-video-download-info.p.rapidapi.com"
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    res.send("❌ خطأ في API");
  }
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
