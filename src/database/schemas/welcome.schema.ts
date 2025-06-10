import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class WelcomeConfig extends Document {
    @Prop({ required: true, index: true })
    guildId: string;

    @Prop({ required: true })
    channelId: string;

    @Prop({ default: true })
    enabled: boolean;

    @Prop({ default: '¡Bienvenido {user} a {server}!' })
    message: string;
}

export const WelcomeSchema = SchemaFactory.createForClass(WelcomeConfig);