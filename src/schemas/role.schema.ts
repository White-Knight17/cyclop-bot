import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class DefaultRole extends Document {
    @Prop({ required: true, unique: true })
    guildId: string; // ID del servidor de Discord

    @Prop({ required: true })
    roleId: string; // ID del rol predeterminado

    @Prop({ required: true })
    roleName: string; // Nombre del rol (ej: "Xmen")
}

export const DefaultRoleSchema = SchemaFactory.createForClass(DefaultRole);