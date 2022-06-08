## TODO

- Each widget query its own render data
- Operations between fields
- unique field aliases
- Contribution
  - https://snippets.aktagon.com/snippets/741-calculating-percentage-of-total-for-each-row-with-postgres#:~:text=Calculating%20the%20%E2%80%9Cpercentage%20of%20the,returned%20by%20the%20where%20clause.

## MVP Roadmap:

- Operations between fields
- Filters
- Value as links to external pages
- Scheduled build
- Grand totals https://www.easytweaks.com/pandas-pivot-table-sum/
- Load one widget at a time
- Package manager?
- default_database_version=2
  - https://help.tableau.com/current/api/hyper_api/en-us/reference/sql/databasesettings.html#DEFAULT_DATABASE_VERSION

## Tech debt:

- Use Celery worker to build datasets
- https://react-hook-form.com/advanced-usage#SmartFormComponent
- Graphene --watch error causes foreman to exit
- SQL descriptor
- One query per column?
