from flask import request, jsonify
from datetime import datetime
import requests

from highlights_server.models.highlight import Highlight
from highlights_server.models.player import Player
from highlights_server.models.team import Team
from highlights_server.services import players_service


# PUT: FETCH_HIGHLIGHTS_REDDIT()
#

def fetch_highlights_reddit():
    r = requests.get('https://www.reddit.com/search.json?q=subreddit:NBA+flair:highlight+site:streamable.com&limit=100&sort=new', headers = {'user-agent': 'test'})
    r = r.json()
    posts = r['data']['children']
    res = parse_reddit_response(posts)
    return res

def parse_reddit_response(posts):
    res = []
    for post in posts:
        if post['data']['title'].startswith('[Highlight] '):
            vid = post['data']['name']
            title = post['data']['title'][12:]
            url = post['data']['url_overridden_by_dest']
            rating = post['data']['upvote_ratio']
            player, team = players_service.extract_player_id(title)
            highlight_type = extract_highlight_type(title)

            highlight = Highlight(
                vid=vid,
                date=datetime.today(),
                title=title,
                url=url,
                pid=player,
                tid=team,
                highlight_type=highlight_type,
                rating=rating,
                flags=0
            )

            vid_exists = Highlight.objects(vid=vid).update_one(set__rating=rating)

            if not vid_exists:
                highlight.save()
                Player.objects(pid__in=player).update(inc__highlight_count=1)
                res.append(highlight.to_json())

    return jsonify(res)


# GET: GET_HIGHLIGHTS()
#

def get_highlights(page):
    start = (int(page) - 1) * 12
    highlights = Highlight.objects.order_by('-date')[start:start+12]
    highlights = [ highlight.to_json() for highlight in highlights ]
    res = {
        'highlights': highlights
    }
    return jsonify(res)


# GET: GET_PLAYER_HIGHLIGHTS()
#

def get_player_highlights(pid, page):
    start = (int(page) - 1) * 12

    player = Player.objects(pid=pid).as_pymongo()[0]
    if not player:
        return 'Player fail!'
    team = Team.objects(tid=player['tid']).as_pymongo()[0]
    if not team:
        return 'Team fail!'
    highlights = list(Highlight.objects(pid__contains=pid).order_by('-date'))
    highlights = [ highlight.to_json() for highlight in highlights ]

    res = {
        'player': {
            'pid': player['pid'],
            'name': player['display_name'],
            'tid': player['tid'],
            'position': player['position'],
            'height': player['height'],
            'weight': player['weight']
        },
        'team': {
            'tid': team['tid'],
            'name': team['display_name'],
            'conference': team['conference'],
            'color': team['color']
        },
        'highlights': highlights
    }

    return jsonify(res)


# GET: GET_TEAM_HIGHLIGHTS()
#

def get_team_highlights(tid, page):
    start = (int(page) - 1) * 12

    team = Team.objects(tid=tid).as_pymongo()[0]
    if not team:
        return 'Team fail!'
    players = Player.objects(tid=tid, highlight_count__gt=0).order_by('-highlight_count')
    # players = Player.objects(tid=tid).order_by('-highlight_count')
    players = [ player.to_json() for player in players ]
    players = [ { 'pid': player['pid'], 'name': player['display_name'] } for player in players ]
    highlights = list(Highlight.objects(tid__contains=tid).order_by('-date'))
    highlights = [ highlight.to_json() for highlight in highlights ]

    res = {
        'team': {
            'tid': team['tid'],
            'name': team['display_name'],
            'conference': team['conference'],
            'color': team['color']
        },
        'players': players,
        'highlights': highlights
    }

    return jsonify(res)



# ML
#

# TO-DO
def extract_highlight_type(title):
    return []
