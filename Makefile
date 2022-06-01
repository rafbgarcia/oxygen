export COMPOSE_PROJECT_NAME=nitro-web

up:
	docker-compose up -d db redis

stop:
	docker-compose stop db redis

start:
	honcho start

graphql_schema:
	python manage.py graphql_schema --schema o2.schema.schema --out o2_web/src/graphql/schema.graphql --watch

install_deps:
	pip install --requirement requirements.txt

migrate:
	python manage.py makemigrations && python manage.py migrate

# make test_watch dir=o2/<folder>
test_watch:
	ag -l --python | entr python manage.py test $(dir)
