import { Module } from '@nestjs/common';
import { LevelingModule } from './leveling/leveling.module';
import { DatabaseModule } from 'src/database/database.module';

@Module({
    imports: [DatabaseModule, LevelingModule],
    exports: [DatabaseModule, LevelingModule],
})
export class SharedModulesModule { }