import { Listener } from "discord-akairo";
import { MessageReaction } from "discord.js";
import { guildModel, IEmojiFrequency } from "../models/guildModel";

export default class ReactionAddListener extends Listener {
    constructor() {
        super("reactionAdd", {
            emitter: "client",
            event: "messageReactionAdd",
        });
    }

    public async exec(reaction: MessageReaction) {
        const msg = reaction.message;
        const result = reaction.emoji.identifier.match(/:\d+/g);
        const emojiId = result !== null ? result[0].slice(1) : "";

        if (msg.guild === null) return;
        const emojiManager = msg.guild.emojis;
        const emoji = emojiManager.resolve(emojiId);

        if (emoji === null) return;
        const guild = await guildModel.findOne({ id: msg.guild.id }).exec();

        if (guild === null) return;
        const index = guild.emojiFrequency.findIndex((e) => {
            if (emoji === null) return;
            return e.emojiId == emoji.id;
        });

        guild.emojiFrequency[index].frequency++;
        try {
            await guild.save();
        } catch (err) {
            console.log(err);
        }
    }
}
