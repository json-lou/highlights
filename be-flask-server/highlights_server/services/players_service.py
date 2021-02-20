from flask import request, jsonify
import requests
import re

from highlights_server import constants
from highlights_server.models.player import Player


# PUT: FETCH_PLAYERS_NBA()
#

def fetch_players_nba():
    r = requests.get('https://ca.global.nba.com/stats2/league/playerlist.json?locale=en')
    r = r.json()
    players = r['payload']['players']
    res = parse_nba_response(players)
    return res

def parse_nba_response(players):
    res = []
    for player in players:
        player = Player(
            pid=player['playerProfile']['playerId'],
            first_name=player['playerProfile']['firstName'],
            last_name=player['playerProfile']['lastName'],
            display_name=player['playerProfile']['displayName'],
            tid=player['teamProfile']['id'],
            position=player['playerProfile']['position'],
            height=player['playerProfile']['height'],
            weight=player['playerProfile']['weight'],
            highlight_count=0
        )
        player.save()
        res.append(player.to_json())
    return jsonify(res)


# GET: GET_PLAYERS_CONDENSED()
#

def get_players_condensed():
    res = []
    players = Player.objects()
    for player in players:
        res.append({
            'pid': player['pid'],
            'first_name': player['first_name'],
            'last_name': player['last_name'],
            'display_name': player['display_name'],
            'tid': player['tid']
        })
    constants.PLAYERS_CONDENSED = res
    return jsonify(res)


# ML
#

def extract_player_id(title):
    # fetch list of players if not cached
    if not constants.PLAYERS_CONDENSED:
        get_players_condensed()
    
    # use regex to extract names
    names = re.findall('([A-Z][a-zA-Z]+)', title)
    full_names = re.findall('([A-Z][a-zA-Z]+ [A-Z][a-zA-Z]+)', title)

    # find associated players
    player_matches = []
    for name in full_names + names:
        match = is_player_match(name)
        if match:
            player_matches.append(match)

    # sort player results
    if not player_matches:
        return ([], [])
    else:
        player_matches = sorted(player_matches, key=lambda x: -x['rating'])
        # player_matches = list(set(player_matches))

    # pick best matches
    # temporarily just pick first 2 results
    res = []
    for index, player_res in enumerate(player_matches):
        if index > 1:
            break
        res.append(player_res)

    # prep return values
    pid_res = [x['pid'] for x in res]
    tid_res = [x['tid'] for x in res]
    return (pid_res, tid_res)


def is_player_match(name):
    res = {}
    matches = 0

    for player in constants.PLAYERS_CONDENSED:
        if player['display_name'] == name or (player['first_name'] in name and player['last_name'] in name):
            matches += 1
            res = {'pid': player['pid'], 'display_name': player['display_name'], 'tid': player['tid'], 'rating': 3}
        elif player['last_name'] == name:
            matches += 1
            res = {'pid': player['pid'], 'display_name': player['display_name'], 'tid': player['tid'], 'rating': 2}
        elif player['first_name'] == name:
            matches += 1
            res = {'pid': player['pid'], 'display_name': player['display_name'], 'tid': player['tid'], 'rating': 2}

    if matches == 1:
        return res
    else:
        return None
