import { EmbedBuilder, ColorResolvable, User, GuildMember, Guild } from 'discord.js';
import { BOT_CONSTANTS } from '../constants';

/**
 * Utilidades para el bot de Discord
 */
export class BotUtils {
    /**
     * Crea un embed con configuración estándar
     */
    static createEmbed(options: {
        title?: string;
        description?: string;
        color?: ColorResolvable;
        fields?: Array<{ name: string; value: string; inline?: boolean }>;
        thumbnail?: string;
        image?: string;
        footer?: { text: string; iconURL?: string };
        timestamp?: boolean;
        author?: { name: string; iconURL?: string };
    }): EmbedBuilder {
        const embed = new EmbedBuilder()
            .setColor(options.color || BOT_CONSTANTS.COLORS.PRIMARY);

        if (options.title) embed.setTitle(options.title);
        if (options.description) embed.setDescription(options.description);
        if (options.thumbnail) embed.setThumbnail(options.thumbnail);
        if (options.image) embed.setImage(options.image);
        if (options.footer) embed.setFooter(options.footer);
        if (options.author) embed.setAuthor(options.author);
        if (options.timestamp) embed.setTimestamp();

        if (options.fields?.length) {
            embed.addFields(options.fields);
        }

        return embed;
    }

    /**
     * Crea un embed de éxito
     */
    static createSuccessEmbed(title: string, description: string): EmbedBuilder {
        return this.createEmbed({
            title: `${BOT_CONSTANTS.EMOJIS.SUCCESS} ${title}`,
            description,
            color: BOT_CONSTANTS.COLORS.SUCCESS
        });
    }

    /**
     * Crea un embed de error
     */
    static createErrorEmbed(title: string, description: string): EmbedBuilder {
        return this.createEmbed({
            title: `${BOT_CONSTANTS.EMOJIS.ERROR} ${title}`,
            description,
            color: BOT_CONSTANTS.COLORS.ERROR
        });
    }

    /**
     * Crea un embed de advertencia
     */
    static createWarningEmbed(title: string, description: string): EmbedBuilder {
        return this.createEmbed({
            title: `${BOT_CONSTANTS.EMOJIS.WARNING} ${title}`,
            description,
            color: BOT_CONSTANTS.COLORS.WARNING
        });
    }

    /**
     * Crea un embed de información
     */
    static createInfoEmbed(title: string, description: string): EmbedBuilder {
        return this.createEmbed({
            title: `${BOT_CONSTANTS.EMOJIS.INFO} ${title}`,
            description,
            color: BOT_CONSTANTS.COLORS.INFO
        });
    }

    /**
     * Formatea un número con separadores de miles
     */
    static formatNumber(num: number): string {
        return num.toLocaleString('es-ES');
    }

    /**
     * Formatea una fecha en formato legible
     */
    static formatDate(date: Date): string {
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    /**
     * Formatea una duración en formato legible
     */
    static formatDuration(ms: number): string {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days}d ${hours % 24}h ${minutes % 60}m`;
        if (hours > 0) return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
        if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
        return `${seconds}s`;
    }

    /**
     * Genera un ID único
     */
    static generateId(): string {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    /**
     * Verifica si un string es un ID válido de Discord
     */
    static isValidDiscordId(id: string): boolean {
        return /^\d{17,19}$/.test(id);
    }

    /**
     * Obtiene el nombre de usuario completo
     */
    static getFullUsername(user: User): string {
        return `${user.username}#${user.discriminator}`;
    }

    /**
     * Obtiene el nombre de usuario con tag
     */
    static getDisplayName(member: GuildMember): string {
        return member.displayName || member.user.username;
    }

    /**
     * Verifica si un usuario tiene un rol específico
     */
    static hasRole(member: GuildMember, roleName: string): boolean {
        return member.roles.cache.some(role => role.name === roleName);
    }

    /**
     * Verifica si un usuario tiene permisos específicos
     */
    static hasPermission(member: GuildMember, permission: string): boolean {
        return member.permissions.has(permission as any);
    }

