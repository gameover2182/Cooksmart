# Atributos de calidad, QAs y Trade Off

Con base a lo anteriormente propuesto y soportado por requisitos no funcionales, se escogen los siguientes atributos de calidad:

> **Alcance arquitectónico:** Los escenarios de calidad se analizan considerando el estado actual verificable de CookSmart y, cuando corresponda, las decisiones arquitectónicas propuestas como trabajo futuro. La arquitectura de microservicios, API Gateway, Redis, base de datos relacional y motor de IA no se presenta como infraestructura actualmente implementada, sino como una arquitectura objetivo para evaluar riesgos y posibles decisiones futuras.

| Atributo | Soporte |
|--|--|
| Seguridad | RNF02 - Ley 1581 del 2012 - Pruebas de seguridad (PSeg01 - PSeg10) |
| Rendimiento | RNF04 - Pruebas de rendimiento (PR01 - PR07) |
| Disponibilidad | RNF03 - Debe estar disponible al menos el 95% de los accesos - Pruebas de estrés/resistencia (PR04 - PR05) |

Se espera que estos escenarios entren en revision exhaustiva cuando los riesgos iniciales del proyecto se mitiguen.

## Escenarios de calidad (QAs)

Para generar los Escenarios de calidad se le pidió a Claude AI a partir del siguiente prompt:

     Actúa como un arquitecto de software senior especializado en Arquitecture Tradeoff
    Analysis Method (ATAM) y en la definición de Escenarios de Atributos de Calidad (QAS).
    
    CONTEXTO DEL SISTEMA:
    Cook Smart es una plataforma web que genera recetas a partir de los ingredientes
    disponibles en la nevera del usuario, con el objetivo de reducir el desperdicio de
    alimentos en hogares de Bogotá (familias de ingresos medios y personas que viven
    solas). La arquitectura es de microservicios (Autenticación, Usuarios, Inventario,
    Motor de Recomendación de Recetas, Notificaciones) detrás de un API Gateway, con
    frontend web, backend REST, base de datos MySQL/PostgreSQL, caché Redis, y una
    integración externa con un motor de IA para generar las recetas. El sistema debe
    cumplir con la Ley 1581 de 2012 (protección de datos en Colombia) y con un público
    objetivo de baja alfabetización digital.
    
    TAREA:
    Genera 5 escenarios de atributo de calidad (QAS) para el atributo de [SEGURIDAD /
    RENDIMIENTO / DISPONIBILIDAD — reemplazar según el atributo que se necesite].
    
    Cada escenario debe:
    1. Ser realista y específico al dominio de Cook Smart (no genérico).
    2. Estar dividido explícitamente en las 6 partes: Fuente del estímulo, Estímulo,
       Artefacto, Ambiente, Respuesta, Medida de respuesta.
    3. Incluir métricas numéricas concretas y medibles en la Medida de respuesta
       (tiempos, porcentajes, umbrales), no descripciones vagas como "rápido" o "seguro".
    4. Estar alineado con los requerimientos no funcionales ya definidos del proyecto
       (RNF01–RNF06) y, si aplica, con los casos de prueba ya existentes en el plan de
       QA (PU, PI, PS, PA, PR, PSeg).
    5. Cubrir situaciones distintas entre sí (no repetir el mismo tipo de estímulo)
       —por ejemplo, variar entre condiciones normales, picos de carga, fallos de
       servicios externos, ataques maliciosos, o errores de usuario.
    
    FORMATO DE SALIDA:
    Presenta los 5 escenarios en una tabla markdown con columnas:
    | # | Fuente | Estímulo | Artefacto | Ambiente | Respuesta | Medida |
    
   

# QAs

## Seguridad

