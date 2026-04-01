const TelegramBot = require("node-telegram-bot-api");
const ytdl = require("ytdl-core");

// ضع توكن البوت هنا
const TOKEN = "8358470857:AAHczciOJHnj8hSnwmFAhM8MBc9mSo4-38o";

const bot = new TelegramBot(TOKEN, { polling: true });

// رسالة البداية
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "👋 أرسل رابط YouTube لتحميله 🎬 أو 🎵");
});

// استقبال الرابط
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const url = msg.text;

  if (!url.includes("http")) return;

  if (!ytdl.validateURL(url)) {
    return bot.sendMessage(chatId, "❌ رابط غير صالح");
  }

  bot.sendMessage(chatId, "⏳ جاري المعالجة...");

  try {
    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title;

    // إرسال أزرار
    bot.sendMessage(chatId, `🎬 ${title}\nاختر التحميل:`, {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "📥 تحميل فيديو",
              url: url
            },
            {
              text: "🎵 تحميل MP3",
              url: `https://www.yt-download.org/api/button/mp3/${info.videoDetails.videoId}`
            }
          ]
        ]
      }
    });

  } catch (err) {
    bot.sendMessage(chatId, "❌ خطأ في تحميل الفيديو");
  }
});
