import { Role, TextChannel } from 'discord.js';
import { RoleOption, StringOption, ChannelOption } from 'necord';

export class RoleOptionDto {
  @RoleOption({
    name: 'rol',
    description: 'Rol a asignar automáticamente',
    required: true,
  })
  role: Role;
}

export class AdminRoleOptionDto {
  @RoleOption({
    name: 'rol',
    description: 'El rol que será establecido como rol de administrador',
    required: true,
  })
  role: Role;
}

export class ResetLevelDto {
  @StringOption({
    name: 'usuario',
    description: 'ID del usuario a resetear',
    required: true,
  })
  userId: string;
}

export class WelcomeChannelDto {
  @ChannelOption({
    name: 'channel',
    description: 'Canal para mensajes de bienvenida',
    required: true,
  })
  channel: TextChannel;
}