| # | Fuente | Estímulo | Artefacto | Ambiente | Respuesta | Medida | Nuestra Clasificación | Justificación
|--|--|--|--|--|--|--|--|--|
|1|Atacante automatizado (botnet externa)|Ataque de fuerza bruta / credential stuffing (1.000 solicitudes/min) contra /api/v1/auth/login|API Gateway, Microservicio de Autenticación, Rate Limiter (Redis)|Operación normal en producción|Activar estrangulamiento de tasa (Rate Limiting), bloquear la IP temporalmente, registrar el evento en logs de auditoría y exigir CAPTCHA|Bloqueo en ≤ 1 segundo al superar 5 intentos fallidos/min por IP; 0% de tokens JWT emitidos a peticiones maliciosas; IP bloqueada por 15 minutos|Modificado|Este escenario coincide casi punto a punto con nuestro propio caso de prueba PSeg07 (20 intentos fallidos en 1 minuto → bloqueo tras 5 intentos, 15 minutos). La IA solo añadió detalles razonables (CAPTCHA, framing de botnet) que no contradicen nuestro diseño.
|2|Atacante o interceptor de red en tránsito|Intento de interceptación o acceso directo a datos personales de usuarios de Bogotá (nombres, correos, despensas)|Microservicio de Usuarios, Base de Datos (PostgreSQL/MySQL), API Gateway|Usuarios, Base de Datos (PostgreSQL/MySQL), API Gateway	Operación continua bajo la Ley 1581 de 2012 (Habeas Data)|Forzar cifrado en tránsito y reposo, anonimizar logs, restringir acceso a PII e implementar mecanismo de revocación/borrado de datos|100% de tráfico HTTPS/TLS 1.3; reposo cifrado con AES-256; 0 fugas de PII en logs; atención a solicitudes de eliminación en ≤ 48 horas (PSeg01)|Modificado|	El fundamento es correcto: nuestro RNF02 cita explícitamente la Ley 1581 de 2012. Sin embargo, la IA agregó especificaciones que nosotros nunca definimos (TLS 1.3, AES-256 en reposo, eliminación en ≤48 horas). En nuestra acta solo establecimos que los datos no se compartirían con terceros y que habría una política de privacidad al registrarse, sin esos números concretos. Vamos a ajustar la medida antes de usarla.
|3|Usuario autenticado malintencionado|Alteración del parámetro userID en el endpoint /api/v1/inventory/{id} (Ataque BOLA/IDOR) para modificar la despensa de otro usuario|API Gateway, Microservicio de Inventario (Módulo de Autorización ABAC/RBAC)|Operación habitual desde la aplicación web|Validar las declaraciones (claims) del token JWT firmado contra la propiedad del recurso solicitado antes de consultar la BD, rechazando el acceso no autorizado|Rechazo inmediato con HTTP 403 Forbidden en ≤ 50 ms; 0% de modificaciones o lecturas no autorizadas entre usuarios ajenos; 100% registrado en SIEM|Válido|Coincide casi exactamente con nuestro caso PSeg03 (token de usuario A intentando acceder a datos de usuario B → 403 Forbidden). Es el escenario mejor anclado a lo que ya teníamos documentado.
|4|Usuario que ingresa datos en el formulario|Inyección de scripts (XSS) o código malicioso (sentencias SQL) en los campos de texto de "Nombre de ingrediente" o "Notas"|Frontend Web, API Gateway (WAF), Microservicio de Inventario (ORM)|Carga cotidiana de datos por usuarios con baja alfabetización digital|Sanitización estricta de entradas en frontend y backend, empleo exclusivo de consultas preparadas mediante ORM y filtrado en WAF|0% de ejecución de scripts o sentencias SQL inyectadas; rechazo de entrada maliciosa en ≤ 10 ms respondiendo HTTP 422 Unprocessable Entity|Modificado|	El contenido de fondo sí existe en nuestro plan (PSeg01 inyección SQL y PSeg04 XSS), pero la IA los fusionó en un solo escenario y agregó un WAF perimetral, componente que no incluimos en ninguno de nuestros diagramas de componentes ni de despliegue (solo contemplamos API Gateway). Debemos decidir si de verdad vamos a incorporar un WAF a nuestra arquitectura o retirarlo del escenario.
|5|Atacante con acceso al cliente|Intento de uso de un token JWT alterado, expirado o firmado con una clave secreta no válida para consumir el Motor de Recomendaciones|API Gateway, Microservicio de Autenticación, Secret Manager (KMS)|Enrutamiento de peticiones en el API Gateway|Verificación criptográfica de la firma digital (RSA-256/HS256) y validación de vigencia del token (exp) previa a la distribución del tráfico|Rechazo en el Gateway con HTTP 401 Unauthorized en ≤ 5 ms; 0% de solicitudes con JWT alterado procesadas por microservicios internos|Modificado|	Nosotros sí usamos JWT (lo confirmamos en nuestro diagrama de secuencias y en RF02), pero no habíamos definido ningún caso de prueba sobre validación de firma de token, y el KMS no aparece en ninguna parte de nuestra arquitectura documentada. Es una extensión razonable, pero no algo que ya habíamos diseñado.

## Rendimiento

