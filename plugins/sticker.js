const { Module } = require("../main");
const fs = require("fs");
const { exec } = require("child_process");
const { writeExif } = require("../lib/exif");

Module({
  pattern: "sticker",
  fromMe: false,
  desc: "Convert image/video to sticker"
}, async (message) => {

  if (!message.reply_message)
    return message.reply("❌ Image ya video reply karo");

  let media = await message.reply_message.downloadMediaMessage();

  let input = "./temp_input";
  let output = "./temp_output.webp";

  // SAFE BUFFER FIX (important)
  let buffer = Buffer.isBuffer(media)
    ? media
    : Buffer.from(media, "base64");

  fs.writeFileSync(input, buffer);

  // FFmpeg conversion (stable + HD)
  await new Promise((resolve, reject) => {
    exec(
      `ffmpeg -y -i ${input} -vf "scale=512:512:force_original_aspect_ratio=decrease,fps=15" -vcodec libwebp -lossless 1 -qscale 80 -preset default -an ${output}`,
      (err) => {
        if (err) return reject(err);
        resolve();
      }
    );
  });

  let stickerBuffer = fs.readFileSync(output);

  // EXIF (packname fix)
  let finalSticker = await writeExif(stickerBuffer, {
    packname: "⚡ Queen Riam",
    author: message.pushName || "User"
  });

  await message.sendMessage(message.jid, finalSticker, {
    mimetype: "image/webp"
  });

  // cleanup
  fs.unlinkSync(input);
  fs.unlinkSync(output);

});
