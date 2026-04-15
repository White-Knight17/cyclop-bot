// database/database.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const dbConfig = configService.get('app.database');

        if (!dbConfig?.uri) {
          throw new Error(
            'MONGO_URI o MONGODB_URI no está configurada en las variables de entorno'
          );
        }

        return {
          uri: dbConfig.uri,
          ...dbConfig.options,
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
