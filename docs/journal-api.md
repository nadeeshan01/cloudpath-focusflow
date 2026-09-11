# FocusFlow Journal API

All journal routes require:

```http
Authorization: Bearer JWT_TOKEN
```

## Create entry

```http
POST /api/v1/journal
```

Request body:

```json
{
  "title": "Backend development progress",
  "content": "Completed protected journal CRUD APIs.",
  "mood": "great",
  "entryDate": "2026-09-08T00:00:00.000Z",
  "tags": ["backend", "mongodb", "devops"]
}
```

## List entries

```http
GET /api/v1/journal
GET /api/v1/journal?mood=great
GET /api/v1/journal?tag=backend
```

## Get entry

```http
GET /api/v1/journal/:entryId
```

## Update entry

```http
PATCH /api/v1/journal/:entryId
```

## Delete entry

```http
DELETE /api/v1/journal/:entryId
```

## Security

Every journal query is restricted to the authenticated owner:

```js
{
  _id: entryId,
  owner: req.user._id
}
```

A user cannot view, update, or delete another user’s journal entry.