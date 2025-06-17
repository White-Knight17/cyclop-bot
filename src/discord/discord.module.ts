// discord/discord.module.ts
import { Partials, GuildMember, Events } from 'discord.js';
import { NecordModule, On } from 'necord';
import { Module, Logger } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DiscordService } from './providers/discord.service';
import { CommandsModule } from './commands/commands.module';
import { EventsModule } from './events/events.module';
import { ErrorInterceptor } from '../common/interceptors/error.interceptor';
import { GuardsModule } from '../common/guards/guards.module';
import { PermissionsModule } from '../features/permissions/permissions.module';

@Module({
    imports: [
        NecordModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => {
                const discordConfig = configService.get('app.discord');
                const appConfig = configService.get('app.app');

                if (!discordConfig?.token) {
                    throw new Error('Discord token no está configurado');
                }

                return {
                    token: discordConfig.token,
                    intents: discordConfig.intents,
                    partials: [
                        Partials.Channel,
                        Partials.GuildMember,
                        Partials.Message,
                        Partials.User,
                        Partials.Reaction,
                        Partials.GuildScheduledEvent,
                    ],
                    failOnLogin: true,
                    logger: {
                        level: appConfig?.nodeEnv === 'production' ? 'warn' : 'debug',
                    },
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
    private readonly logger = new Logger(DiscordModule.name);

    @On(Events.GuildMemberAdd)
    async handle(member: GuildMember) {
        try {
            this.logger.log(`Nuevo miembro unido: ${member.user.tag} (${member.guild.name})`);
            // La implementación específica se maneja en el evento correspondiente
        } catch (error) {
            this.logger.error(`Error al manejar nuevo miembro: ${error.message}`, error.stack);
        }
    }
}