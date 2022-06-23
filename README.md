### Start up

# Dev environment

### Some history

I started developing this project on an Intel chip. When I got the m1 Macbook I learned that Tableau Hyper API is not compatible with ARM architecture.

I tried:

- Running the whole project in a docker container. That slowed down Python's code reloading by a lot. It was a bad dev experience.
- Then I tried to keep two versions of homebrew installed, but I thought that would not be a good experience in the long term.
- Finally, I went with the approach to create a small server for the Tableau API to be used in development only.

### Get started

For now, I'm using Nitro's DB and Redis containers, hence this setup assumes you have ran Nitro's set up.

- `asdf install`
- `python -m venv .venv`
- `source .venv/bin/activate`
- `pip install -r requirements.txt`
- `(cd oracle_web && yarn install)`
- `make up`
- `make migrate` (need to manually create database in the MySQL server)

Tab 1:

- `make start_server`
  - http://localhost:8000 (also gives you GraphiQL)

Tab 2:

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
