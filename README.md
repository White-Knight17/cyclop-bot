# Cyclop-bot

## 📜 Documentación Técnica: Bot de Discord con NestJS

🔧 Requisitos Previos

- Node.js v18+
- NestJS CLI (npm i -g @nestjs/cli)
- Cuenta en Discord Developer Portal

## Installation

🚀 1. Configuración Inicial del Proyecto

```bash
# Crear proyecto NestJS
    nest new bot-discord
    cd bot-discord

# Instalar dependencias esenciales
    npm install @discordjs/rest discord-api-types@0.37.99 necord@latest discord.js @nestjs/config axios
    npm install --save-dev @types/node
```

## 🔑 2. Configuración del Bot en Discord
Ve al Portal de Desarrolladores de Discord

- Crea una nueva aplicación → Haz clic en "Bot" → Copia el TOKEN.

 - Activa estos Intents:
    - Presence Intent
    - Server Members Intent
    - Message Content Intent


## 🌐 3. Archivo .env
Crea un archivo .env en la raíz del proyecto:

env
```bash

# Discord
DISCORD_TOKEN=tu_token_aqui
DISCORD_GUILD_ID=id_tu_servidor  # Opcional para desarrollo
DISCORD_CLIENT_ID=tu_client_id

# Config
PREFIX=!
ENVIRONMENT=development

# Roles
WELCOME_ROLE_ID=id_rol_bienvenida

```
