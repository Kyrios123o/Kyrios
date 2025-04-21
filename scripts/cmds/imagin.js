module.exports = {
  config: {
    name: "imagin",
    version: "1.2",
    author: "♡︎ 𝐻𝑎𝑠𝑎𝑛 ♡︎",
    countDown: 3,
    role: 0,
    longDescription: {
      vi: "",
      en: "Get images from text.",
    },
    category: "image",
    guide: {
      vi: "",
      en:
        "Type {pn} with your prompts\nExample: {pn} cute dog\nYou can also specify a model and ratio (optional).\n{pn} [model] prompt | [ratio]\nOr: {pn} prompt | [model] | [ratio]\nExample: {pn} anime dog | 1:1 OR {pn} cute dog | anime | 16:9",
    },
  },

  onStart: async function ({ api, args, message, event }) {
    try {
      if (!args.length) {
        return message.reply("Please provide a prompt.");
      }
      const modelMap = {
        anime: "anime",
        art: "artistic",
        realistic: "realistic"
      };
      let model = "realistic";
      let ratio = "1:1";
      let prompt = args.join(" ");
      const parts = prompt.split("|").map(p => p.trim());
      parts.forEach(part => {
        const lower = part.toLowerCase();
        if (modelMap[lower]) {
          model = modelMap[lower];
        } else if (["1:1", "3:2", "4:3", "3:4", "16:9", "9:16"].includes(lower)) {
          ratio = lower;
        } else {
          prompt = part;
        }
      });

      const waitingMessage = await message.reply("✨ | Creating your imagine Photo...");
      api.setMessageReaction("✨", event.messageID, () => {}, true);

      const API = `https://www.noobz-api.rf.gd/api/imagine?prompt=${encodeURIComponent(prompt)}&style=${model}&aspect_ratio=${ratio}`;

     message.reply({
        body: `🎊 Her's your imagine photo.`,
        attachment: await global.utils.getStreamFromURL(API),
      });

      setTimeout(() => {
        api.setMessageReaction("💗", event.messageID, () => {}, true);
      }, 2000);
      api.unsendMessage(waitingMessage.messageID);
    } catch (error) {
      message.reply("Failed to generate the image. Please try again later.");
    }
  },
};
