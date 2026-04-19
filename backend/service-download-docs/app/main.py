from fastapi import FastAPI, Depends
from cassandra.cluster import Cluster
from cassandra.query import dict_factory
from .security import get_current_user

app = FastAPI()

cluster = Cluster(['cassandra'])
session = cluster.connect('ent_space')
session.row_factory = dict_factory 

@app.get("/courses")
def list_courses(username: str = Depends(get_current_user)):
    # Récupération depuis Cassandra
    rows = session.execute("SELECT * FROM courses")
    return {"user": username, "courses": list(rows)}