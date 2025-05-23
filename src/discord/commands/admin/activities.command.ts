// src/activities/activities.command.ts
import { SlashCommand, Context, SlashCommandContext, Options, StringOption, Subcommand } from 'necord';
import { ActivitiesService } from 'src/features/activities/activities.service';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { UseGuards } from '@nestjs/common';

class ActivityOptions {
    @StringOption({
        name: 'actividad',
        description: 'Texto de la actividad',
        required: true
    })
    content: string;

    @StringOption({
        name: 'tipo',
        description: 'Tipo de actividad',
        required: false,
        choices: [
            { name: 'Jugando', value: 'PLAYING' },
            { name: 'Viendo', value: 'WATCHING' },
            { name: 'Escuchando', value: 'LISTENING' },
            { name: 'Transmitiendo', value: 'STREAMING' }
        ]
    })
    type?: string;
}

@UseGuards(AdminGuard)
@SlashCommand({
    name: 'actividad',
    description: 'Gestiona las actividades del bot',
    defaultMemberPermissions: 'Administrator'
})
export class ActivitiesCommand {
    constructor(private readonly activitiesService: ActivitiesService) { }

    @Subcommand({
        name: 'agregar',
        description: 'Agrega una nueva actividad'
    })
    async add(
        @Context() [interaction]: SlashCommandContext,
        @Options() { content, type = 'PLAYING' }: ActivityOptions
    ) {
        await this.activitiesService.addActivity(content, type);
        await interaction.reply({
            content: `✅ Actividad agregada: \`${type} ${content}\``,
            ephemeral: true
        });
    }

    @Subcommand({
        name: 'ayuda',
        description: 'Muestra cómo usar el comando'
    })
    async help(@Context() [interaction]: SlashCommandContext) {
        await interaction.reply({
            content: `**Cómo usar:**\n`
                + `/actividad agregar actividad: [texto] tipo: [PLAYING/WATCHING/LISTENING]\n`
                + `Ejemplo: \`/actividad agregar actividad: "tu servidor" tipo: WATCHING\``,
            ephemeral: true
        });
    }

}