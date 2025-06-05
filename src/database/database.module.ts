// database/database.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => {
                const uri = configService.get<string>('MONGO_DB_URI'.trim());
                if (!uri) {
                    throw new Error('Database URI is not configured');
                }
                return {
                    uri: uri
                };
            },
            inject: [ConfigService],
        }),
    ],
})
export class DatabaseModule { }