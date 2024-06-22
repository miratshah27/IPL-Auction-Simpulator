from django.db import models
from django.core.validators import MinValueValidator
from django.db import connection


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

PLAYER_TYPE = (
    ('ALL', 'ALL'),
    ('BAT', 'BAT'),
    ('BOW', 'BOW'),
)

class player(models.Model):

    name = models.CharField(max_length=20)
    image = models.ImageField(upload_to='player-images')
    type = models.CharField(max_length=5, choices=PLAYER_TYPE,default="ALL")
    is_wk = models.BooleanField(default=False)
    is_uncapped = models.BooleanField(default=False)
    is_starred = models.BooleanField(default=False)
    foreign = models.BooleanField(default=False)
    overall = models.IntegerField(default=0)
    bat_ppl = models.IntegerField(default=0)
    bow_ppl = models.IntegerField(default=0)
    bat_mid = models.IntegerField(default=0)
    bow_mid = models.IntegerField(default=0)
    bat_death = models.IntegerField(default=0)
    bow_death = models.IntegerField(default=0)
    color = models.CharField(max_length=50,default="red",null=True,blank=True)
    retainedBy = models.CharField(max_length=4,default="RCB")

    def __str__(self):
        return self.name


class team(models.Model):

    name = models.CharField(max_length=20,default="RCB")
    room = models.IntegerField()
    score = models.IntegerField(default=0,null=True)
    budget = models.FloatField(default=100.00,validators = [MinValueValidator(0.0)])
    
    def __str__(self):
        return str(self.name) + " Room : " + str(self.room)
    
    def save(self, *args, **kwargs):
        self.budget = round(self.budget, 2)
        super(team, self).save(*args, **kwargs)


class soldPlayer(models.Model):
    player = models.ForeignKey(player,on_delete=models.CASCADE)
    room = models.IntegerField()
    team = models.ForeignKey(team,on_delete=models.CASCADE)
    price = models.FloatField(default=0)

    def __str__(self):
        return str(self.player)+" "+str(self.team)

    def save(self, *args, **kwargs):
        previousPrice = query(f"select price from iplbackendapi_soldplayer where room='{self.room}' and player_id=(select id from iplbackendapi_player where name='{self.player}')")
        buying_team = team.objects.get(room=self.room,name=(str(self.team).split(" ")[0])) 
        if len(previousPrice) != 0 :
            buying_team.budget += round(previousPrice[0]['price'],2)
        buying_team.budget -= round(self.price,2)
        if(buying_team.budget<0):
            raise Exception("Budget cannot be negative")
        else :     
            self.price = round(self.price,2)
            buying_team.save()
            super().save(*args, **kwargs)   

    def delete(self, *args, **kwargs):
        buying_team = team.objects.get(room=self.room,name=(str(self.team).split(" ")[0])) 
        buying_team.budget += round(self.price,2)
        if(buying_team.budget>100):
            raise Exception("Budget cannot be greater than 100")
        else :  
            self.price = round(self.price,2)
            buying_team.save()
            super().delete(*args, **kwargs)      


class powercard(models.Model):
    name = models.CharField(max_length=20)
    image = models.ImageField(upload_to='powercards')

    def __str__(self):
        return str(self.name)

class soldPowerCard(models.Model):
    powercard = models.ForeignKey(powercard,on_delete=models.CASCADE,default=None)
    used = models.BooleanField(default=False)
    room = models.IntegerField()
    team = models.ForeignKey(team,on_delete=models.CASCADE)
    price = models.FloatField(default=0)

    def __str__(self):
        return str(self.powercard)+ "  -  "+ str(self.team) 

    def save(self, *args, **kwargs):
        previousPrice = query(f"select price from iplbackendapi_soldpowercard where room='{self.room}' and powercard_id=(select id from iplbackendapi_powercard where name='{self.powercard}')")
        buying_team = team.objects.get(room=self.room,name=(str(self.team).split(" ")[0])) 
        if len(previousPrice) != 0 :
            buying_team.budget += round(previousPrice[0]['price'],2)
        buying_team.budget -= round(self.price,2)
        if(buying_team.budget<0):
            raise Exception("Budget cannot be negative")
        else :     
            self.price = round(self.price,2)
            buying_team.save()
            super().save(*args, **kwargs)   

    def delete(self, *args, **kwargs):
        buying_team = team.objects.get(room=self.room,name=(str(self.team).split(" ")[0])) 
        buying_team.budget += round(self.price,2)
        if(buying_team.budget>100):
            raise Exception("Budget cannot be greater than 100")
        else :  
            self.price = round(self.price,2)
            buying_team.save()
            super().delete(*args, **kwargs)         


class token(models.Model):
    token = models.CharField(max_length=20)    

    def __str__(self):
            team_name = query(f"select name from iplbackendapi_team where id='{int(self.token)%531}'")
            return str(team_name[0]['name'])+ " "+ " Room: "+str(self.token[1])