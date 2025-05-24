from neo4j_client import get_driver

# Label and relationship mapping based on field
FIELD_MAP = {
    "interest": {"label": "Interest", "rel": "HAS_INTEREST"},
    "skill": {"label": "Skill", "rel": "HAS_SKILL"},
    "topic": {"label": "Topic", "rel": "MENTIONED_TOPIC"},
    "personality_trait": {"label": "Personality", "rel": "HAS_PERSONALITY_TRAIT"}
}

def add_kg_item(user_name: str, field: str, value: str):
    field_data = FIELD_MAP[field]
    with get_driver().session() as session:
        session.run(f"""
            MERGE (u:User {{name: $user_name}})
            MERGE (n:{field_data['label']} {{name: $value}})
            MERGE (u)-[:{field_data['rel']}]->(n)
        """, user_name=user_name, value=value)
    return {"status": "added", "field": field, "value": value}


def update_kg_item(user_name: str, field: str, old_value: str, new_value: str):
    field_data = FIELD_MAP[field]
    with get_driver().session() as session:
        session.run(f"""
            MATCH (u:User {{name: $user_name}})-[r:{field_data['rel']}]->(n:{field_data['label']} {{name: $old_value}})
            SET n.name = $new_value
        """, user_name=user_name, old_value=old_value, new_value=new_value)
    return {"status": "updated", "field": field, "old_value": old_value, "new_value": new_value}


def delete_kg_item(user_name: str, field: str, value: str):
    field_data = FIELD_MAP[field]
    with get_driver().session() as session:
        session.run(f"""
            MATCH (u:User {{name: $user_name}})-[r:{field_data['rel']}]->(n:{field_data['label']} {{name: $value}})
            DELETE r
        """, user_name=user_name, value=value)
    return {"status": "deleted", "field": field, "value": value}


def view_kg(user_name: str):
    with get_driver().session() as session:
        result = session.run("""
            MATCH (u:User {name: $user_name})
            OPTIONAL MATCH (u)-[:HAS_INTEREST]->(i:Interest)
            OPTIONAL MATCH (u)-[:HAS_SKILL]->(s:Skill)
            OPTIONAL MATCH (u)-[:HAS_PERSONALITY_TRAIT]->(p:Personality)
            OPTIONAL MATCH (u)-[:MENTIONED_TOPIC]->(t:Topic)
            RETURN
              COLLECT(DISTINCT i.name) AS interests,
              COLLECT(DISTINCT s.name) AS skills,
              COLLECT(DISTINCT p.name) AS personality_traits,
              COLLECT(DISTINCT t.name) AS topics
        """, user_name=user_name)
        return result.single().data()
