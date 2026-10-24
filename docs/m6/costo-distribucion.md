# Costo relativo de las alternativas de distribución — CookSmart (M6)

> **Qué es y qué no es:** una estimación en **órdenes de magnitud** (10⁰, 10¹, 10², 10³) para comparar alternativas entre sí. **No** es una cotización. Los rangos de precio son supuestos explícitos, típicos de nubes públicas y de planes gestionados de gama de entrada; cada equipo debe validarlos con la calculadora del proveedor que elija antes de usarlos para una compra real.
>
> **Entradas:** EXP-002 (qué falla primero al crecer 10×), EXP-003 (táctica medida), ADR-001 (monolito modular), ADR-003 (sin broker), matriz de calidad (Escalabilidad y Observabilidad = prioridad Baja), equipo de 3 personas.

## 1. Alternativas

| ID | Alternativa | Qué se despliega |
|---|---|---|
| **D0** | Monolito actual en un solo host | 1 VM pequeña con Docker Compose: API (1 proceso Node) + PostgreSQL + Adminer |
| **D1** | Monolito que **usa todos los núcleos** del mismo host | La misma VM, con *N* réplicas del contenedor de la API (o `cluster` de Node) detrás de un proxy local (Nginx/Traefik). Sin cambios en el código de dominio |
| **D2** | Monolito **replicado en varios hosts** | 2–3 VMs con la API detrás de un balanceador gestionado + PostgreSQL gestionado (servicio administrado) |
| **D3** | **Microservicios** (la propuesta típica de la IA) | 5 servicios (uno por contexto BC1–BC5) + API Gateway + broker (RabbitMQ/Kafka) + una base por servicio + Kubernetes gestionado + plataforma de observabilidad |

## 2. Supuestos de precio (explícitos)

| Recurso | Supuesto (USD/mes) | Orden |
|---|---|---|
| VM pequeña (2 vCPU, 4 GB) | 10–40 | 10¹ |
| VM mediana (4–8 vCPU) | 40–150 | 10¹–10² |
| PostgreSQL gestionado, gama de entrada | 15–100 por instancia | 10¹–10² |
| Balanceador de carga gestionado | 15–25 | 10¹ |
| Clúster de Kubernetes gestionado (plano de control + 3 nodos) | 150–400 | 10² |
| Broker gestionado (RabbitMQ/Kafka) | 30–300 | 10¹–10² |
| Observabilidad (logs + métricas + trazas) para varios servicios | 50–300 | 10¹–10² |
| Hora de trabajo del equipo (estudiante / junior) | se mide en **horas/semana**, no en USD | — |

## 3. Comparación en órdenes de magnitud

| Dimensión | D0 | D1 | D2 | D3 |
|---|---|---|---|---|
| Infraestructura (USD/mes) | **10¹** (≈ 10–40) | **10¹** (≈ 40–150 si se sube a 4–8 vCPU; 10¹ si la VM ya los tiene) | **10²** (≈ 100–300) | **10³** (≈ 500–2 000: 5 bases + K8s + broker + gateway + observabilidad) |
| Unidades desplegables | 1 | 1 (N réplicas idénticas) | 1 (N réplicas) | ≥ 7 (5 servicios + gateway + broker) |
| Bases de datos | 1 | 1 | 1 (gestionada) | 5 |
| Operación (horas/semana del equipo) | **10⁰** | **10⁰** | **10⁰–10¹** | **10¹–10²** |
| Cambios en el código | ninguno | ninguno en el dominio; solo configuración de despliegue | ninguno en el dominio; sesión ya es *stateless* (JWT) | reescritura de integración: FK → llamadas remotas, consistencia eventual (ADR-003) |
| Habilidades nuevas para el equipo | — | proxy inverso | balanceador, base gestionada | Kubernetes, broker, trazas distribuidas, contratos entre servicios |
| ¿Ataca el cuello de botella medido en EXP-002? | **No** (es el estado que colapsa) | **Sí**: el cuello es 1 núcleo de 12 | **Sí**, pero el host actual aún tiene 11 núcleos libres | **Indirectamente**: separar Identidad le da su propio núcleo, lo mismo que D1, a 10²× el costo |

## 4. Relación con el cuello de botella medido

EXP-002 (`experimentos/EXP-002-crecimiento-10x/03-resultados-y-veredicto.md`):

- La API usa **un núcleo al 100 %** desde 1× (50 VUs); el host tiene **12**. PostgreSQL usa **≈ 2 %**.
- El límite es la CPU del **login** (bcrypt costo 12, ≈ 0,3–0,5 s de CPU por login → ≈ 3 logins/s por núcleo, medido en EXP-003/004).
- Por lo tanto, la capacidad de login escala con **los núcleos que la API pueda usar**, no con el número de servicios ni de bases de datos.

| Alternativa | Capacidad de login esperada | Supuesto |
|---|---|---|
| D0 | ≈ 3 logins/s (medido: 2,99–3,03 a 10×) | 1 núcleo al 100 % |
| D1 (N procesos en el mismo host) | **Medido en EXP-004:** 3,03 → **13,37 logins/s con N = 4 (4,4×)**; 0 *timeouts*; PostgreSQL 8 % | **Medido** para N = 4; para N mayor, inferido |
| D2 | igual que D1 pero repartido en hosts | Inferido |
| D3 | Identidad con sus propios núcleos; los demás servicios dejan de sufrir el contagio | Inferido; el mismo efecto que D1 + T1 (EXP-003) |

**Lo que sí es medido:** que el recurso escaso es CPU del proceso y no la base de datos (EXP-002), y que D1 con 4 procesos multiplica la capacidad de login por 4,4 sin que la base se vuelva el cuello (EXP-004). **Lo que no es medido:** el comportamiento con más de 4 procesos ni la combinación con T1/T2 (condición de entrada del ADR-004).

## 5. Lectura

- **D0 → D1 cuesta ≈ 10⁰–10¹ USD/mes más** (nada si la VM ya tiene núcleos libres, como la de pruebas) y **0 cambios de dominio**, y ataca directamente el recurso que se satura.
- **D3 (microservicios) cuesta ≈ 10²× más en infraestructura y ≈ 10× más en horas de operación**, obliga a reescribir integraciones que ADR-003 decidió mantener síncronas y con FK, y su beneficio para *este* fallo (darle CPU propia al login) se obtiene con D1.
- **D2** solo se justifica cuando un host ya no alcance (núcleos agotados) o cuando la disponibilidad exija sobrevivir a la caída de una máquina (RNF03); ninguno de los dos se midió como problema hoy.
- **La dimensión que más pesa no es el dinero sino las horas del equipo:** con 3 personas, pasar de 10⁰ a 10¹–10² horas/semana de operación compite directamente con el desarrollo del producto.
