import { Injectable, Logger } from '@nestjs/common';
import { EmbedBuilder, ColorResolvable } from 'discord.js';

@Injectable()
export class DiscordService {
  private readonly logger = new Logger(DiscordService.name);

  constructor() {}

  /**
   * Crea un embed personalizado
   */
  createEmbed(options: {
    title?: string;
    description?: string;
    color?: ColorResolvable;
    fields?: Array<{ name: string; value: string; inline?: boolean }>;
    thumbnail?: string;
    image?: string;
    footer?: { text: string; iconURL?: string };
    timestamp?: boolean;
  }): EmbedBuilder {
    const embed = new EmbedBuilder();

    if (options.title) embed.setTitle(options.title);
    if (options.description) embed.setDescription(options.description);
    if (options.color) embed.setColor(options.color);
    if (options.thumbnail) embed.setThumbnail(options.thumbnail);
    if (options.image) embed.setImage(options.image);
    if (options.footer) embed.setFooter(options.footer);
    if (options.timestamp) embed.setTimestamp();

    if (options.fields?.length) {
      embed.addFields(options.fields);
    }

    return embed;
  }

  /**
   * Crea un embed de éxito
   */
  createSuccessEmbed(title: string, description: string): EmbedBuilder {
    return this.createEmbed({
      title: `✅ ${title}`,
      description,
      color: '#00ff00',
    });
  }

  /**
   * Crea un embed de error
   */
  createErrorEmbed(title: string, description: string): EmbedBuilder {
    return this.createEmbed({
      title: `❌ ${title}`,
      description,
      color: '#ff0000',
    });
  }

  /**
   * Crea un embed de advertencia
   */
  createWarningEmbed(title: string, description: string): EmbedBuilder {
    return this.createEmbed({
      title: `⚠️ ${title}`,
      description,
      color: '#ffff00',
    });
  }

  /**
   * Crea un embed de información
   */
  createInfoEmbed(title: string, description: string): EmbedBuilder {
    return this.createEmbed({
      title: `ℹ️ ${title}`,
      description,
      color: '#0099ff',
    });
  }

  /**
   * Formatea un número con separadores de miles
   */
  formatNumber(num: number): string {
    return num.toLocaleString('es-ES');
  }

  /**
   * Formatea una fecha en formato legible
   */
  formatDate(date: Date): string {
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  /**
   * Formatea una duración en formato legible
   */
  formatDuration(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    const parts: string[] = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    parts.push(`${seconds}s`);

    return parts.join(' ');
  }

  /**
   * Genera un ID único
   */
  generateId(): string {
    return (
      Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    );
  }

  /**
   * Verifica si un string es un ID válido de Discord
   */
  isValidDiscordId(id: string): boolean {
    return /^\d{17,19}$/.test(id);
  }

  /**
   * Limpia un string de caracteres especiales
   */
  sanitizeString(str: string): string {
    return str.replace(/[^\w\s-]/g, '').trim();
  }

  /**
   * Trunca un string a una longitud máxima
   */
  truncateString(str: string, maxLength: number): string {
    if (str.length <= maxLength) return str;
    return str.substring(0, maxLength - 3) + '...';
  }

  /**
   * Convierte un string a título
   */
  toTitleCase(str: string): string {
    return str.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  }

  /**
   * Genera una barra de progreso
   */
  createProgressBar(current: number, max: number, length: number = 10): string {
    const progress = Math.round((current / max) * length);
    const filled = '█'.repeat(progress);
    const empty = '░'.repeat(length - progress);
    return `${filled}${empty}`;
  }

  /**
   * Calcula el porcentaje de progreso
   */
  calculateProgress(current: number, max: number): number {
    return Math.round((current / max) * 100);
  }

  /**
   * Verifica si un string es una URL válida
   */
  isValidUrl(string: string): boolean {
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
  extractDomain(url: string): string {
    try {
      return new URL(url).hostname;
    } catch {
      return '';
    }
  }

  /**
   * Genera un hash simple
   */
  simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString(36);
  }

  /**
   * Verifica si un objeto está vacío
   */
  isEmpty(obj: any): boolean {
    if (obj == null) return true;
    if (Array.isArray(obj) || typeof obj === 'string') return obj.length === 0;
    return Object.keys(obj).length === 0;
  }

  /**
   * Retrasa la ejecución por un tiempo específico
   */
  delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Ejecuta una función con retry
   */
  async retry<T>(fn: () => Promise<T>, maxRetries: number = 3, delayMs: number = 1000): Promise<T> {
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
  isInRange(value: number, min: number, max: number): boolean {
    return value >= min && value <= max;
  }

  /**
   * Limita un valor a un rango específico
   */
  clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  /**
   * Genera un número aleatorio dentro de un rango
   */
  randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Selecciona un elemento aleatorio de un array
   */
  randomChoice<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  /**
   * Mezcla un array
   */
  shuffle<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}
