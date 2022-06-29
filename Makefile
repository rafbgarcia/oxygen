export COMPOSE_PROJECT_NAME=nitro-web

up:
	docker-compose up -d db redis pantab_server

stop:
	docker-compose stop db redis

server:
	python -m honcho start

graphql_schema:
	python manage.py graphql_schema --schema oracle.graphql.schema.schema --out oracle_web/src/graphql/schema.graphql --watch

makemigrate:
	python manage.py makemigrations

migrate:
	python manage.py migrate

mmigrate: makemigrate migrate


# make test_watch dir=oracle/<folder>
test_watch:
	ag -l --python | entr python manage.py test --keepdb $(dir)
