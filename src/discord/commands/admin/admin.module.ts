import { Module } from '@nestjs/common';
import { SetupRanksCommand } from './setup-ranks.command';

@Module({
    imports: [],
    providers: [SetupRanksCommand],
    exports: [],
    controllers: [],

})
export class AdminCommandsModule { }
