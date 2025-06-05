import { Module } from '@nestjs/common';
import { WelcomeService } from './welcome.service';
import { MongooseModule } from '@nestjs/mongoose';
import { WelcomeRepository } from 'src/database/repositories/welcome.repository';
import { ImageBuilderUtil } from './image-builder.util';
import { WelcomeConfig, WelcomeSchema } from 'src/database/schemas/welcome.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: WelcomeConfig.name, schema: WelcomeSchema },
        ]),
    ],
    providers: [WelcomeService, WelcomeRepository, ImageBuilderUtil],
    exports: [WelcomeService, ImageBuilderUtil, WelcomeRepository],
})
export class WelcomeModule { }