| # | Fuente | Estímulo | Artefacto | Ambiente | Respuesta | Medida | Nuestra Calificacion | Justificacion
|--|--|--|--|--|--|--|--|--|
|1|Usuario autenticado desde la aplicación web|Consulta de recomendaciones de recetas basadas en los ingredientes guardados en el inventario|API Gateway, Microservicio de Recomendación, Caché Redis|Operación normal en horas valle (carga de 300 a 500 solicitudes/minuto)|Servir las recetas precalculadas directamente desde la capa de caché Redis, evitando llamadas redundantes a la BD relacional y al motor de IA externo|Latencia de respuesta P95 ≤ 200 ms, uso de CPU en Redis < 40%, y tasa de aciertos en caché (Cache Hit Ratio) ≥ 85%
|2|10.000 usuarios concurrentes simultáneos (familias en Bogotá)|Solicitudes masivas de filtrado de recetas con ingredientes a punto de vencer entre las 6:00 PM y 8:00 PM|Microservicio de Inventario, Réplicas de Lectura (PostgreSQL/MySQL), API Gateway|Pico de carga crítico en horario habitual de preparación de cena|Autoescalado horizontal de instancias del microservicio de Inventario, balanceo de carga y derivación de lectura a réplicas de la BD|Latencia promedio ≤ 800 ms (P99 ≤ 1.5 s), tasa de errores HTTP 5xx 0%, y tiempo de activación del autoescalado (HPA) < 45 segundos al superar 75% de CPU
|3|Proveedor externo del Motor de IA Generativa|Latencia anormal o timeout en la respuesta (> 5.000 ms) al generar una receta personalizada fuera de catálogo|API Gateway, Patrón Circuit Breaker (Resilience4j), Microservicio de Recomendación|Operación degradada por fallo o lentitud de integración con el servicio externo de IA|Activación del Circuit Breaker tras 5 fallos consecutivos, ejecutando un fallback a un motor heurístico local con recetas prealmacenadas en BD|Ejecución del fallback en ≤ 300 ms tras el timeout; tiempo total de respuesta al usuario ≤ 1.2 segundos con 100% de respuestas útiles servidas
|4|Múltiples usuarios actualizando despensas tras compras de fin de semana|1.200 transacciones simultáneas de modificación masiva de ingredientes, unidades y fechas de vencimiento|Microservicio de Inventario, Nodo Escritor de la Base de Datos Relacional|Operación pico de alta concurrencia de escritura de datos|Procesamiento asíncrono con confirmación optimizada en BD, aislamiento adecuado de transacciones e invalidación selectiva de claves en Redis|Tiempo de respuesta de confirmación en la UI ≤ 400 ms (P95), procesamiento en backend ≥ 500 TPS (transacciones/segundo) y 0 deadlocks en base de datos
|5|Usuario en zona con cobertura móvil limitada en Bogotá|Búsqueda de recetas con baja conectividad móvil (RTT > 400 ms y pérdida de paquetes > 5%)|Frontend Web (PWA/SPA), API Gateway (Compresión Brotli/Gzip)|Red móvil inestable en dispositivos de gama media/baja|Reducción del tamaño del payload JSON (< 15 KB), caché local con Service Workers y renderizado progresivo inmediato de la interfaz|Tiempo hasta el primer contenido con significado (FMP ≤ 1.5 segundos), First Input Delay (FID < 100 ms) y tamaño total de datos transferidos por petición < 20 KB
## Disponibilidad

