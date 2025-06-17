// src/discord/interceptors/error.interceptor.ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Context, NecordExecutionContext } from 'necord';
import { Observable, catchError, from, of } from 'rxjs';
import { ChatInputCommandInteraction, MessageComponentInteraction, ModalSubmitInteraction } from 'discord.js';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
    private readonly logger = new Logger(ErrorInterceptor.name);

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const ctx = NecordExecutionContext.create(context);
        const [interaction] = ctx.getContext<'interactionCreate'>();

        return from(next.handle()).pipe(
            catchError((error) => {
                this.logger.error(`Error en interacción: ${error.message}`, error.stack);

                if (this.isReplyableInteraction(interaction)) {
                    const errorMessage = this.formatErrorMessage(error);

                    interaction.reply({
                        content: errorMessage,
                        ephemeral: true,
                    }).catch(replyError => {
                        this.logger.error(`Error al enviar respuesta de error: ${replyError.message}`);
                    });
                }

                return of(null);
            }),
        );
    }

    private isReplyableInteraction(interaction: unknown): interaction is ChatInputCommandInteraction | MessageComponentInteraction | ModalSubmitInteraction {
        if (!interaction || typeof interaction !== 'object') return false;

        const typedInteraction = interaction as any;

        // Verificar si es una interacción que puede responder
        return (
            typedInteraction.isChatInputCommand?.() ||
            typedInteraction.isMessageComponent?.() ||
            typedInteraction.isModalSubmit?.()
        ) && !typedInteraction.replied && !typedInteraction.deferred;
    }

    private formatErrorMessage(error: any): string {
        // Errores conocidos con mensajes personalizados
        if (error.message?.includes('Missing Permissions')) {
            return '❌ No tengo permisos suficientes para ejecutar esta acción.';
        }

        if (error.message?.includes('Unknown Message')) {
            return '❌ El mensaje ya no está disponible.';
        }

        if (error.message?.includes('Unknown Channel')) {
            return '❌ El canal ya no existe.';
        }

        if (error.message?.includes('Unknown User')) {
            return '❌ El usuario ya no está disponible.';
        }

        if (error.message?.includes('Unknown Guild')) {
            return '❌ El servidor ya no está disponible.';
        }

        // Errores de validación
        if (error.message?.includes('validation')) {
            return '❌ Datos inválidos proporcionados.';
        }

        // Errores de base de datos
        if (error.message?.includes('database') || error.message?.includes('mongoose')) {
            return '❌ Error de base de datos. Inténtalo de nuevo más tarde.';
        }

        // Errores de red
        if (error.message?.includes('network') || error.message?.includes('timeout')) {
            return '❌ Error de conexión. Inténtalo de nuevo.';
        }

        // Error genérico
        return `❌ Error: ${error.message || 'Error desconocido'}`;
    }
}