export const BOT_CONSTANTS = {
  // Colores para embeds
  COLORS: {
    SUCCESS: '#00ff00',
    ERROR: '#ff0000',
    WARNING: '#ffff00',
    INFO: '#0099ff',
    PRIMARY: '#7289da',
    SECONDARY: '#2f3136',
    DARK: '#1a1a1a',
    LIGHT: '#ffffff',
  },

  // Emojis
  EMOJIS: {
    SUCCESS: '✅',
    ERROR: '❌',
    WARNING: '⚠️',
    INFO: 'ℹ️',
    LOADING: '⏳',
    CHECK: '☑️',
    CROSS: '❌',
    STAR: '⭐',
    TROPHY: '🏆',
    FIRE: '🔥',
    ROCKET: '🚀',
    SPARKLES: '✨',
    HEART: '❤️',
    LEVEL_UP: '🎉',
    XP: '💎',
    RANK: '👑',
  },

  // Mensajes
  MESSAGES: {
    NO_PERMISSIONS: '❌ No tienes permisos para usar este comando.',
    BOT_NO_PERMISSIONS: '❌ No tengo permisos suficientes para ejecutar esta acción.',
    INVALID_ARGS: '❌ Argumentos inválidos proporcionados.',
    COMMAND_ERROR: '❌ Error al ejecutar el comando.',
    SUCCESS: '✅ Operación completada exitosamente.',
    LOADING: '⏳ Procesando...',
    NOT_FOUND: '❌ No se encontró lo que buscas.',
    RATE_LIMITED: '⏰ Has usado este comando demasiado rápido. Espera un momento.',
  },

  // Configuración de rate limiting
  RATE_LIMITS: {
    COMMAND_COOLDOWN: 3000, // 3 segundos
    MESSAGE_COOLDOWN: 60000, // 1 minuto
    API_CALL_COOLDOWN: 1000, // 1 segundo
  },

  // Configuración de paginación
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 25,
    DEFAULT_TIMEOUT: 300000, // 5 minutos
  },

  // Configuración de logs
  LOGGING: {
    MAX_LOG_ENTRIES: 1000,
    LOG_RETENTION_DAYS: 30,
    DEBUG_MODE: process.env.NODE_ENV === 'development',
  },

  // Configuración de cache
  CACHE: {
    USER_PROFILE_TTL: 5 * 60 * 1000, // 5 minutos
    GUILD_DATA_TTL: 10 * 60 * 1000, // 10 minutos
    COMMAND_RESULT_TTL: 60 * 1000, // 1 minuto
  },

  // Configuración de base de datos
  DATABASE: {
    MAX_CONNECTIONS: 10,
    CONNECTION_TIMEOUT: 5000,
    SOCKET_TIMEOUT: 45000,
    SERVER_SELECTION_TIMEOUT: 5000,
  },

  // Configuración de Discord
  DISCORD: {
    MAX_MESSAGE_LENGTH: 2000,
    MAX_EMBED_LENGTH: 6000,
    MAX_FIELD_LENGTH: 1024,
    MAX_FIELDS_PER_EMBED: 25,
    MAX_EMBEDS_PER_MESSAGE: 10,
  },

  // Configuración de XP y niveles
  LEVELING: {
    MIN_XP_PER_MESSAGE: 5,
    MAX_XP_PER_MESSAGE: 15,
    BASE_LEVEL_XP: 100,
    XP_MULTIPLIER: 1.5,
    MAX_LEVEL: 100,
  },

  // Configuración de roles
  ROLES: {
    ADMIN_ROLE_NAME: 'Admin',
    MODERATOR_ROLE_NAME: 'Moderador',
    MEMBER_ROLE_NAME: 'Miembro',
    VIP_ROLE_NAME: 'VIP',
  },

  // Configuración de canales
  CHANNELS: {
    WELCOME_CHANNEL_NAME: 'bienvenida',
    LOGS_CHANNEL_NAME: 'logs',
    ANNOUNCEMENTS_CHANNEL_NAME: 'anuncios',
    GENERAL_CHANNEL_NAME: 'general',
  },

  // Configuración de eventos
  EVENTS: {
    MESSAGE_CREATE: 'messageCreate',
    GUILD_MEMBER_ADD: 'guildMemberAdd',
    GUILD_MEMBER_REMOVE: 'guildMemberRemove',
    MESSAGE_DELETE: 'messageDelete',
    MESSAGE_UPDATE: 'messageUpdate',
    REACTION_ADD: 'messageReactionAdd',
    REACTION_REMOVE: 'messageReactionRemove',
  },

  // Configuración de comandos
  COMMANDS: {
    PREFIX: '!',
    SLASH_COMMAND_PREFIX: '/',
    MAX_ARGS: 10,
    MAX_OPTIONS: 25,
  },

  // Configuración de archivos
  FILES: {
    MAX_FILE_SIZE: 8 * 1024 * 1024, // 8MB
    ALLOWED_EXTENSIONS: ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    UPLOAD_PATH: './uploads',
  },

  // Configuración de seguridad
  SECURITY: {
    MAX_LOGIN_ATTEMPTS: 5,
    LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutos
    PASSWORD_MIN_LENGTH: 8,
    SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 horas
  },

  // Configuración de notificaciones
  NOTIFICATIONS: {
    ENABLE_EMAIL: false,
    ENABLE_DISCORD_DM: true,
    ENABLE_PUSH: false,
    DEFAULT_CHANNEL: 'general',
  },

  // Configuración de mantenimiento
  MAINTENANCE: {
    AUTO_BACKUP_INTERVAL: 24 * 60 * 60 * 1000, // 24 horas
    CLEANUP_INTERVAL: 60 * 60 * 1000, // 1 hora
    LOG_ROTATION_INTERVAL: 7 * 24 * 60 * 60 * 1000, // 7 días
  },
} as const;

// Tipos derivados de las constantes
export type BotColor = (typeof BOT_CONSTANTS.COLORS)[keyof typeof BOT_CONSTANTS.COLORS];
export type BotEmoji = (typeof BOT_CONSTANTS.EMOJIS)[keyof typeof BOT_CONSTANTS.EMOJIS];
export type BotMessage = (typeof BOT_CONSTANTS.MESSAGES)[keyof typeof BOT_CONSTANTS.MESSAGES];
export type BotEvent = (typeof BOT_CONSTANTS.EVENTS)[keyof typeof BOT_CONSTANTS.EVENTS];
