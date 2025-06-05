// discord/discord.module.ts
import { Module } from '@nestjs/common';
import { NecordModule } from 'necord';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DiscordService } from './providers/discord.service';
import { CommandsModule } from './commands/commands.module';
import { EventsModule } from './events/events.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ErrorInterceptor } from 'src/common/interceptors/error.interceptor';

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
                        'GuildPresences',
                        'MessageContent',
                    ],
                    permissions: [
                        'ManageRoles',
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
    providers: [
        DiscordService,
        {
            provide: APP_INTERCEPTOR,
            useClass: ErrorInterceptor,
        }
    ],
})
export class DiscordModule { }