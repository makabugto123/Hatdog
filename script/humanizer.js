const axios = require('axios');

module.exports.config = {
  name: "humanizer",
  version: 1.0,
  credits: "heru",
  description: "API to humanize given text + Ai Detector",
  hasPrefix: false,
  usages: "{pn} [text]",
  aliases: [],
  cooldown: 0,
};

module.exports.run = async function ({ api, event, args }) {
  try {
    const text = args.join(" ");
    if (!text) {
      await api.sendMessage("Please provide some text to humanize and to detect if the word is AI.", event.threadID);
      return;
    }

    const initialMessage = await new Promise(resolve => {
      api.sendMessage("Processing, please wait...", event.threadID, (err, info) => {
        resolve(info);
      }, event.messageID);
    });

    const response = await axios.get(`https://betadash-api-swordslush.vercel.app/humanize?text=${encodeURIComponent(text)}`);
    const humanizedText = response.data.message;
    
    
        const bundat = await axios.get(`https://betadash-api-swordslush.vercel.app/aidetect?text=${encodeURIComponent(humanizedText)}`);
        
        const mes = bundat.data.message;
        const isHuman = bundat.data.data.isHuman;
        const aiWords = bundat.data.data.aiWords;



    await api.editMessage(
      `🤖 𝗛𝗨𝗠𝗔𝗡𝗜𝗭𝗘𝗥\n━━━━━━━━━━━━━━━━━━\n${humanizedText}\n\n
      🤖 𝗔𝗜 𝗗𝗘𝗧𝗘𝗖𝗧𝗢𝗥\n━━━━━━━━━━━━━━━━━━\n💌𝙈𝙚𝙨𝙨𝙖𝙜𝙚: ${mes}\n👭𝙄𝙎𝙃𝙐𝙈𝘼𝙉: ${isHuman}\n🤖𝗜𝗦 𝗔𝗜: ${aiWords}\n`,
      initialMessage.messageID
    );
  } catch (error) {
    console.error("⚠️", error.message);
    await api.editMessage("An error occurred while processing your request. Please try again later.", initialMessage.messageID);
  }
};
