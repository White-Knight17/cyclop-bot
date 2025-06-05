
# 📜 Documentación Técnica | CYCLOP-BOT


*Bot de Discord modular con NestJS y Necord*

---

## 🚀 Tecnologías  
- **Backend**: NestJS  
- **Discord**: Discord.js v14 + Necord  
- **Database**: MongoDB (Mongoose)  

---

## 📦 Instalación  
1. Clona el repositorio:  
   ```bash
   git clone https://github.com/***/CYCLOP-BOT.git



## 📂 Estructura del Proyecto  
```plaintext
└── src/
    ├── common/            # Utilidades globales
    │   ├── filters/       → Filtros de excepciones
    │   ├── guards/        → Guards de autenticación
    │   └── interfaces/    → Tipos/DTOS compartidos
    │
    ├── database/          # Capa de datos
    │   ├── schemas/       → Esquemas de MongoDB
    │   └── database.module.ts
    │
    ├── discord/           # Lógica de Discord
    │   ├── commands/      → Slash Commands
    │   │   ├── admin/     → Comandos de administración
    │   │   ├── fun/       → Comandos divertidos
    │   │   └── utility/   → Comandos útiles
    │   │
    │   ├── events/        → Eventos de Discord
    │   │   ├── guild/     → Eventos de servidor
    │   │   ├── member/    → Eventos de usuarios
    │   │   └── message/   → Mensajes
    │   │
    │   ├── providers/     → Servicios (lógica de negocio)
    │   └── discord.module.ts
    │
    └── features/          # Funcionalidades complejas
        ├── leveling/      → Sistema de niveles (XP)
        └── autorole/      → Roles automáticos
