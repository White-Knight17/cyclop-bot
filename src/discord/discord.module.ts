// discord/discord.module.ts
import { Module } from '@nestjs/common';
import { NecordModule } from 'necord';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DiscordService } from './providers/discord.service';
import { CommandsModule } from './commands/commands.module';
import { EventsModule } from './events/events.module';

@Module({
    imports: [
        NecordModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => {
                const token = configService.get<string>('discord.token');
                if (!token) {
                    throw new Error('Discord token is not configured');
                }

                return {
                    token: token,
                    intents: [
                        'Guilds',
                        'GuildMessages',
                        'GuildMembers',
                        'MessageContent',
                    ],
                    permissions: [
                        'ManageRoles', // Para crear/asignar roles
                        'ViewChannel',
                        'SendMessages'
                    ],
                    development: false,
                };
            },
            inject: [ConfigService],
        }),
        CommandsModule,
        EventsModule,
    ],
    providers: [DiscordService],
})
export class DiscordModule { }