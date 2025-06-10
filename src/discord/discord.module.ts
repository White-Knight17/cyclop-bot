// discord/discord.module.ts
import { Module } from '@nestjs/common';
import { NecordModule } from 'necord';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DiscordService } from './providers/discord.service';
import { CommandsModule } from './commands/commands.module';
import { EventsModule } from './events/events.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ErrorInterceptor } from '../common/interceptors/error.interceptor';
import { GuardsModule } from '../common/guards/guards.module';
import { PermissionsModule } from '../features/permissions/permissions.module';
import { Partials } from 'discord.js';
import { On } from 'necord';
import { Events } from 'discord.js';
import { GuildMember } from 'discord.js';

@Module({
    imports: [
        NecordModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => {
                const token = configService.get<string>('DISCORD_TOKEN');
                if (!token) {
                    throw new Error('Discord token is not configured');
                }

                return {
                    token,
                    intents: [
                        'Guilds',
                        'GuildMessages',
                        'GuildMembers',
                        'MessageContent',
                        'GuildPresences',
                        'GuildVoiceStates'
                    ],
                    partials: [
                        Partials.Channel,
                        Partials.GuildMember,
                        Partials.Message,
                        Partials.User
                    ]
                };
            },
            inject: [ConfigService]
        }),
        CommandsModule,
        EventsModule,
        GuardsModule,
        PermissionsModule
    ],
    providers: [
        DiscordService,
        {
            provide: APP_INTERCEPTOR,
            useClass: ErrorInterceptor
        }
    ],
    exports: [DiscordService]
})
export class DiscordModule {
    @On(Events.GuildMemberAdd)
    async handle(member: GuildMember) {
        // Implementation of the event handler
    }
}