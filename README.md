# 🤖 CYCLOP-BOT

*Bot de Discord modular y escalable construido con NestJS y Necord*

## 📋 Índice
- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Requisitos](#-requisitos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Módulos y Funcionalidades](#-módulos-y-funcionalidades)
- [Comandos](#-comandos)
- [Eventos](#-eventos)
- [Contribución](#-contribución)
- [Licencia](#-licencia)

## ✨ Características

### 🎮 Sistema de Bienvenida
- Imágenes personalizadas de bienvenida
- Mensajes configurables por servidor
- Soporte para múltiples canales
- Sistema de fallback para imágenes

### 👥 Gestión de Roles
- Asignación automática de roles
- Sistema de niveles con roles progresivos
- Roles temporales
- Protección contra escalada de roles

### 📊 Sistema de Niveles
- Experiencia por mensajes
- Multiplicadores de XP (boosters, roles premium)
- Rangos automáticos
- Tabla de clasificación

### 🛠️ Herramientas de Administración
- Comandos de moderación
- Configuración de bienvenidas
- Gestión de roles
- Estadísticas del servidor

## 🚀 Tecnologías

### Backend
- **Framework**: NestJS
- **Lenguaje**: TypeScript
- **API**: Discord.js v14 + Necord
- **Base de Datos**: MongoDB con Mongoose
- **Logging**: Winston + Logger de NestJS

### Características Técnicas
- Arquitectura modular
- Inyección de dependencias
- Patrón repositorio
- Manejo de errores centralizado
- Sistema de logging estructurado

## 📋 Requisitos

### Sistema
- Node.js v16.x o superior
- MongoDB v4.x o superior
- Git

### Permisos del Bot
- `Guilds`
- `GuildMessages`
- `GuildMembers`
- `GuildPresences`
- `MessageContent`

## 📦 Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/***/cyclop-bot.git
cd cyclop-bot
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
```bash
cp .env.example .env
```

4. Edita el archivo `.env` con tus credenciales:
```env
DISCORD_TOKEN=tu_token_aquí
MONGODB_URI=tu_uri_de_mongodb
```

5. Inicia el bot:
```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod
```

## ⚙️ Configuración

### Variables de Entorno
| Variable | Descripción | Requerido |
|----------|-------------|-----------|
| `DISCORD_TOKEN` | Token del bot de Discord | Sí |
| `MONGODB_URI` | URI de conexión a MongoDB | Sí |
| `NODE_ENV` | Entorno (development/production) | No |

### Permisos del Bot
El bot requiere los siguientes permisos en el servidor:
- Administrar Roles
- Enviar Mensajes
- Gestionar Canales
- Ver Canales
- Adjuntar Archivos
- Insertar Enlaces

## 📂 Estructura del Proyecto

```plaintext
└── src/
    ├── common/                    # Utilidades globales
    │   ├── filters/              # Filtros de excepciones
    │   │   └── http-exception.filter.ts
    │   ├── guards/               # Guards de autenticación
    │   │   └── admin.guard.ts
    │   ├── interceptors/         # Interceptores
    │   │   └── error.interceptor.ts
    │   └── interfaces/           # Tipos/DTOS compartidos
    │       └── leveling.interface.ts
    │
    ├── config/                   # Configuraciones
    │   ├── app.config.ts        # Configuración general
    │   └── database.config.ts   # Configuración de DB
    │
    ├── database/                 # Capa de datos
    │   ├── repositories/        # Repositorios
    │   │   ├── welcome.repository.ts
    │   │   └── leveling.repository.ts
    │   ├── schemas/            # Esquemas de MongoDB
    │   │   ├── welcome.schema.ts
    │   │   └── leveling.schema.ts
    │   └── database.module.ts
    │
    ├── discord/                  # Módulo principal de Discord
    │   ├── commands/            # Comandos Slash
    │   │   ├── admin/          # Comandos administrativos
    │   │   │   ├── welcome.command.ts
    │   │   │   └── autorole.command.ts
    │   │   ├── fun/           # Comandos de entretenimiento
    │   │   └── utility/       # Comandos de utilidad
    │   │
    │   ├── events/             # Eventos de Discord
    │   │   ├── guild/         # Eventos de servidor
    │   │   │   └── guild-create.event.ts
    │   │   ├── member/        # Eventos de usuarios
    │   │   │   └── guild-member-add.event.ts
    │   │   └── message/       # Eventos de mensajes
    │   │       └── message-create.event.ts
    │   │
    │   ├── providers/          # Servicios de Discord
    │   │   └── discord.service.ts
    │   └── discord.module.ts
    │
    ├── features/                # Funcionalidades principales
    │   ├── welcome/            # Sistema de bienvenida
    │   │   ├── welcome.service.ts
    │   │   ├── welcome.module.ts
    │   │   └── image-builder.util.ts
    │   │
    │   ├── leveling/          # Sistema de niveles
    │   │   ├── leveling.service.ts
    │   │   ├── leveling.module.ts
    │   │   └── xp-multipliers.service.ts
    │   │
    │   └── autorole/          # Sistema de roles automáticos
    │       ├── autorole.service.ts
    │       └── autorole.module.ts
    │
    ├── app.module.ts           # Módulo raíz
    ├── main.ts                # Punto de entrada
    └── discord-config.service.ts
```

## 🎯 Módulos y Funcionalidades

### Módulo de Bienvenida (`WelcomeModule`)
- Generación de imágenes personalizadas
- Configuración por servidor
- Sistema de fallback
- Gestión de canales

### Módulo de Niveles (`LevelingModule`)
- Sistema de experiencia
- Multiplicadores de XP
- Rangos automáticos
- Tablas de clasificación

### Módulo de Roles (`AutoRoleModule`)
- Asignación automática
- Roles temporales
- Protección de roles
- Gestión de permisos

## 🎮 Comandos

### Comandos de Administración
| Comando | Descripción | Permisos |
|---------|-------------|-----------|
| `/welcome` | Configura el canal de bienvenida | `ManageGuild` |
| `/autorole` | Gestiona roles automáticos | `Administrator` |
| `/setup-ranks` | Configura el sistema de rangos | `Administrator` |

### Comandos de Utilidad
| Comando | Descripción | Permisos |
|---------|-------------|-----------|
| `/rank` | Muestra tu nivel actual | `None` |
| `/leaderboard` | Muestra la tabla de clasificación | `None` |

## 📡 Eventos

### Eventos de Usuario
- `guildMemberAdd`: Bienvenida y auto-rol
- `messageCreate`: Sistema de niveles
- `guildMemberUpdate`: Gestión de roles

### Eventos de Servidor
- `guildCreate`: Configuración inicial
- `guildDelete`: Limpieza de datos

## 🤝 Contribución

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

## 📞 Soporte

Si necesitas ayuda o tienes alguna sugerencia:
- Abre un issue en GitHub
- Únete a nuestro [servidor de Discord](https://discord.gg/***)

---

*Desarrollado con ❤️ por White-Knight*
