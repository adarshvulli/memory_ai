from typing import List, Dict
from memory.session import SessionMemoryManager
from services.retriever import query_user_knowledge
from services.prompt_utils import summarize_kg_context, create_followup_question
from services.extractor_metadata import extract_metadata_from_query

# Use the shared session memory instance
session_memory = SessionMemoryManager()

def compose_prompt(session_id: str, user_query: str, user_name: str) -> List[Dict[str, str]]:
    """
    Compose a sophisticated prompt that prevents hallucination and provides 
    contextually appropriate responses with follow-up questions.
    """
    
    # 1. Extract enhanced metadata from the current query
    metadata = extract_metadata_from_query(user_query)
    
    # 2. Retrieve relevant context from the knowledge graph based on metadata
    kg_context = {}
    if metadata.get("use_KG", True):
        kg_context = query_user_knowledge(user_name, user_query)
    
    # 3. Create sophisticated system prompt that prevents hallucination
    system_prompt = summarize_kg_context(kg_context, metadata)
    
    # 4. Retrieve session memory messages
    session_history = session_memory.get_context(session_id)
    
    # 5. Add current query to session memory
    session_memory.add_message(session_id, "user", user_query)
    
    # 6. Build final message list with enhanced instructions
    messages = [{"role": "system", "content": system_prompt}]
    
    # Add context about the current query analysis
    query_analysis = f"""
CURRENT QUERY ANALYSIS:
- Intent: {metadata.get('intent', 'general_conversation')}
- Topic: {metadata.get('topic', 'general')}
- Confidence: {metadata.get('confidence_level', 'medium')}
- Response style requested: {metadata.get('response_style', 'conversational')}
- Requires follow-up: {metadata.get('requires_followup', False)}

Remember to:
1. Only use information from the user context provided above
2. Adapt your response to the requested style
3. If insufficient context, ask for clarification
4. End with a knowledge graph enhancement question
"""
    
    messages.append({"role": "system", "content": query_analysis})
    
    # Add session history
    messages += session_history
    
    # Add the current user query
    messages.append({"role": "user", "content": user_query})
    
    return messages

def compose_followup_prompt(session_id: str, user_query: str, user_name: str, 
                           assistant_response: str) -> str:
    """
    Generate a follow-up question to enhance the knowledge graph based on 
    the conversation context.
    """
    
    # Extract metadata from the query
    metadata = extract_metadata_from_query(user_query)
    
    # Get current user context
    kg_context = query_user_knowledge(user_name, user_query)
    
    # Generate intelligent follow-up question
    followup = create_followup_question(
        intent=metadata.get('intent', 'general_conversation'),
        topic=metadata.get('topic', 'general'),
        user_context=kg_context
    )
    
    return followup

def validate_response_against_context(response: str, kg_context: dict, 
                                    user_query: str) -> Dict[str, any]:
    """
    Validate that the response doesn't hallucinate information not in the context.
    Returns validation results and suggested improvements.
    """
    
    validation_results = {
        "uses_only_context": True,
        "asks_for_clarification": False,
        "includes_followup": False,
        "warnings": []
    }
    
    # Check if response mentions specific user details not in context
    context_entities = set()
    if kg_context:
        context_entities.update(kg_context.get('interests', []))
        context_entities.update(kg_context.get('skills', []))
        context_entities.update(kg_context.get('personality_traits', []))
    
    # Simple heuristic checks (can be enhanced with NLP)
    response_lower = response.lower()
    
    # Check for assumption phrases that might indicate hallucination
    assumption_phrases = [
        "you probably", "you likely", "you usually", "typically you",
        "most people like you", "given your background", "since you're"
    ]
    
    for phrase in assumption_phrases:
        if phrase in response_lower and not context_entities:
            validation_results["uses_only_context"] = False
            validation_results["warnings"].append(f"Contains assumption: '{phrase}'")
    
    # Check if asks for clarification when context is sparse
    clarification_phrases = [
        "could you tell me more", "what's your experience", "what do you prefer",
        "i'd like to understand", "could you clarify"
    ]
    
    validation_results["asks_for_clarification"] = any(
        phrase in response_lower for phrase in clarification_phrases
    )
    
    # Check if includes follow-up question
    question_indicators = ["?", "what about", "would you like", "are you"]
    validation_results["includes_followup"] = any(
        indicator in response_lower for indicator in question_indicators
    )
    
    return validation_results
