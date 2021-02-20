from mongoengine import *
from highlights_server import db_players


class Player(Document):
    pid = StringField()
    first_name = StringField()
    last_name = StringField()
    display_name = StringField()
    tid = StringField()
    position = StringField()
    height = StringField()
    weight = StringField()
    highlight_count = IntField()
    
    def to_json(self):
        return {
            'pid': self.pid,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'display_name': self.display_name, 
            'tid': self.tid,
            'position': self.position,
            'height': self.height,
            'weight': self.weight,
            'highlight_count': str(self.highlight_count)
        }

    meta = {'db_alias': 'db_players'}
