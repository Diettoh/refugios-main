# SRS (IEEE 830 resumido) - trello-agent-integration

## 1. Propósito
Definir requisitos funcionales mínimos para un servicio dedicado a la integración Trello usada por agentes IA en múltiples productos.

## 2. Alcance
El sistema expone una API HTTP para operaciones base sobre tarjetas Trello:
- crear
- mover de lista
- comentar

No incluye UI administrativa ni orquestación avanzada de agentes en esta versión.

## 3. Requisitos funcionales
- RF-01: El sistema debe permitir crear tarjetas en una lista destino.
- RF-02: El sistema debe permitir mover tarjetas entre listas.
- RF-03: El sistema debe permitir agregar comentarios a tarjetas.
- RF-04: El sistema debe exponer un endpoint de salud para monitoreo.

## 4. Requisitos no funcionales
- RNF-01: Respuestas JSON consistentes para éxito y error.
- RNF-02: Configuración por variables de entorno sin hardcodear secretos.
- RNF-03: Debe poder ejecutarse local y en contenedor Docker.

## 5. Criterios de aceptación
- CA-01: `POST /v1/cards` crea una tarjeta visible en Trello.
- CA-02: `PATCH /v1/cards/:cardId/move` cambia la lista de la tarjeta.
- CA-03: `POST /v1/cards/:cardId/comments` registra comentario visible.
- CA-04: `GET /health` responde `200` con `ok=true`.
