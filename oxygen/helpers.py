import humps


def snakecase(val):
    return humps.decamelize(humps.camelize(val))


def debug(arg):
    print("-------------------")
    print(arg)
    print("-------------------")
