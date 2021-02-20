from mongoengine import *
from highlights_server import db_teams


class Team(Document):
    tid = StringField()
    code = StringField()
    city = StringField()
    name = StringField()
    display_name = StringField()
    division = StringField()
    conference = StringField()
    color = StringField()
    
    def to_json(self):
        return {
            'tid': self.tid,
            'code': self.code,
            'city': self.city,
            'name': self.name, 
            'display_name': self.display_name,
            'division': self.division,
            'conference': self.conference,
            'color': self.color,
        }

    meta = {'db_alias': 'db_teams'}
