# FocusFlow Task API

All task routes require:

```http
Authorization: Bearer JWT_TOKEN
```

## Create task

```http
POST /api/v1/tasks
```

Request body:

```json
{
  "title": "Complete backend task API",
  "description": "Create task CRUD endpoints",
  "status": "todo",
  "priority": "high",
  "dueDate": "2026-09-15T00:00:00.000Z"
}
```

## List tasks

```http
GET /api/v1/tasks
GET /api/v1/tasks?status=todo
GET /api/v1/tasks?priority=high
```

## Get one task

```http
GET /api/v1/tasks/:taskId
```

## Update task

```http
PATCH /api/v1/tasks/:taskId
```

## Delete task

```http
DELETE /api/v1/tasks/:taskId
```

## Security

The API always filters tasks using the authenticated user ID:

```js
{
  _id: taskId,
  owner: req.user._id
}
```

A user cannot access another user’s task even if the user knows the task ID.