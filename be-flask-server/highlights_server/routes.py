from flask.globals import request
from highlights_server import app
from highlights_server.services import highlights_service, players_service

# HEALTH
#

@app.route('/health', methods=['GET'])
def get_health():
    return 'Server is healthy!'


# HIGHLIGHTS
#

# temporary way to populate database
@app.route('/highlights', methods=['PUT'])
def fetch_highlights():
    return highlights_service.fetch_highlights_reddit()


@app.route('/highlights/<int:page>/', methods=['GET'])
def get_highlights(page):
    page = page or 1
    return highlights_service.get_highlights(page)


# PLAYERS
#

# temporary way to populate database
@app.route('/players', methods=['PUT'])
def fetch_players():
    return players_service.fetch_players_nba()


@app.route('/players/condensed', methods=['GET'])
def get_players_condensed():
    return players_service.get_players_condensed()


@app.route('/players/<pid>/<int:page>', methods=['GET'])
def get_player_highlights(pid, page):
    page = page or 1
    return highlights_service.get_player_highlights(pid, page)


# TEAMS
#

@app.route('/teams/<tid>/<int:page>', methods=['GET'])
def get_team_highlights(tid, page):
    page = page or 1
    return highlights_service.get_team_highlights(tid, page)

