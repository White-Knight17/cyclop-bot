---
name: diseñar_interfaz_discord
description: '"Genera el código para construir un MessageEmbed y/o ActionRows con botones (MessageButton) o menús desplegables (StringSelectMenu) utilizando los constructores nativos de discord.js. Retorna solo la lógica de construcción de la UI para ser adjuntada a una respuesta."'
---
**Parámetros:**

- `titulo_embed` _(String, Obligatorio)_: El título principal del mensaje.
    
- `campos_datos` _(String, Obligatorio)_: Qué información debe mostrar en los 'fields'.
    
- `incluye_botones` _(Boolean, Obligatorio)_: Si debe agregar interactividad.