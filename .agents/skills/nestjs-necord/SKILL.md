---
name: generar_comando_necord_nestjs
description: '"Genera un comando (SlashCommand, ContextMenu) o un Evento de Discord utilizando la librería Necord dentro de una arquitectura NestJS. El código debe incluir los decoradores correspondientes, el DTO para las opciones del comando (Options) e inyectar los servicios necesarios (ej: repositorios de Mongoose) respetando la Clean Architecture."'
---
**Parámetros:**

- `nombre_comando` _(String, Obligatorio)_: El nombre del comando (ej: "banear", "perfil").
    
- `tipo_interaccion` _(String, Obligatorio)_: Si es un "SlashCommand", "UserCommand", o un "Event" (ej: "ready", "messageCreate").
    
- `requiere_db` _(Boolean, Obligatorio)_: Si el comando necesita leer o escribir en MongoDB para inyectar el servicio adecuado.