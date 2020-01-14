import { CommandoClient, Command, CommandoMessage } from 'discord.js-commando';
import { Message, GuildMember } from "discord.js";

const stripIndents = require('common-tags').stripIndents;

export default class UserInfoCommand extends Command {
	constructor(client: CommandoClient) {
		super(client, {
			name: 'user-info',
			aliases: ['user', ':notepad_spiral:'],
			group: 'util',
			memberName: 'user-info',
			description: 'Gets information about a user.',
			examples: ['user-info @Crawl#3208', 'user-info Crawl'],
			guildOnly: true,

			args: [
				{
					key: 'member',
					label: 'user',
					prompt: 'What user would you like to snoop on?',
					type: 'member',
					default: (msg: CommandoMessage): GuildMember => msg.member
				}
			]
		});
	}

	async run(msg: CommandoMessage, args: { member: GuildMember }): Promise<Message | Message[]> {
		const member = args.member;
		const user = member.user;
		return msg.reply(stripIndents`
			Info on **${user.username}#${user.discriminator}** (ID: ${user.id})

			**❯ Member Details**
			${member.nickname !== null ? ` • Nickname: ${member.nickname}` : ' • No nickname'}
			 • Roles: ${member.roles.map((roles) => `\`${roles.name}\``).join(', ')}
			 • Joined at: ${member.joinedAt}

			**❯ User Details**
			 • Created at: ${user.createdAt}${user.bot ? '\n • Is a bot account' : ''}
			 • Status: ${user.presence.status}
			 • Activity: ${user.presence.activity ? user.presence.activity.name : 'None'}
		`);
	}
}
