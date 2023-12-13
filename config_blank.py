# INF601 - Advanced Programming in Python
# Austin Gray
# Final Project

class Config(object):
    DEBUG = False
    TESTING = False

    SECRET_KEY = '5946749478468feb478ca979e6a1edd7a894b247ca29df2f'

    SESSION_COOKIE_SECURE = True

    DB_SERVER   = ''
    DB_NAME     = ''
    DB_USERNAME = ''
    DB_PASSWORD = ''


class ProductionConfig(Config):
    pass

class DevelopmentConfig(Config):
    DEBUG = True

class TestingConfig(Config):
    TESTING = True
