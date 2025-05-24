from openai import OpenAI
from services.prompt_composer import compose_prompt
import os
import dotenv

dotenv.load_dotenv()

client =  OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def generate_llm_response(session_id: str, user_input: str, user_name: str):
    messages = compose_prompt(session_id, user_input, user_name)
    print(f"Generated messages for session {session_id}: {messages}")

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=messages,
        temperature=0.7
    )

    reply = response.choices[0].message.content.strip()
    from memory.session import session_memory
    session_memory.add_message(session_id, "assistant", reply)
    return reply
 