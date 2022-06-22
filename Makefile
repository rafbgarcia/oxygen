export COMPOSE_PROJECT_NAME=nitro-web

up:
	docker-compose up -d db redis

up_web:
	docker-compose up web

stop:
	docker-compose stop db redis

start_server:
	honcho start -f Procfile

start_client:
	(cd oracle_web && yarn foreman)

graphql_schema:
	python manage.py graphql_schema --schema oracle.graphql.schema.schema --out oracle_web/src/graphql/schema.graphql --watch

install_deps:
	pip install --requirement requirements.txt

makemigrate:
	docker-compose run web python manage.py makemigrations

migrate: makemigrate
	docker-compose run web python manage.py migrate

# make test_watch dir=oracle/<folder>
test_watch:
	ag -l --python | entr python manage.py test --keepdb $(dir)
