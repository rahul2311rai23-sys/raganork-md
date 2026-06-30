const { Module } = require("../main");
const fs = require("fs");
const { writeExif } = require("../lib/exif");
const { exec } = require("child_process");

Module({
  pattern: "sticker",
  fromMe: false,
  desc: "Convert image/video to sticker (HD)"
}, async (message) => {

  if (!message.reply_message)
    return message.reply("❌ Image ya video reply karo");

  let media = await message.reply_message.downloadMediaMessage();

  let input = "./temp_input";
  let output = "./temp_output.webp";

  fs.writeFileSync(input, media);

  // ffmpeg conversion (quality boost)
  await new Promise((resolve, reject) => {
    exec(`ffmpeg -i ${input} -vf "scale=512:512:force_original_aspect_ratio=decrease,fps=15" -vcodec libwebp -quality 80 -preset default -an -vsync 0 ${output}`, 
    (err) => {
      if (err) reject(err);
      else resolve();
    });
  });

  let sticker = fs.readFileSync(output);

  let finalSticker = await writeExif(sticker, {
    packname: "⚡ Raganork Stickers",
    author: message.pushName || "User"
  });

  await message.sendMessage(message.jid, finalSticker, {
    mimetype: "image/webp"
  });

  fs.unlinkSync(input);
  fs.unlinkSync(output);

});
