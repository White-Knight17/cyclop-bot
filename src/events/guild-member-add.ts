import { Injectable } from '@nestjs/common';
import { Events, GuildMember } from 'discord.js';
import { BotService } from '../bot/bot.service';
import { CHANNEL_IDS, ROLE_IDS } from 'src/bot/constants';
import { WelcomeService } from 'src/welcome/welcome.service';
import { Context, On } from 'necord';


@Injectable()
export class GuildMemberAddEvent {
    constructor(
        private botService: BotService,
        private welcomeService: WelcomeService
    ) {
        this.botService.client.on(Events.GuildMemberAdd, this.handle.bind(this));
    }

    private async handle(member: GuildMember) {
        console.log(`🎉 Nuevo miembro: ${member.user.tag}`);

        try {
            const imageBuffer = await this.welcomeService.generateWelcomeImage(member);
            const channel = await member.guild.channels.fetch(CHANNEL_IDS.WELCOME);

            if (channel?.isTextBased()) {
                await channel.send({
                    content: `¡Bienvenid@ ${member.user}!`,
                    files: [{ attachment: imageBuffer, name: 'welcome.png' }]
                });
            }

            const role = await member.guild.roles.fetch(ROLE_IDS.TRABA_DEL_TABLON);
            if (role) {
                await member.roles.add(role).catch(console.error);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
}

// @Injectable()
// export class GuildMemberAddEvent {


//     constructor(private botService: BotService, private readonly welcomeService: WelcomeService) {
//         this.botService.client.on(Events.GuildMemberAdd, this.handle.bind(this));
//     }

//     @On(Events.GuildMemberAdd)
//     async handleNewMember(@Context() member: GuildMember) {
//         console.log('🎟️ Evento recibido para:', member.user.tag);

//         try {
//             // 1. Generar imagen
//             const imageBuffer = await this.welcomeService.generateWelcomeImage(member);

//             // 2. Obtener canal
//             const channel = member.guild.systemChannel ||
//                 await member.guild.channels.fetch('ID_CANAL').catch(console.error);

//             if (!channel?.isTextBased()) {
//                 return console.error('⚠️ Canal no válido');
//             }

//             // 3. Enviar mensaje
//             await channel.send({
//                 content: `¡${member.user} se unió al servidor!`,
//                 files: [{
//                     attachment: imageBuffer,
//                     name: 'welcome.png'
//                 }]
//             });
//             console.log('✅ Mensaje enviado');
//         } catch (error) {
//             console.error('💥 Error en bienvenida:', error);
//         }
//     }

//     private async handle(member: GuildMember) {
//         console.log(`🎉 Nuevo miembro: ${member.user.tag}`);

//         // 1. Enviar mensaje
//         const channel = await member.guild.channels.fetch(CHANNEL_IDS.WELCOME);
//         if (channel?.isTextBased()) {
//             await channel.send(`¡Bienvenid@ ${member.user}!`);
//         }



//         // 2. Asignar rol
//         const role = await member.guild.roles.fetch(ROLE_IDS.TRABA_DEL_TABLON);
//         if (role) {
//             await member.roles.add(role).catch(console.error);
//         }
//     }

// }