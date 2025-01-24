const axios = require("axios");
const fs = require("fs");

module.exports.config = {
  name: "recog",
  version: "1.0",
  credits: "cliff",
  cooldown: 0,
  role: 0,
  aliases: ["recog", "regco"],
  hasPrefix: false,
  usage: "{p}{n}",
  description: "recognize music",
};

module.exports.run = async function ({ api, event }) {
  try {
    const { messageReply } = event;

    if (
      event.type !== "message_reply" ||
      !messageReply.attachments ||
      messageReply.attachments.length === 0
    ) {
      return api.sendMessage(
        "Reply to a short audio or video",
        event.threadID,
        event.messageID
      );
    }

    const fileUrl = messageReply.attachments[0].url;

    const res = await axios.get(`https://yt-video-production.up.railway.app/recognize?fileUrl=${encodeURIComponent(fileUrl)}`
    );
    
    const ambot = await api.sendMessage(`𝚁𝚎𝚌𝚘𝚐𝚗𝚒𝚣𝚒𝚗𝚐....`, event.threadID);

    const metadata = res.data.track.sections.find(section => section.type === "SONG").metadata;
    const album = metadata.find(item => item.title === "Album")?.text || "Unknown Album";
    const label = metadata.find(item => item.title === "Label")?.text || "Unknown Label";
    const released = metadata.find(item => item.title === "Released")?.text || "Unknown Year"; 
    const text = res.data.track.share.subject;
    const images = res.data.track.sections[0].metapages.map((page) => page.image);
    const audioUrl = res.data.track.hub.actions[1].uri;

    const img = [];
    for (let i = 0; i < images.length; i++) {
      const imageBuffer = (
        await axios.get(images[i], { responseType: "arraybuffer" })
      ).data;
      const path = `${__dirname}/cache/image${i}.jpg`;
      fs.writeFileSync(path, imageBuffer);
      img.push(fs.createReadStream(path));
    }

    const aud = (await axios.get(audioUrl, { responseType: "stream" })).data;
    
    api.unsendMessage(ambot.messageID);

    api.sendMessage(
      {
        body: `𝗧𝗶𝘁𝗹𝗲: ${res.data.track.title}\n𝗔𝗿𝘁𝗶𝘀𝘁: ${res.data.track.subtitle}\n𝗔𝗹𝗯𝘂𝗺: ${album}\n𝗟𝗮𝗯𝗲𝗹: ${label}\n𝗥𝗲𝗹𝗲𝗮𝘀𝗲𝗱: ${released}`,
        attachment: img,
      },
      event.threadID,
      () => {
        api.sendMessage(
          {
            attachment: aud,
          },
          event.threadID,
          event.messageID
        );
      }
    );
  } catch (error) {
    api.sendMessage("Not found Recognize that music",
      event.threadID,
      event.messageID
    );
  } finally {
    fs.readdirSync(`${__dirname}/cache`).forEach((file) => {
      if (file.startsWith("image") && file.endsWith(".jpg")) {
        fs.unlinkSync(`${__dirname}/cache/${file}`);
      }
    });
  }
};
