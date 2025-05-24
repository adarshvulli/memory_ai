from neo4j import GraphDatabase

_driver = GraphDatabase.driver("bolt://localhost:7687", auth=("neo4j", "neo4j1234"))

def get_driver():
    return _driver

def create_user_if_not_exists(user_name: str):
    with _driver.session() as session:
        session.run("MERGE (:User {name: $name})", name=user_name)