// src/database/schemas/autorole.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class AutoRole extends Document {
    @Prop({ required: true })
    guildId: string;

    @Prop({ required: true })
    roleId: string;

    @Prop({ required: true, default: false })
    enabled: boolean;
}

export const AutoRoleSchema = SchemaFactory.createForClass(AutoRole);