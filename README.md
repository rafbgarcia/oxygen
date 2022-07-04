Oxygen's aim is to be an open-source data analytics tool companies can host and use internally.

## Demo

Demo video:

https://user-images.githubusercontent.com/1904314/177021192-a26b6392-a04b-4ec2-9e94-85790e7890ca.mp4

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
