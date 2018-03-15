# -*- coding: utf-8 -*-
from app import db


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer(), primary_key=True, nullable=False)
    username = db.Column(db.String(255), unique=True, nullable=False)
    passwd = db.Column(db.String(255), unique=True, nullable=False)
    active = db.Column(db.Boolean(), nullable=False, default=0)

    def __init__(self, username, passwd):
        self.username = username
        self.passwd = passwd
        self.active = 0

    def is_active(self):
        if int(self.active) == 1:
            return True
        else:
            return False

    def get_id(self):
        return unicode(self.id)

    def is_authenticated(self):
        return True

    def is_anonymous(self):
        return False
