from flask import Flask
from mongoengine import connect
from flask_cors import CORS

import highlights_server.config

# Flask config
#
app = Flask(__name__)
CORS(app, support_credentials=True)

db_highlights = connect(alias='db_highlights', host=config.HIGHLIGHTS_DB_URI)
db_players = connect(alias='db_players', host=config.PLAYERS_DB_URI)
db_teams = connect(alias='db_teams', host=config.TEAMS_DB_URI)

# must import after declaration of app
# TO-DO: avoid circular dependency (look into Blueprint)
# 
import highlights_server.routes
