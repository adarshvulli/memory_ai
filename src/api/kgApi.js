const BASE = "http://localhost:8001/kg";

/**
 * Initialize a user's knowledge graph
 * @param {string} user_name - The name of the user
 * @returns {Promise<{message: string}>}
 */
export async function initKG(user_name) {
  const res = await fetch(`${BASE}/init`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_name }),
  });
  if (!res.ok) throw new Error("Failed to initialize KG");
  return await res.json();
}

/**
 * Query the knowledge graph for a user
 * @param {string} user_name - The name of the user
 * @param {string} user_query - The query to search for
 * @returns {Promise<{kg_context: {interests?: string[], skills?: string[], personality_traits?: string[], topics?: string[]}}>}
 */
export async function queryKG(user_name, user_query) {
  const res = await fetch(`${BASE}/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_name, user_query }),
  });
  if (!res.ok) throw new Error("Failed to query KG");
  return await res.json();
}

/**
 * Update the knowledge graph with new information
 * @param {string} user_name - The name of the user
 * @param {string} assistant_msg - The assistant's message
 * @param {string} user_msg - The user's message
 * @returns {Promise<{updated_metadata: {interests?: string[], skills?: string[], topic?: string, personality_traits?: string[]}}>}
 */
export async function updateKG(user_name, assistant_msg, user_msg) {
  const res = await fetch(`${BASE}/update`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_name, assistant_msg, user_msg }),
  });
  if (!res.ok) throw new Error("Failed to update KG");
  return await res.json();
} 