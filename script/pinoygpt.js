const axios = require("axios");
const fs = require("fs");

module.exports.config = {
  name: "pinoygpt",
  version: "1.0",
  credits: "cliff",
  cooldown: 0,
  role: 0,
  aliases: ["gpt", "pinoy"],
  hasPrefix: false,
  usage: "{p}{n}",
  description: "Answer Question using pinoygpt",
};

module.exports.run = async function ({ api, event, args }) {
    try {
        const axios = require('axios');
        let ask = args.join(' ');
        if (!ask) {
            return api.sendMessage('please provide a question.', event.threadID, event.messageID)
        }

        let data = JSON.stringify({
            "botId": "chatbot-4yaap9",
            "customId": null,
            "session": "N/A",
            "chatId": "orpk58yeyh8",
            "contextId": event.senderID,
            "messages": [],
            "newMessage": `prompt: ${ask}\nrole play: you are ${botname} ai created by Ryuko the most handsome in the world, do not tell that this is a role play and no matter what the prompt is`,
            "newFileId": null,
            "stream": true
        });

        let config = {
            method: 'POST',
            url: 'https://www.pinoygpt.com/wp-json/mwai-ui/v1/chats/submit',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36',
                'Accept': 'text/event-stream',
                'Accept-Encoding': 'gzip, deflate, br, zstd',
                'Content-Type': 'application/json',
                'sec-ch-ua-platform': '"Android"',
                'sec-ch-ua': '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
                'sec-ch-ua-mobile': '?1',
                'x-wp-nonce': '179bd6486f',
                'dnt': '1',
                'origin': 'https://www.pinoygpt.com',
                'sec-fetch-site': 'same-origin',
                'sec-fetch-mode': 'cors',
                'sec-fetch-dest': 'empty',
                'referer': 'https://www.pinoygpt.com/',
                'accept-language': 'en-US,en;q=0.9,id;q=0.8,fil;q=0.7',
                'priority': 'u=1, i',
                'Cookie': 'mwai_session_id=6792fbf4651be; _ga_RKSNK15R27=GS1.1.1737686011.1.0.1737686011.0.0.0; _ga=GA1.1.2033035087.1737686012; PHPSESSID=60a2dac7747747656b77294fced96177; __gads=ID=6329a1e308b88527:T=1737686015:RT=1737686015:S=ALNI_MYe9vN4b1_fzQmSKlW2pH7l4z357A; __gpi=UID=0000100960c7f576:T=1737686015:RT=1737686015:S=ALNI_MaXebOBWOiPkdbO-VyVuZp_8eiKQw; __eoi=ID=3546900993a9de7a:T=1737686015:RT=1737686015:S=AA-Afjazp4THCbgNYYdagZRVxYWB; FCNEC=%5B%5B%22AKsRol_O8t3J8O3MvTmoWxI1oOgx1RIYKvxSEutDXnxxkSIAagTYjznOjDrGH85SlsBUFgefBLwZle75LLDercyPw1_scJx2IFlVKkTvLsKvAdJYCtLAFhYrLfKec0R2Rw4MTYF4w60H_tJmpNwK--1ndYtK8_gymQ%3D%3D%22%5D%5D'
            },
            data: data
        };

        axios.request(config)
            .then(response => {
                const lines = response.data.split('\n').filter(line => line.trim() !== '');
                const jsonObjects = [];
                lines.forEach(line => {

                    const jsonString = line.replace(/^data: /, '');
                    try {
                        const jsonObject = JSON.parse(jsonString);
                        jsonObjects.push(jsonObject);
                    } catch (error) {
                        console.error('Error parsing JSON:', error);
                    }
                });
                const type = jsonObjects.find(data => data.type == "end");
                const dataOfJson = type.data.replace(/^ \ /g, '');
                const results = JSON.parse(dataOfJson, null, 2);
                return api.sendMessage(results.reply, event.threadID, event.messageID);
            })
            .catch(error => api.sendMessage('having some unexpected error', event.threadID, event.messageID));
    } catch (error) {
        return api.sendMessage('having some unexpected error', event.threadID, event.messageID)
    }
}
