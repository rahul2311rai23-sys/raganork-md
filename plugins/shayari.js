const { Module } = require("../main");
const config = require("../config");
const fromMe = config.MODE !== "public";

Module(
  {
    pattern: "shayari",
    fromMe: false, // false matlab koi bhi use kar sakta hai
    desc: "Sends a random shayari",
    type: "fun"
  },
  async (message) => {
    const shayariList = [
      "Zindagi mein bahut se rishte bante hain, lekin aap jaisa dost milna naseeb ki baat hai.",
      "Dil ke rishte bahut ajeeb hote hain, kabhi hanste hain toh kabhi rote hain.",
      "Aapki muskurahat hamari jaan hai, aap hamare liye bahut khaas hain.",
      "Khushiyan wahi hain jo baanti jayein, aur rishte wahi hain jo nibhaye jayein."
    ];

    const randomShayari = shayariList[Math.floor(Math.random() * shayariList.length)];
    
    return await message.sendReply(`*✨ Shayari:* \n\n${randomShayari}`);
  }
);
