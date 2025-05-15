import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Activity extends Document {
    @Prop({ required: true, enum: ['PLAYING', 'WATCHING', 'LISTENING', 'COMPETING'] })
    type: string;

    @Prop({ required: true })
    message: string;
}

export const ActivitySchema = SchemaFactory.createForClass(Activity);