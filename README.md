### Start up

- `$ make up` // uses nitro's services for now
- `$ make start`
  - Client: http://localhost:4000
  - Server: http://localhost:8000 (is also GraphiQL)

### Some whys:

I'm leaving the formula field as free text so that we can make complex field queries such as CONCAT, CASE, and whatever we need.

```sql
CONCAT(
  COUNT(DISTINCT id),
  "/",
  (COUNT(DISTINCT id) * SUM(DISTINCT id) OVER ())
)
```
