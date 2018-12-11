import redis
from app import *

class Redisd(object):
    def __init__(self):
        self.RedisConnect = redis.Redis(host=app.config['REDIS_ADDR'], port=app.config['REDIS_PROT'], db=app.config['REDIS_DB'],password=app.config['REDIS_PASSWD'])

    def Set(self,Key,Value,Ex=None):
        return self.RedisConnect.set(Key,Value,ex=Ex)

    def Get(self,Key):
        return  self.RedisConnect.get(Key)

    def Exists(self,Key):
        return self.RedisConnect.exists(Key)

    def Expire(self,Key,Ex):
        return self.RedisConnect.expire(Key,Ex)