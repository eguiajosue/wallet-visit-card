# VisitPass

SaaS multiempresa para crear programas de visitas y distribuir tarjetas de fidelización en Apple Wallet, Google Wallet y Samsung Wallet.

## Alcance del baseline

- negocios, sucursales, empleados y permisos aislados por tenant;
- campañas con meta de visitas, fecha de caducidad y premio fijo o aleatorio;
- tarjetas anónimas o vinculadas a un teléfono;
- registro de visitas con ticket único, monto mínimo y tiempo mínimo entre visitas;
- recompensa revelada al registrar la última visita y cierre después del canje;
- auditoría de altas, cancelaciones y canjes;
- límites por plan Free/Premium;
- editor por plantilla, lienzo y carga de arte;
- puertos separados para Apple, Google y Samsung Wallet.

## Stack

- `apps/web`: Next.js 15, React 19 y CSS nativo.
- `apps/api`: NestJS, DTOs validados y transacciones Prisma.
- `packages/db`: PostgreSQL + Prisma.
- Monorepo: pnpm + Turborepo.

## Inicio local

1. Copia `.env.example` como `.env` y configura PostgreSQL.
2. Ejecuta `pnpm install`.
3. Ejecuta `pnpm db:generate && pnpm db:migrate`.
4. Ejecuta `pnpm dev`.

El panel estará en `http://localhost:3000` y la API en `http://localhost:4000`.

## Estado de Wallet

Los adaptadores y contratos están preparados, pero publicar pases reales requiere credenciales y aprobación de cada proveedor. Samsung Wallet además exige onboarding de partner. Las credenciales nunca deben almacenarse en el repositorio.

