import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Activity } from 'src/database/schemas/activity.schema';
import { Client, ActivityType } from 'discord.js';


@Injectable()
export class ActivitiesService {
    private rotationInterval: NodeJS.Timeout;

    constructor(
        @InjectModel(Activity.name) private activityModel: Model<Activity>,
        private client: Client
    ) { }

    onModuleInit() {
        console.log('ActivitiesService inicializado'); // Verifica que el servicio se carga

        this.client.on('ready', () => {
            console.log('Evento ready disparado'); // Verifica que el bot se conecta
            this.startRotation(10);
        });

        this.client.on('error', (error) => {
            console.error('Error en el client:', error);
        });
    }

    async addActivity(content: string, type: string = 'PLAYING') {
        return this.activityModel.create({ content, type });
    }

    async listActivities() {
        return this.activityModel.find().sort({ createdAt: -1 });
    }

    private getActivityType(type: string): ActivityType {
        const typeMap: Record<string, ActivityType> = {
            'PLAYING': ActivityType.Playing,
            'WATCHING': ActivityType.Watching,
            'LISTENING': ActivityType.Listening,
            'STREAMING': ActivityType.Streaming
        };
        return typeMap[type] || ActivityType.Playing;
    }

    startRotation(intervalMinutes: number = 10) {
        console.log(`Configurando intervalo de ${intervalMinutes} minutos`);

        if (this.rotationInterval) {
            console.log('Limpiando intervalo previo');
            clearInterval(this.rotationInterval);
        }

        // Ejecuta inmediatamente la primera vez
        this.updateActivity();

        // Luego programa el intervalo
        this.rotationInterval = setInterval(() => {
            this.updateActivity();
        }, intervalMinutes * 60 * 1000);
    }

    private async updateActivity() {
        try {
            console.log('Actualizando actividad...');
            const activities = await this.listActivities();
            console.log(`Actividades disponibles: ${activities.length}`);

            if (activities.length > 0) {
                const randomActivity = activities[Math.floor(Math.random() * activities.length)];
                console.log(`Seleccionada actividad: ${randomActivity.type} ${randomActivity.content}`);

                if (!this.client.user) {
                    console.error('Client.user no está disponible!');
                    return;
                }

                await this.client.user.setActivity({
                    name: randomActivity.content,
                    type: this.getActivityType(randomActivity.type)
                });
                console.log('Actividad actualizada con éxito');
            } else {
                console.log('No hay actividades para mostrar');
            }
        } catch (error) {
            console.error('Error al actualizar actividad:', error);
        }
    }
}
