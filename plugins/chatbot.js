Module(
  {
    on: "text",
    fromMe: false,
  },
  async (message) => {
    try {
      const chatJid = message.jid;
      const senderJid = message.sender;
      const isGroup = message.isGroup;
      const isDM = !isGroup;

      if (!isChatbotEnabled(chatJid)) {
        return;
      }

      // MODIFIED: Ab bot apne khud ke messages par reply karega agar wo "Message Yourself" hai
      if (message.fromMe && chatJid !== senderJid) {
        return;
      }

      if (!config.GEMINI_API_KEY) {
        return;
      }

      let shouldRespond = false;
      const messageText = message.text;
      if (isDM) {
        shouldRespond = true;
      } else if (isGroup) {
        const botJid = message.client.user?.lid;

        if (message.mention && message.mention.length > 0) {
          const botMentioned = message.mention.some((jid) => {
            const mentionedNum = jid.split("@")[0];
            const botNum = botJid?.split(":")[0];
            return mentionedNum === botNum;
          });
          if (botMentioned) shouldRespond = true;
        }

        if (message.reply_message && message.reply_message.jid) {
          const repliedToNum = message.reply_message.jid.split("@")[0];
          const botNum = botJid?.split(":")[0];
          if (repliedToNum === botNum) shouldRespond = true;
        }
      }

      if (!shouldRespond) {
        return;
      }

      let imageBuffer = null;
      let responseText = messageText;

      if (message.reply_message && message.reply_message.image) {
        try {
          imageBuffer = await message.reply_message.download("buffer");

          if (!messageText || messageText.length < 2) {
            responseText = "What do you see in this image?";
          }
        } catch (error) {
          console.error("Error downloading image:", error);
          return await message.sendReply(
            "_❌ Failed to download image. Please try again._"
          );
        }
      } else if (messageText.length < 2) {
        return;
      }

      let commandPrefixes = [];
      if (config.HANDLERS === "false") {
        commandPrefixes = [];
      } else {
        const handlers = config.HANDLERS || ".,";
        if (typeof handlers === "string") {
          commandPrefixes = handlers.split("").filter((char) => char.trim());
        }
      }

      if (
        commandPrefixes.length > 0 &&
        commandPrefixes.some((prefix) => responseText.startsWith(prefix))
      ) {
        return;
      }

      const aiResponse = await getAIResponse(
        responseText,
        chatJid,
        imageBuffer
      );

      if (aiResponse) {
        await message.sendReply(aiResponse);
      }
    } catch (error) {
      console.error("Error in message handler:", error);
    }
  }
);
