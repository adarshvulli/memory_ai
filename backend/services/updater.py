from services.extractor import extract_kg_pair_metadata
from neo4j_client import get_driver

def update_kg(user_name: str, assistant_msg: str, user_msg: str):
    # Step 1: Extract structured metadata from message pair
    metadata = extract_kg_pair_metadata(assistant_msg, user_msg)

    # Step 2: Update Neo4j with extracted knowledge
    with get_driver().session() as session:
        query = """
        MERGE (u:User {name: $user_name})

        FOREACH (i IN $interests |
            MERGE (interest:Interest {name: i})
            MERGE (u)-[:HAS_INTEREST]->(interest)
        )

        FOREACH (s IN $skills |
            MERGE (skill:Skill {name: s})
            MERGE (u)-[:HAS_SKILL]->(skill)
        )

        FOREACH (t IN CASE WHEN $topic <> 'unknown' THEN [1] ELSE [] END |
            MERGE (topic:Topic {name: $topic})
            MERGE (u)-[:MENTIONED_TOPIC]->(topic)
        )

        FOREACH (p IN $traits |
            MERGE (trait:Personality {name: p})
            MERGE (u)-[:HAS_PERSONALITY_TRAIT]->(trait)
        )
        """
        session.run(
            query,
            user_name=user_name,
            interests=metadata.get("interests", []),
            skills=metadata.get("skills", []),
            topic=metadata.get("topic", "unknown"),
            traits=metadata.get("personality_traits", [])
        )

    return metadata
