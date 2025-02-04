const axios = require('axios');

module.exports.config = {
  name: "gpt3",
  version: 1.0,
  credits: "Developer",
  description: "An AI command powered by OpenAI",
  hasPrefix: false,
  usages: "{pn} [prompt]",
  aliases: [],
  cooldown: 5,
};

module.exports.run = async function ({ api, event, args }) {
  try {
    const prompt = args.join(" ");
    if (!prompt) {
      await api.sendMessage("Please provide a question.", event.threadID);
      return;
    }

    const initialMessage = await new Promise(resolve => {
      api.sendMessage("Thinking, please wait...", event.threadID, (err, info) => {
        resolve(info);
      }, event.messageID);
    });

    const apiUrl = `https://kaiz-apis.gleeze.com/api/gpt-3.5?q=${encodeURIComponent(prompt)}`;
    const response = await axios.get(apiUrl);
    const answer = response.data.response;

    await api.editMessage(
      `☀ | 𝗚𝗣𝗧-𝟯 𝗔𝗥𝗖𝗛𝗜𝗧𝗘𝗖𝗧𝗨𝗥𝗘\n━━━━━━━━━━━━━━━━━━\n${answer}\n━━━━━━━━━━━━━━━━━━`,
      initialMessage.messageID
    );
  } catch (error) {
    console.error("⚠️", error.message);
    await api.editMessage("An error occurred while processing your request. Please try again later.", initialMessage.messageID);
  }
};
