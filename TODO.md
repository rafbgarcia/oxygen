## TODO

- Each widget query its own render data
- Unique field aliases

## MVP Roadmap:

- Filters
- Pivot table Pagination
- Field Mask
- Value as links to external pages
- Scheduled build
- Package manager?
- default_database_version=2
  - https://help.tableau.com/current/api/hyper_api/en-us/reference/sql/databasesettings.html#DEFAULT_DATABASE_VERSION

## Tech debt:

- Use Celery worker to build datasets
- https://react-hook-form.com/advanced-usage#SmartFormComponent
- Graphene --watch error causes foreman to exit
- SQL descriptor
- One query per column?
