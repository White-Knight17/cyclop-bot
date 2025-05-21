// src/database/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
    @Prop({ required: true, unique: true })
    discordId: string;

    @Prop({ required: true })
    username: string;

    @Prop({ default: 0 })
    xp: number;

    @Prop({ default: 1 })
    level: number;

    @Prop({ default: 0 })
    totalXp: number; // XP acumulada total

    @Prop({ default: 0 })
    totalMessages: number;

    @Prop({ type: [String], default: [] })
    achievements: string[];

    @Prop({ type: [String], default: [] })
    unlockedAchievements: string[];

    @Prop()
    lastMessageTimestamp?: Date; // Para controlar ganancia de XP
}

export const UserSchema = SchemaFactory.createForClass(User);