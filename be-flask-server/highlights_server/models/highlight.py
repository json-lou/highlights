from mongoengine import *
from highlights_server import db_highlights


class Highlight(Document):
    vid = StringField()
    date = DateTimeField()
    title = StringField()
    url = StringField()
    pid = ListField()
    tid = ListField()
    highlight_type = ListField()
    rating = DecimalField()
    flags = IntField()
    
    def to_json(self):
        return {
            'vid': self.vid,
            'date': self.date,
            'title': self.title,
            'url': self.url,
            'pid': self.pid,
            'tid': self.tid,
            'highlight_type': self.highlight_type,
            'rating': str(self.rating),
            'flags': str(self.flags)
        }

    meta = {'db_alias': 'db_highlights'}
