const { Module } = require("../main");
const { downloadVideo, searchYoutube } = require("./utils/yt");
const fs = require("fs");

Module(
  {
    pattern: "ytv ?(.*)",
    desc: "Download a YouTube video.",
    use: "media",
  },
  async (message, match) => {
    try {
      const query = match[1];
      if (!query) return await message.sendReply("_Provide a YouTube video link or search query!_ ");

      await message.react("🔍");
      let videoUrl = query;

      if (!query.startsWith("http") && !query.startsWith("https")) {
        const searchResults = await searchYoutube(query, 1);
        if (!searchResults.length) {
          return await message.sendReply("_No YouTube video found for your query._");
        }
        videoUrl = searchResults[0].url;
      }

      await message.react("⬇️");
      const videoPath = await downloadVideo(videoUrl, "360p");

      if (videoPath) {
        await message.sendMessage({ url: videoPath }, "video", {
          caption: `_Downloaded from YouTube: ${videoUrl}_`,
          mimetype: "video/mp4",
        });
        fs.unlinkSync(videoPath);
      } else {
        await message.sendReply("_Failed to download the YouTube video._");
      }
    } catch (error) {
      await message.sendReply(`_Error: ${error.message}_`);
    }
  }
);
