FROM amd64/python:3.9.13-bullseye
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /pantab_server
COPY requirements.txt /pantab_server/
RUN pip install -r requirements.txt
