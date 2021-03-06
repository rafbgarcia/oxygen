up:
	docker-compose up -d db redis pantab_server

stop:
	docker-compose stop db redis pantab_server

server:
	python -m honcho start

graphql_schema:
	python manage.py graphql_schema --schema oxygen.graphql.schema.schema --out oxygen_web/src/graphql/schema.graphql --watch

makemigrate:
	python manage.py makemigrations

migrate:
	python manage.py migrate

mmigrate: makemigrate migrate

# make test_watch dir=oxygen/<folder>
test_watch:
	ag -l --python | entr python manage.py test --keepdb $(dir)

venv:
	python -m venv .venv

install_deps:
	pip install -r requirements.txt
