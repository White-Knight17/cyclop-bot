// src/features/complex/leveling/leveling.module.ts
import { Module } from '@nestjs/common';
import { LevelingService } from './leveling.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../../database/schemas/user.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ],
    providers: [LevelingService],
    exports: [LevelingService],
})
export class LevelingModule { }