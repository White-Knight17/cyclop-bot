import { Role } from 'discord.js';
import { RoleOption, StringOption } from 'necord';

export class RoleOptionDto {
    @RoleOption({
        name: 'rol',
        description: 'Rol a asignar automáticamente',
        required: true
    })
    role: Role;
}

export class ResetLevelDto {
    @StringOption({
        name: 'usuario',
        description: 'Usuario a resetear (menciona o pega su ID)',
        required: true,
    })
    userId: string; // Recibirá el ID del usuario como string
}

