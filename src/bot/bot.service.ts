import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Client, IntentsBitField, ActivityType, GuildMember } from 'discord.js';
import { ActivityService } from '../activity/activity.service';
import { RoleService } from 'src/role/role.service';

@Injectable()
export class BotService implements OnModuleInit {
    private client: Client;
    private readonly logger = new Logger(BotService.name);

    constructor(private readonly activityService: ActivityService, private readonly roleService: RoleService) {
        this.client = new Client({
            intents: [
                IntentsBitField.Flags.Guilds,
                IntentsBitField.Flags.GuildMessages,
                IntentsBitField.Flags.MessageContent,
            ],
        });
    }

    async onModuleInit() {
        this.setupListeners();
        await this.login();
        this.startActivityRotation();
    }

    private async login() {
        await this.client.login(process.env.DISCORD_TOKEN);
        this.logger.log('🤖 XMEN ENTRANDO EN ACCION!!');
    }

    private setupListeners() {
        this.client.on('ready', () => {
            this.logger.log(`✅ ${this.client.user?.tag} está OPERATIVO!!!, Cayendo con estilo...`);
        });


        this.client.on('messageCreate', async (message) => {

            if (message.content === '/list-activities') {
                const activities = await this.activityService.findAll();
                if (activities.length === 0) {
                    return message.reply('No hay actividades guardadas. Usa `/add-activity`.');
                }

                const activityList = activities.map(
                    (act) => `**${act.type}**: ${act.message}`
                ).join('\n');

                message.reply(`📋 **Actividades guardadas:**\n${activityList}`);
            }

            if (message.author.bot) return;

            // Comando para añadir actividades
            if (message.content.startsWith('/add-activity')) {
                const args = message.content.split(' ').slice(1); // Elimina "/add-activity"
                const input = args.join(' '); // Une el resto del mensaje
                const separatorIndex = input.indexOf('|'); // Busca el primer "|"

                if (separatorIndex === -1 || input.split('|').length !== 2) {
                    return message.reply('❌ **Formato incorrecto.** Usa: `/add-activity <TIPO> | <MENSAJE>`\nEjemplo: `/add-activity PLAYING | Helldivers 2`');
                }

                const type = input.split('|')[0].trim().toUpperCase();
                const activityMessage = input.split('|')[1].trim();

                // Validar tipos permitidos
                const allowedTypes = ['PLAYING', 'WATCHING', 'LISTENING', 'COMPETING'];
                if (!allowedTypes.includes(type)) {
                    return message.reply(`❌ **Tipo no válido.** Usa uno de estos: ${allowedTypes.join(', ')}`);
                }

                try {
                    await this.activityService.create({ type, message: activityMessage });
                    message.reply(`✅ **Actividad añadida:** \`${type} ${activityMessage}\``);
                } catch (error) {
                    message.reply('❌ Error al guardar en la base de datos.');
                }
            }
        });

        // Evento cuando un nuevo miembro se une
        this.client.on('guildMemberAdd', async (member: GuildMember) => {
            const defaultRole = await this.roleService.getDefaultRole(member.guild.id);
            if (!defaultRole) return;

            try {
                await member.roles.add(defaultRole.roleId);
                this.logger.log(`✅ Rol ${defaultRole.roleName} asignado a ${member.user.tag}`);
            } catch (error) {
                this.logger.error(`❌ Error asignando rol: ${error.message}`);
            }
        });

        // Comando para configurar el rol predeterminado
        this.client.on('messageCreate', async (message) => {
            if (!message.guild || message.author.bot) return;

            if (message.content.startsWith('/add-role')) {
                const roleName = message.content.split(' ').slice(1).join(' '); // Toma todo después del comando
                if (!roleName) {
                    return message.reply('❌ **Formato:** `/add-role <nombre-del-rol>`\nEjemplo: `/add-role Los Vengadores`');
                }

                // Busca el rol (ignorando mayúsculas/minúsculas)
                const role = message.guild.roles.cache.find(
                    (r) => r.name.toLowerCase() === roleName.toLowerCase(),
                );
                if (!role) {
                    return message.reply(`❌ El rol "${roleName}" no existe en este servidor.`);
                }

                try {
                    await this.roleService.setDefaultRole(
                        message.guild.id,
                        role.id,
                        role.name,
                    );
                    message.reply(`✅ **Rol predeterminado configurado:** "${role.name}"`);
                } catch (error) {
                    message.reply('❌ Error al guardar el rol en la base de datos.');
                }
            }
        });


    }

    private async startActivityRotation() {
        const ACTIVITY_CHANGE_INTERVAL = 15000; // 15 segundos

        while (true) {
            try {
                const activities = await this.activityService.findAll();
                if (activities.length > 0) {
                    const randomActivity = activities[Math.floor(Math.random() * activities.length)];

                    this.client.user?.setActivity({
                        name: randomActivity.message,
                        type: ActivityType[randomActivity.type],
                    });
                }
            } catch (error) {
                this.logger.error('Error al cargar actividades:', error);
            }

            await new Promise(resolve => setTimeout(resolve, ACTIVITY_CHANGE_INTERVAL));
        }
    }
}