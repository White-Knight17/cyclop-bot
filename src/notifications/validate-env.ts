import { ConfigService } from '@nestjs/config';

export function validateEnvVariable(
    config: ConfigService,
    key: string
): string {
    const value = config.get<string>(key);
    if (!value) {
        throw new Error(`❌ Variable de entorno faltante: ${key}`);
    }
    return value;
}