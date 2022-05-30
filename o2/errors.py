class ValueNotSupported(Exception):
    def __init__(self, type, value):
        self.type = type
        self.value = value

    def __str__(self):
        return f"{self.type} {self.value}"
