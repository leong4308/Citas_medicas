# API Documentation

Base URL: `http://localhost:4000/api`

> Leyenda: ✅ = implementado · ⬜ = **pendiente de implementar por el equipo**.
> Mantén esta tabla actualizada cada vez que agregues o cambies una ruta.

## Endpoints

### Sistema

| Método | Ruta      | Descripción           | Estado |
| ------ | --------- | --------------------- | ------ |
| GET    | `/health` | Estado del servidor   | ✅     |

### Auth

| Método | Ruta             | Descripción       | Estado |
| ------ | ---------------- | ----------------- | ------ |
| POST   | `/auth/login`    | Iniciar sesión    | ⬜     |
| POST   | `/auth/register` | Registrar usuario | ⬜     |

### Users

| Método | Ruta         | Descripción        | Estado                                        |
| ------ | ------------ | ------------------ | --------------------------------------------- |
| GET    | `/users`     | Listar usuarios    | ✅ (devuelve un mensaje de ejemplo, sin BD)    |
| GET    | `/users/:id` | Obtener usuario    | ✅ (devuelve un mensaje de ejemplo, sin BD)    |
| POST   | `/users`     | Crear usuario      | ⬜ (hoy hace eco del `body`, no guarda nada)   |
| PUT    | `/users/:id` | Actualizar usuario | ⬜ (hoy hace eco del `body`, no guarda nada)   |
| DELETE | `/users/:id` | Eliminar usuario   | ⬜ (hoy devuelve un mensaje, no borra nada)    |

## Formato de las respuestas

Todas las respuestas son JSON con esta forma:

```json
{ "message": "Descripción en español", "data": { } }
```

En caso de error: `{ "message": "Explicación del error" }` con el código HTTP correspondiente.

