# Especificación de producto

## Modelo comercial

VisitPass es un SaaS multiempresa con planes Free y Premium. El alta del negocio es autoservicio, Stripe activa el plan tras confirmar la suscripción y cada organización opera en un tenant aislado.

## Superficies

1. `app.dominio.com`: panel de administración y operación.
2. `dominio.com/b/{slug}`: página pública de cada negocio.
3. Dominio personalizado: función Premium mediante verificación DNS.
4. Escáner PWA: interfaz enfocada en empleados de caja.

## Ciclo de campaña

`DRAFT → ACTIVE → REWARD_EARNED → REDEEMED → COMPLETED`

- El negocio define meta, monto mínimo, cooldown, fecha fija de caducidad y tipo de premio.
- Una campaña puede permitir tarjeta anónima, teléfono obligatorio, teléfono para recuperación o vinculación posterior.
- La visita final asigna y revela el premio dentro de una transacción.
- El premio aleatorio se obtiene de un pool ponderado con inventario.
- Al canjear, la tarjeta finaliza y no reinicia.

## Planes

Free limita campañas, sucursales, empleados y visitas mensuales. Premium aumenta cuotas y habilita premios aleatorios, editor avanzado, reportes, exportaciones, integraciones y dominios personalizados. Los límites viven como entitlements, no como condiciones repartidas por la aplicación.

## Fuera del primer baseline

- integración directa con POS;
- aplicación móvil nativa;
- marketplace de plantillas;
- facturación fiscal mexicana;
- campañas recurrentes después de un canje.

