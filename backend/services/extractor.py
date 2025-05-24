from openai import OpenAI
import os
import json
import time

import dotenv

dotenv.load_dotenv()  

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

KG_PAIR_EXTRACTION_PROMPT = """
You are an AI that extracts structured personalization data from a chatbot interaction.

For each (assistant_message, user_followup) pair, identify:
- topic: general subject of the conversation (LangGraph, APIs, LLMs, etc.)
- interests: tools, ideas, or concepts the user is curious or excited about
- skills: any technologies or tools the user appears familiar with
- personality_traits: how the user prefers information (e.g., concise, visual, step-by-step)
- feedback_sentiment: user’s response tone toward the assistant message ("positive", "neutral", "negative", "none")

Format your response in strict JSON like this:
{{
  "topic": "...",
  "interests": [...],
  "skills": [...],
  "personality_traits": [...],
  "feedback_sentiment": "..."
}}

Assistant: "{assistant_msg}"

User: "{user_msg}"
"""

def extract_kg_pair_metadata(assistant_msg: str, user_msg: str, model="gpt-3.5-turbo", retries=3, delay=2) -> dict:
    prompt = KG_PAIR_EXTRACTION_PROMPT.format(
        assistant_msg=assistant_msg.strip(),
        user_msg=user_msg.strip()
    )

    for attempt in range(retries):
        try:
            response = client.chat.completions.create(
                model=model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.3
            )
            result = response.choices[0].message.content.strip()
            parsed = json.loads(result)
            return parsed

        except json.JSONDecodeError:
            print(f"[Retry {attempt+1}] Failed to parse JSON:\n{result}")
        except Exception as e:
            print(f"[Retry {attempt+1}] OpenAI API error: {e}")
        time.sleep(delay)

    print("Failed after all retries.")
    return {
        "topic": "unknown",
        "interests": [],
        "skills": [],
        "personality_traits": [],
        "feedback_sentiment": "none"
    }