### Commands

- `$ bin/migrate` uses foreman to:
  - Starts Django server at port 8000
  - Runs `Graphene` command to watch Python file changes to generate a `schema.graphql` file
  - Runs `Codegen` command to watch `.graphql` file changes to generate Typescript types and Apollo hooks
- `$ bin/migrate`
  - Derives changes from models
  - Run migrations
- `$ bin/install_deps` takes a while...
