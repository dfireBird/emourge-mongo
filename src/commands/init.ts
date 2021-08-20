import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { IEmojiFrequency, guildModel } from "../models/guildModel";

class InitCommand extends Command {
    constructor() {
        super("init", {
            aliases: ["init", "start"],
        });
    }

    public async exec(msg: Message) {
        if (!msg.guild) {
            return;
        }
        const emojis = msg.guild.emojis.cache;
        let guildEmojis: IEmojiFrequency[] = [];
        for (const [_key, emoji] of emojis) {
            guildEmojis.push({
                emojiId: emoji.id,
                emojiName: emoji.name ?? "",
                animated: emoji.animated ?? false,
                frequency: 0,
            });
        }
        if ((await guildModel.findOne({ id: msg.guild.id }).exec()) !== null) {
            msg.channel.send("**Already Initialized**");
            return;
        }
        const guild = new guildModel({
            id: msg.guild.id,
            emojiFrequency: guildEmojis,
        });

        guild.save().then(() => {
            msg.channel.send("Successfully Initialized");
        });
    }
}

export default InitCommand;
