import { Injectable } from '@nestjs/common';
import { SlashCommand, Context, SlashCommandContext } from 'necord';
import { UseGuards } from '@nestjs/common';
import { AdminGuard } from '../../../common/guards/admin.guard';

@Injectable()
@UseGuards(AdminGuard)
@SlashCommand({
  name: 'test-admin',
  description: 'Comando de prueba para administradores',
  defaultMemberPermissions: 'Administrator',
  dmPermission: false,
})
export class TestAdminCommand {
  async execute(@Context() [interaction]: SlashCommandContext) {
    await interaction.reply({
      content: '✅ ¡Tienes permisos de administrador!',
      ephemeral: true,
    });
  }
}
