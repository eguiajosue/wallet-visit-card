# Modelo de seguridad

- Todo registro de negocio incluye `tenantId`; el servidor lo deriva de la sesión, nunca del cuerpo enviado por el cliente.
- RBAC: Owner, Admin, Manager, Cashier y Analyst.
- El QR contiene un identificador opaco de alta entropía. Solo se almacena su hash HMAC en la base de datos.
- El registro de visita usa una transacción serializable, clave idempotente y restricción única de ticket por tenant.
- Las cancelaciones requieren rol Manager, motivo y evento de auditoría.
- OTP telefónico con proveedor administrado; no se almacenan códigos OTP.
- Secretos de Wallet cifrados en un gestor de secretos y rotados; nunca en PostgreSQL o Git.
- Rate limiting por IP, usuario, tenant y tarjeta; bloqueo progresivo ante intentos fallidos.
- Webhooks de Stripe y Wallet deben verificar firma y tolerar reintentos de forma idempotente.
- Archivos subidos se validan por firma MIME, tamaño y dimensiones; se renombran y almacenan fuera del origen de ejecución.
- Logs sin teléfonos completos, tokens, números de ticket ni credenciales.

