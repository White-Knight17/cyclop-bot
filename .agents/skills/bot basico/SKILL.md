---
name: crear_comando_discordjs_puro
description: "\"Genera un comando o manejador de eventos para un bot de Discord utilizando Node.js puro y discord.js (v14 o superior). El código debe exportarse como un módulo simple (CommonJS o ES Modules) conteniendo el 'data' (SlashCommandBuilder) y la función 'execute'. Debe ser código ligero, sin frameworks adicionales.\""
---
- **Parámetros:**
    
    - `nombre_comando` _(String, Obligatorio)_: El nombre de la acción.
        
    - `descripcion_comando` _(String, Obligatorio)_: Lo que verá el usuario en Discord al tipear `/`.
        
    - `opciones_requeridas` _(Array de Strings, Opcional)_: Qué parámetros pide el comando (ej: `["usuario_destino", "motivo"]`).