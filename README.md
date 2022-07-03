## Demo

<video src="https://youtu.be/70apVKEJP_0" width="500px"></video>

## Dev environment

### Get started

- `asdf install`
- `make venv`
- `source .venv/bin/activate`
- `make install_deps`
- `(cd oxygen_web && make install_deps)`
- `make up`
- `make migrate`

Tab 1:

- `make start_server`
  - http://localhost:8000

Tab 2:

- `cd oxygen_web`
- `make start_client`
  - http://localhost:4000

### VS Code

##### Extensions

- Prettier - Code formatter
- Tailwind CSS IntelliSense

##### > Preferences: Open Settings (JSON)

```json
  ...
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[python]": {
    "editor.defaultFormatter": "ms-python.python"
  }
```
