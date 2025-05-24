from openai import OpenAI
import os
import time
import json
import dotenv

dotenv.load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

INTENT_EXTRACTION_PROMPT = """
You are an intelligent assistant that extracts structured metadata from a user's query in a chat application.

Your goal is to analyze the query and return:
- intent: the purpose of the query (e.g., ask_question, request_recommendation, coding_question, give_feedback, trivia_question, irrelevant, unclear)
- topic: general subject of the query (e.g., LangGraph, Python, security). If unclear, return "unknown".
- entities: list of proper nouns, tools, brands, places, people, or specific concepts explicitly mentioned in the query.
- interests: concepts, topics, activities, or subjects the user appears interested in learning more about or exploring further.
- skills: technologies, tools, activities, or areas of knowledge the user appears to already be using, experienced with, or knowledgeable about.
- personality_traits: anything the query implies about how the user prefers to communicate or learn (e.g., "prefers examples", "likes step-by-step explanations", "values brevity", "enjoys detailed discussions").
- use_KG: true if the query is personal or could benefit from user-specific memory (e.g., preferences, past projects), false otherwise.

Always respond in strict JSON format like this:
{{
  "intent": "...",
  "topic": "...",
  "entities": [...],
  "interests": [...],
  "skills": [...],
  "personality_traits": [...],
  "use_KG": true
}}

Query: "{query}"
"""

def extract_metadata_from_query(query, model="gpt-3.5-turbo", max_retries=3, delay=2):
    prompt = INTENT_EXTRACTION_PROMPT.format(query=query)

    for attempt in range(max_retries):
        try:
            response = client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "user", "content": prompt}
                ],
            )
            result = response.choices[0].message.content.strip()
            print("Debugging:",result)
            parsed = json.loads(result)
            return parsed

        except (json.JSONDecodeError, KeyError) as e:
            print(f"[Retry {attempt+1}] JSON parsing error: {e}")
        except Exception as e:
            print(f"[Retry {attempt+1}] OpenAI API error: {e}")
        time.sleep(delay)

    print("Failed to extract metadata after retries.")
    return {
        "intent": "unclear",
        "topic": "unknown",
        "entities": [],
        "interests": [],
        "skills": [],
        "personality_traits": [],
        "use_KG": False
    }
