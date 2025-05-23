// src/discord/interceptors/error.interceptor.ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Context, NecordExecutionContext } from 'necord';
import { Observable, catchError, from, of } from 'rxjs';
import { ChatInputCommandInteraction } from 'discord.js';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const ctx = NecordExecutionContext.create(context);
        const [interaction] = ctx.getContext<'interactionCreate'>();

        return from(next.handle()).pipe(
            catchError((error) => {
                if (this.isChatInputCommand(interaction)) {
                    interaction.reply({
                        content: '❌ Error: ' + error.message,
                        ephemeral: true,
                    }).catch(console.error);
                }
                return of(null);
            }),
        );
    }

    private isChatInputCommand(interaction: unknown): interaction is ChatInputCommandInteraction {
        return typeof interaction === 'object' &&
            interaction !== null &&
            'isChatInputCommand' in interaction;
    }
}