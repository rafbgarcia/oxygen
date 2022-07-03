from celery import Celery

app = Celery("oxygen", broker="amqp://", backend="rpc://", include=["oxygen.tasks"])

# Optional configuration, see the application user guide.
app.conf.update(
    result_expires=3600,
)

# Redis config
app.conf.broker_url = "redis://localhost:6380/0"
app.conf.result_backend_transport_options = {"retry_policy": {"timeout": 300.0}}


if __name__ == "__main__":
    app.start()