    /**
     * Obtiene el rol más alto de un usuario
     */
    static getHighestRole(member: GuildMember) {
        return member.roles.highest;
    }

    /**
     * Verifica si un canal es de texto
     */
    static isTextChannel(channel: any): boolean {
        return channel?.isTextBased?.() || false;
    }

    /**
     * Verifica si un canal es de voz
     */
    static isVoiceChannel(channel: any): boolean {
        return channel?.isVoiceBased?.() || false;
    }

    /**
     * Limpia un string de caracteres especiales
     */
    static sanitizeString(str: string): string {
        return str.replace(/[^\w\s-]/g, '').trim();
    }

    /**
     * Trunca un string a una longitud máxima
     */
    static truncateString(str: string, maxLength: number): string {
        if (str.length <= maxLength) return str;
        return str.substring(0, maxLength - 3) + '...';
    }

    /**
     * Convierte un string a título
     */
    static toTitleCase(str: string): string {
        return str.replace(/\w\S*/g, (txt) =>
            txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
    }

    /**
     * Genera una barra de progreso
     */
    static createProgressBar(current: number, max: number, length: number = 10): string {
        const progress = Math.round((current / max) * length);
        const filled = '█'.repeat(progress);
        const empty = '░'.repeat(length - progress);
        return `${filled}${empty}`;
    }

    /**
     * Calcula el porcentaje de progreso
     */
    static calculateProgress(current: number, max: number): number {
        return Math.round((current / max) * 100);
    }

    /**
     * Genera un color aleatorio
     */
    static getRandomColor(): ColorResolvable {
        const colors = Object.values(BOT_CONSTANTS.COLORS);
        return colors[Math.floor(Math.random() * colors.length)];
    }

    /**
     * Verifica si un string es una URL válida
     */
    static isValidUrl(string: string): boolean {
        try {
            new URL(string);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Extrae el dominio de una URL
     */
    static extractDomain(url: string): string {
        try {
            return new URL(url).hostname;
        } catch {
            return '';
        }
    }

    /**
     * Genera un hash simple
     */
    static simpleHash(str: string): string {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash.toString(36);
    }

    /**
     * Verifica si un objeto está vacío
     */
    static isEmpty(obj: any): boolean {
        if (obj == null) return true;
        if (Array.isArray(obj) || typeof obj === 'string') return obj.length === 0;
        return Object.keys(obj).length === 0;
    }

    /**
     * Clona un objeto de forma profunda
     */
    static deepClone<T>(obj: T): T {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj.getTime()) as any;
        if (Array.isArray(obj)) return obj.map(item => this.deepClone(item)) as any;

        const cloned = {} as T;
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                cloned[key] = this.deepClone(obj[key]);
            }
        }
        return cloned;
    }

    /**
     * Retrasa la ejecución por un tiempo específico
     */
    static delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Ejecuta una función con retry
     */
    static async retry<T>(
        fn: () => Promise<T>,
        maxRetries: number = 3,
        delayMs: number = 1000
    ): Promise<T> {
        let lastError: Error;

        for (let i = 0; i < maxRetries; i++) {
            try {
                return await fn();
            } catch (error) {
                lastError = error as Error;
                if (i < maxRetries - 1) {
                    await this.delay(delayMs * Math.pow(2, i)); // Exponential backoff
                }
            }
        }

        throw lastError!;
    }

    /**
     * Verifica si un valor está dentro de un rango
     */
    static isInRange(value: number, min: number, max: number): boolean {
        return value >= min && value <= max;
    }

    /**
     * Limita un valor a un rango específico
     */
    static clamp(value: number, min: number, max: number): number {
        return Math.min(Math.max(value, min), max);
    }

    /**
     * Genera un número aleatorio dentro de un rango
     */
    static randomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * Selecciona un elemento aleatorio de un array
     */
    static randomChoice<T>(array: T[]): T {
        return array[Math.floor(Math.random() * array.length)];
    }

    /**
     * Mezcla un array
     */
    static shuffle<T>(array: T[]): T[] {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
} 