const TelegramBot = require("node-telegram-bot-api");
const ytdl = require("ytdl-core");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const express = require("express");
const fs = require("fs");

ffmpeg.setFfmpegPath(ffmpegPath);

const TOKEN = process.env.BOT_TOKEN;

const bot = new TelegramBot(TOKEN, { polling: true });

// سيرفر Render
const app = express();
app.get("/", (req, res) => res.send("Bot is running ✅"));
app.listen(process.env.PORT || 10000);

// تخزين روابط المستخدم
let userLinks = {};

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (!text) return;

  if (!ytdl.validateURL(text)) {
    return bot.sendMessage(chatId, "❌ أرسل رابط يوتيوب صحيح");
  }

  userLinks[chatId] = text;

  bot.sendMessage(chatId, "اختر نوع التحميل 👇", {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "🎬 فيديو", callback_data: "video" },
          { text: "🎵 MP3", callback_data: "mp3" }
        ]
      ]
    }
  });
});

// عند الضغط على زر
bot.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;
  const type = query.data;
  const url = userLinks[chatId];

  if (!url) {
    return bot.sendMessage(chatId, "❌ أرسل الرابط مرة أخرى");
  }

  try {
    bot.sendMessage(chatId, "⏳ جاري التحميل...");

    if (type === "video") {
      const video = ytdl(url, { quality: "18" });
      return bot.sendVideo(chatId, video);
    }

    if (type === "mp3") {
      const filePath = `audio_${chatId}.mp3`;

      ytdl(url, { filter: "audioonly" })
        .pipe(fs.createWriteStream(filePath))
        .on("finish", () => {
          ffmpeg(filePath)
            .toFormat("mp3")
            .on("end", () => {
              bot.sendAudio(chatId, filePath).then(() => {
                fs.unlinkSync(filePath);
              });
            })
            .run();
        });
    }

  } catch (err) {
    bot.sendMessage(chatId, "❌ خطأ أثناء التحميل");
  }
});
