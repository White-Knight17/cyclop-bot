# Política de Seguridad

## Gestión de Vulnerabilidades

### Estado Actual

A partir de la última auditoría, el proyecto **cyclop-bot** presenta las siguientes vulnerabilidades conocidas:

#### Vulnerabilidades Corregidas

- **file-type**: Solucionado actualizando `@swc/cli` de la versión 0.6.0 a la 0.8.1.
    
- **brace-expansion**: Solucionado mediante `npm audit fix`.
    

#### Vulnerabilidades en Monitoreo (Riesgo Bajo)

Las siguientes vulnerabilidades están presentes pero se consideran de bajo riesgo porque existen únicamente en las **devDependencies** (dependencias de desarrollo):

1. **ajv** (ReDoS mediante la opción `$data`)
    
    - Ubicación: `@nestjs/schematics` → `@angular-devkit/core` → `ajv`
        
    - Riesgo: Moderado
        
    - Estado: **Sin solución disponible**
        
    - Justificación: Son dependencias exclusivas de desarrollo utilizadas para la generación de código. No se incluyen en los builds de producción y no afectan la seguridad en tiempo de ejecución.
        
2. **picomatch** (Inyección de métodos y ReDoS mediante cuantificadores extglob)
    
    - Ubicación: `@nestjs/schematics` → `@angular-devkit/core` → `picomatch`
        
    - Riesgo: Alto
        
    - Estado: **Sin solución disponible**
        
    - Justificación: Igual que ajv; son solo devDependencies.
        

#### Vulnerabilidad Activa (Requiere Atención)

3. **path-to-regexp** (DoS mediante grupos opcionales secuenciales y múltiples comodines)
    
    - Ubicación: `necord` → `path-to-regexp`
        
    - Riesgo: Alto
        
    - Estado: **Solución disponible pero requiere downgrade de necord**
        
    - Versión actual: `necord@6.12.4` depende de `path-to-regexp@8.3.0` (vulnerable)
        
    - Corregido en: `path-to-regexp@8.4.0+`
        
    - Problema: `necord` aún no ha actualizado su dependencia a una versión no vulnerable.
        

### Prácticas de Seguridad

#### Escaneo de Dependencias

- Ejecutar `npm audit` semanalmente para buscar nuevas vulnerabilidades.
    
- Monitorear avisos de seguridad para dependencias clave (`necord`, `@nestjs/*`).
    

#### Dependencias de Desarrollo vs. Producción

- Separamos claramente las `devDependencies` (pruebas, herramientas de construcción) de las `dependencies` (tiempo de ejecución).
    
- Los builds de producción utilizan `npm ci --only=production` para garantizar que no se incluyan dependencias de desarrollo.
    
- Auditorías regulares verifican que las dependencias de producción sean seguras.
    

#### Política de Actualización

- **Vulnerabilidades críticas en runtime**: Abordadas en un plazo de 48 horas.
    
- **Vulnerabilidades de alto riesgo en runtime**: Abordadas en un plazo de 2 semanas.
    
- **Vulnerabilidades de riesgo medio/bajo**: Abordadas en los ciclos regulares de mantenimiento.
    
- **Vulnerabilidades en devDependencies**: Monitoreadas y actualizadas cuando sea conveniente, dado su bajo riesgo de explotación.
    

### Reporte de Problemas de Seguridad

Si descubres una vulnerabilidad de seguridad en este proyecto, por favor:

1. **NO** la divulgues públicamente hasta que hayamos tenido la oportunidad de abordarla.
    
2. Abre un "Private Issue" o contacta directamente a los mantenedores.
    
3. Permítenos un tiempo razonable para investigar y parchear el problema.
    
4. Daremos crédito a la divulgación responsable en nuestro CHANGELOG.
    

### Dependencias con Problemas Conocidos

Mantenemos conocimiento de las siguientes dependencias con problemas conocidos, pero con perfiles de riesgo actualmente aceptables:

|**Dependencia**|**Problema**|**Nivel de Riesgo**|**Mitigación**|
|---|---|---|---|
|ajv (dev)|ReDoS vía opción $data|Bajo|Solo desarrollo, no está en producción|
|picomatch (dev)|Inyección de métodos & ReDoS|Bajo|Solo desarrollo, no está en producción|
|path-to-regexp|DoS vía patrones regex|Alto|Monitoreando actualización de necord; evaluando overrides|

### Seguridad en la Construcción y Despliegue

- Todos los builds se realizan en entornos de CI (Integración Continua) limpios.
    
- Las dependencias se instalan desde `package-lock.json` para garantizar la reproducibilidad.
    
- Los despliegues de producción utilizan solo dependencias verificadas y auditadas.
    
- Las imágenes de contenedores se escanean en busca de vulnerabilidades cuando corresponde.
    

## Última Revisión de Seguridad

- **Fecha**: Abril de 2026
    
- **Revisado por**: Equipo de Desarrollo
    
- **Acciones Tomadas**:
    
    - Corrección de vulnerabilidad en `file-type` mediante la actualización de `@swc/cli`.
        
    - Implementación de la evaluación de estrategia de _overrides_ de dependencias.
        
    - Documentación de la evaluación de riesgos de las `devDependencies`.