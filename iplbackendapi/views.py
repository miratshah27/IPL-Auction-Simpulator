
from venv import create
from rest_framework.views import APIView
from .models import token
from django.db import connection
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication

class CsrfExemptSessionAuthentication(SessionAuthentication):

    def enforce_csrf(self, request):
        return  # To not perform the csrf check previously happening

playerChemistry = {'Virat Kohli':'Mohammed Siraj','MS Dhoni':'Ravindra Jadeja','KL Rahul':'Mayank Agarwal','Quinton de Kock':'Rohit Sharma','David Warner':'Shikhar Dhawan','Trent Boult':'Jasprit Bumrah','Deepak Chahar':'Shardul Thakur','Kagiso Rabada':'Anrich Nortje','Bhuvneshwar Kumar':'Rashid Khan','Pat Cummins':'Andre Russell'}

def query(q):
    with connection.cursor() as c:
        c.execute(q)
        if q[0:6].lower()=="select":
            return dictfetchall(c)
        else :
            return "success"

def dictfetchall(cursor):
    "Return all rows from a cursor as a dict"
    columns = [col[0] for col in cursor.description]
    return [
        dict(zip(columns, row))
        for row in cursor.fetchall()
    ]

class teamView(APIView):
    def get(self,request,pk,format=None):
        room = request.headers['token'][1]
        team = int(request.headers['token'])%531
        if pk=="players-bought":#get all players bought by a team
            result = query(f"select * from iplbackendapi_player where id in (select player_id from iplbackendapi_soldplayer where team_id='{team}' and room='{room}')")
            for player in result :
                player['price'] = query(f"select price from iplbackendapi_soldplayer where team_id='{team}' and room='{room}' and player_id='{player['id']}'")[0]['price']
            return Response(result)
        if pk=="details":#get team details by id
            result = query(f"select * from iplbackendapi_team where id='{team}' and room='{room}'")     
            return Response(result)       
        if pk=="statistics":
            result = query(f"select * from iplbackendapi_player where id in (select player_id from iplbackendapi_soldplayer where room='{room}' and team_id='{team}')")
            score = 0
            batCount = 0
            bowlCount = 0
            allCount = 0
            foreignCount = 0
            wkCount = 0
            uncappedCount = 0
            legCount = 0
            for player in result:
                score = score + player['overall']
                if player['type'] == "BAT":
                    batCount +=1
                if player['type'] == "BOW":
                    bowlCount +=1
                if player['type'] == "ALL":
                    allCount +=1
                if player['is_starred']:
                    score +=2 
                if player['foreign']:
                    foreignCount+=1    
                if player['is_wk']:
                    wkCount+=1       
                if player['is_uncapped']:
                    uncappedCount+=1       
                if player['color'] == "#808080":
                    legCount+=1       
                for player2 in result :
                        if playerChemistry.get(player['name'],None)==player2['name']:
                                score +=5    
            stats = {"bat":batCount,"bowl":bowlCount,"all":allCount,"legCount":legCount,"foreign":foreignCount,"wk":wkCount,"uncappedCount":uncappedCount,"total":batCount+bowlCount+allCount,"score":score}
            return Response(stats)

class playerView(APIView):
    def get(self,request,format=None): #get all unsold players in a team
        room = request.headers['token'][1]
        custom_query = f"select * from iplbackendapi_player where id not in (select player_id from iplbackendapi_soldplayer where room='{room}')"
        result = query(custom_query)
        return Response(result)

class searchPlayerView(APIView):
    def get(self,request,pk,format=None):
        return Response(query(f"select * from iplbackendapi_player where name like '%{pk}%'"))

class allTeamDataView(APIView):
    def get(self,request,pk,format=None):
        room = request.headers['token'][1]
        result = query(f"select * from iplbackendapi_team where name='{pk}' and room='{room}'")
        return Response(result)  

