// src/shared-modules.module.ts
import { Module } from '@nestjs/common';
import { LevelingModule } from './features/complex/leveling/leveling.module';
import { DatabaseModule } from './database/database.module';

@Module({
    imports: [DatabaseModule, LevelingModule],
    exports: [DatabaseModule, LevelingModule],
})
export class SharedModulesModule { }