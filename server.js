const express = require("express");
const ytdl = require("ytdl-core");

const app = express();

app.get("/", (req, res) => {
  res.send("Video Downloader API 🚀");
});

// تحميل فيديو
app.get("/download", async (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.send("ضع رابط الفيديو");
  }

  try {
    res.header("Content-Disposition", 'attachment; filename="video.mp4"');
    ytdl(url, { format: "mp4" }).pipe(res);
  } catch (err) {
    res.send("خطأ في التحميل");
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