class allPlayerDataView(APIView):
    def get(self,request,pk,format=None):
        room = request.headers['token'][1]
        result = query(f"SELECT * FROM 'iplbackendapi_soldplayer' join 'iplbackendapi_player' where room='{room}' and iplbackendapi_soldPlayer.team_id=(select id from 'iplbackendapi_team' where name='{pk}' and room='{room}') and iplbackendapi_soldPlayer.player_id=iplbackendapi_player.id")
        return Response(result)  

class allTeamStats(APIView):
    def get(self,request,pk,format=None):
        room = request.headers['token'][1]    
        result = query(f"SELECT * FROM 'iplbackendapi_soldplayer' join 'iplbackendapi_player' where room='{room}' and iplbackendapi_soldPlayer.team_id=(select id from 'iplbackendapi_team' where name='{pk}' and room='{room}') and iplbackendapi_soldPlayer.player_id=iplbackendapi_player.id")
        score = 0
        batCount = 0
        bowlCount = 0
        allCount = 0
        foreignCount = 0
        wkCount = 0
        uncappedCount = 0
        legCount = 0
        for player in result:
            score = score + player['overall']
            if player['type'] == "BAT":
                batCount +=1
            if player['type'] == "BOW":
                bowlCount +=1
            if player['type'] == "ALL":
                allCount +=1
            if player['is_starred']:
                score +=2 
            if player['foreign']:
                foreignCount+=1    
            if player['is_wk']:
                wkCount+=1       
            if player['is_uncapped']:
                uncappedCount+=1       
            if player['color'] == "#808080":
                legCount+=1       
            for player2 in result :
                    if playerChemistry.get(player['name'],None)==player2['name']:
                            score +=5    
        stats = {"bat":batCount,"bowl":bowlCount,"all":allCount,"legCount":legCount,"foreign":foreignCount,"wk":wkCount,"uncappedCount":uncappedCount,"total":batCount+bowlCount+allCount,"score":score}
        return Response(stats)

class powercardView(APIView):
    def get(self,request,pk,format=None):
        room = request.headers['token'][1]
        if pk.isnumeric():
            q = f"select * from iplbackendapi_soldpowercard  join iplbackendapi_powercard where team_id = '{pk}' and room = '{room}' and iplbackendapi_powercard.id=iplbackendapi_soldpowercard.powercard_id"
        else:
            q = f"select * from iplbackendapi_soldpowercard join iplbackendapi_powercard where team_id=(select id from iplbackendapi_team where name='{pk}' and room='{room}') and room = '{room}' and iplbackendapi_powercard.id=iplbackendapi_soldpowercard.powercard_id"
        result = query(q)
        return Response(result)

class loginView(APIView):

    def post(self,request,format=None):
        data = request.data
        tk = token.objects.filter(token=data['token'])
        if tk :
            return Response("Success")
        else :
            return Response("Fail")      

class calculatorView(APIView):
    def get(self,req,pk,format=None):
        team = int(req.headers['token'])%531
        room = req.headers['token'][1]
        print(team)
        print(room)
        if pk=="batsman":
            result = query(f"SELECT * FROM 'iplbackendapi_player' where (type='BAT' or type='ALL') and id in (select player_id from iplbackendapi_soldplayer where room='{room}' and team_id='{team}')")
        if pk=="bowler":
            result = query(f"SELECT * FROM 'iplbackendapi_player' where (type='BOW' or type='ALL') and id in (select player_id from iplbackendapi_soldplayer where room='{room}' and team_id='{team}')")
        for player in result:
            player['PPL']=player['MO']=player['DEATH']=False
            player['count'] = 0
        return Response(result)

    def post(self,req,pk,format=None):
        team_id = int(req.headers['token'])%531
        rm = req.headers['token'][1]
        data = req.data
        query(f"update iplbackendapi_team set score='{data.get('score',None)}' where id='{team_id}' and room={rm}")
        return Response("Success")

class leaderboardView(APIView):
    def get(self,req,format=None):
        room = req.headers['token'][1]
        result = query(f"select name,score from iplbackendapi_team where room='{room}' order by score desc")
        return Response(result)