| # | Fuente | Estímulo | Artefacto | Ambiente | Respuesta | Medida | Nuestra Calificacion|Justificacion
|--|--|--|--|--|--|--|--|--|
| 1 | Fallo de hardware/disco en la infraestructura cloud | Falla total e imprevista de la instancia primaria de la Base de Datos Relacional (Master) | Cluster de BD (Master-Replica), Microservicios de Inventario y Recomendación | Hora pico de uso habitual (preparación de cena) | Conmutación automática por error (Failover), promoción de la réplica de lectura a nuevo nodo primario y reconexión del pool de base de datos | Tiempo Medio de Recuperación (MTTR ≤ 30 s); tiempo de inactividad visible (Downtime ≤ 45 s); pérdida de datos confirmados RPO = 0 s|Falso| 	Nuestro diagrama de despliegue muestra un único nodo de base de datos (MySQL/PostgreSQL), no un clúster Master-Replica. Este escenario contradice directamente lo que ya definimos; no es una extensión de nuestro diseño, sino una arquitectura distinta. Además, para nuestro alcance de 8 semanas y equipo de 2-3 personas, un clúster de alta disponibilidad de base de datos está fuera de lo que podemos sustentar.
|2|Proveedor externo de IA Generativa|Caída total del servicio externo (HTTP 503 / Timeout continuo > 10 s) por un periodo de 2 horas|Microservicio de Recomendación de Recetas, Motor Heurístico Local, Base de Datos|Período de alta demanda de generación de recetas|Cambio automático a un motor heurístico interno con banco de recetas prealmacenadas (Graceful Degradation) sin interrumpir la experiencia del usuario|Cambio al sistema contingente en ≤ 200 ms; disponibilidad efectiva del módulo de recetas ≥ 99.9% durante la falla; satisfacción funcional ≥ 90%|Modificado|El disparador sí está bien anclado: nuestro caso PI05 contempla explícitamente el comportamiento cuando la API de IA no está disponible (mock 503). Sin embargo, nuestro criterio de aceptación original solo exigía responder con error 503 y un mensaje amigable sin quedar colgado; no contemplamos un motor heurístico local con banco de recetas prealmacenadas. Es una idea interesante que podríamos evaluar incorporar, pero no describe lo que ya teníamos diseñado.
|3|Ráfaga de procesos programados|Caída por agotamiento de memoria del contenedor del Microservicio de Notificaciones al enviar 50.000 alertas push simultáneas|Microservicio de Notificaciones, Cola de Mensajes (RabbitMQ/Kafka), Kubernetes / Docker Swarm|Notificación masiva matutina (8:00 AM) sobre ingredientes a vencer|Auto-recuperación del servicio (Self-Healing), reinicio del contenedor por el orquestador y reanudación de la lectura de la cola asíncrona persistida|Reinicio del contenedor en ≤ 15 s; pérdida de notificaciones pendientes 0% (garantía At-Least-Once); procesamiento completo de la ráfaga en ≤ 10 min|Falso| 	Nuestro RF06 y nuestro caso PI06 hablan de notificaciones por correo electrónico, no de push notifications. Tampoco incluimos RabbitMQ, Kafka, Kubernetes ni Docker Swarm en ningún diagrama de nuestra arquitectura. Este escenario introduce un stack tecnológico completo que no corresponde a lo que diseñamos.
|4|Corrupción de memoria o reinicio de infraestructura|Pérdida total y repentina del cluster de caché Redis (Cache Flush involuntario)|Capa de Caché Redis, Microservicio de Recomendación, Base de Datos|Operación continua bajo carga media|Evitar la saturación de la BD (Cache Stampede) mediante Circuit Breakers, derivación escalonada de peticiones y repoblado paulatino (Cache Warming)|Degradación temporal de latencia P95 ≤ 1.2 s (sin caídas); repoblado del 80% de la caché en ≤ 5 min; disponibilidad global de la API ≥ 99.5%|Modificado| 	El uso de Redis sí está bien fundamentado en nuestra acta (PI03 y PR07), pero el patrón de Cache Stampede con Circuit Breakers y las cifras específicas (P95 ≤1.2s, repoblado del 80% en 5 min) son una extensión que nosotros no habíamos especificado. Tenemos que decidir si vamos a implementar ese patrón o simplificar el escenario.
|5|Evento catastrófico en el centro de datos principal|Caída completa de la Zona de Disponibilidad (AZ1) del proveedor cloud|API Gateway, Balanceador de Carga Multi-AZ, Réplicas en Zona de Disponibilidad 2 (AZ2)|Falla física grave de infraestructura externa|Conmutación de tráfico DNS hacia la zona secundaria (AZ2) activa/pasiva y aprovisionamiento automático de instancias de microservicios|Genérico|Objetivo de Tiempo de Recuperación (RTO ≤ 5 min); Objetivo de Punto de Recuperación (RPO ≤ 10 s); Disponibilidad anual garantizada del sistema SLA ≥ 99.9%|Este escenario podría aplicarse a cualquier sistema desplegado en la nube sin cambiar una palabra. Nosotros solo definimos en RNF03 una disponibilidad ≥95%, sin mencionar zonas de disponibilidad múltiples, failover por DNS ni infraestructura como código en ningún diagrama. No contradice frontalmente lo que definimos, pero tampoco está anclado a nuestras decisiones — lo consideramos sobredimensionado para el alcance de nuestro proyecto académico.

# Tabla de Trade Offs

Considerando los Escenarios de calidad y las medidas necesarias para fortalecer el proyecto en cada aspecto, teniendo en cuenta la arquitectura a la que se quiere llegar, se obtienen los siguientes intercambios.

|Se mejora|Se Sacrifica|Justificacion|
|--|--|--|
|Seguridad|Rendimiento|	Más validaciones, hashing (bcrypt), rate limiting y verificación de tokens en cada microservicio añaden latencia a cada petición.|
|Seguridad|Usabilidad|	CAPTCHA tras intentos fallidos, expiración de sesión (24h), y políticas de contraseña más estrictas generan fricción para usuarios con bajo nivel de alfabetización digital, contradiciendo RNF01.|
|Rendimiento|Seguridad|	Cachear agresivamente en Redis para ganar velocidad puede tentar a guardar datos sensibles en caché si no se es meticuloso.
|Rendimiento|Mantenibilidad|Optimizaciones específicas (caché, consultas ad-hoc, denormalización) hacen el código más complejo y menos genérico de mantener con un equipo de solo 2-3 personas.|
|Disponibilidad|Complejidad|Redundancia, réplicas de base de datos y monitoreo activo para sostener 95%+ de uptime implica más infraestructura.|