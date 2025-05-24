def summarize_kg_context(context: dict) -> str:
    lines = ["User profile:"]
    if "interests" in context and context["interests"]:
        lines.append(f"- Interested in {', '.join(context['interests'])}")
    if "skills" in context and context["skills"]:
        lines.append(f"- Has skills in {', '.join(context['skills'])}")
    if "personality_traits" in context and context["personality_traits"]:
        lines.append(f"- Prefers {', '.join(context['personality_traits'])}")
    return "\n".join(lines)