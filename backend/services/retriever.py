from neo4j_client import get_driver
from services.extractor_metadata import extract_metadata_from_query

def query_user_knowledge(user_name: str, user_query: str):

    metadata = extract_metadata_from_query(user_query)

    topic = metadata.get("topic", "unknown")
    use_kg = metadata.get("use_KG", False)

    if not use_kg:
        print("Skipping KG query: use_KG is False.")
        return {}

    with get_driver().session() as session:
        if topic and topic.lower() != "unknown":
            cypher = """
            MATCH (u:User {name: $name})
            OPTIONAL MATCH (u)-[:MENTIONED_TOPIC]->(t:Topic)
            WHERE t.name CONTAINS $topic
            WITH u, COLLECT(DISTINCT t.name) AS matched_topics
            OPTIONAL MATCH (u)-[:HAS_INTEREST]->(i:Interest)
            OPTIONAL MATCH (u)-[:HAS_SKILL]->(s:Skill)
            OPTIONAL MATCH (u)-[:HAS_PERSONALITY_TRAIT]->(p:Personality)
            RETURN
                matched_topics,
                COLLECT(DISTINCT i.name) AS interests,
                COLLECT(DISTINCT s.name) AS skills,
                COLLECT(DISTINCT p.name) AS personality_traits
            """
            result = session.run(cypher, name=user_name, topic=topic)
        else:
            cypher = """
            MATCH (u:User {name: $name})
            OPTIONAL MATCH (u)-[:HAS_INTEREST]->(i:Interest)
            OPTIONAL MATCH (u)-[:HAS_SKILL]->(s:Skill)
            OPTIONAL MATCH (u)-[:HAS_PERSONALITY_TRAIT]->(p:Personality)
            OPTIONAL MATCH (u)-[:MENTIONED_TOPIC]->(t:Topic)
            RETURN
                COLLECT(DISTINCT i.name) AS interests,
                COLLECT(DISTINCT s.name) AS skills,
                COLLECT(DISTINCT p.name) AS personality_traits,
                COLLECT(DISTINCT t.name) AS topics
            """
            result = session.run(cypher, name=user_name)

        record = result.single()
        return dict(record) if record else {}
