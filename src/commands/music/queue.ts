import { ApplicationCommandOptionType, Colors, EmbedBuilder, User } from 'discord.js';
import { Player } from 'vulkava';
import { Command } from '../../structures/Command';
import { Queue } from '../../structures/Queue';

export default new Command({
  name: 'queue',
  description: 'See the list of songs that are going to play',
  playerOnly: true,
  sameChannelOnly: false,
  options: [
    {
      name: 'page',
      description: 'The page you wanna see',
      type: ApplicationCommandOptionType.Number,
      required: false
    }
  ],
  exec({ interaction, client }) {
    const player = client.manager.players.get(interaction.guildId) as Player;
    const queue = player.queue as Queue;

    const multiple = 10;
    const page = interaction.options.getNumber('page') ?? 1;
    const end = page * multiple;
    const start = end - multiple;

    const { current } = player;
    const requester = current?.requester as User;

    if (queue.size === 0 && !current)
      return interaction.reply({
        content: '☝️ There is nothing playing and the queue is empty',
        ephemeral: true
      });

    const embed = new EmbedBuilder()
      .setColor(Colors.DarkGrey)
      .setDescription(queue.getTracksData(start, end).trim().length > 0 ? queue.getTracksData(start, end) : '**😔 There is no songs in this page**')
      .addFields(
        {
          name: '🛰️ Currently Playing',
          value: `**${current.title}**, resquested by \`${requester.tag}\``,
          inline: true
        },
        {
          name: '🕯️Queue size',
          value: `**${queue.size} songs**`,
          inline: true
        }
      );

    return interaction.reply({
      embeds: [embed]
    });
  }
});
