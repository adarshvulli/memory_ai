import { useState } from "react";
import { initKG, updateKG } from "../api/kgApi";

export default function KGEditor({ user, onUpdate }) {
  const [assistantMsg, setAssistantMsg] = useState("");
  const [userMsg, setUserMsg] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInitialize = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await initKG(user);
      console.log("Initialized:", response.message);
      onUpdate && onUpdate();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!assistantMsg || !userMsg) {
      setError("Both assistant and user messages are required");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await updateKG(user, assistantMsg, userMsg);
      console.log("Updated metadata:", response.updated_metadata);
      setAssistantMsg("");
      setUserMsg("");
      onUpdate && onUpdate();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="kg-editor">
      <h2>Edit Knowledge Graph for {user}</h2>
      
      <div className="section">
        <button 
          onClick={handleInitialize}
          disabled={loading}
        >
          Initialize Knowledge Graph
        </button>
      </div>

      <div className="section">
        <h3>Add New Information</h3>
        
        <div className="input-group">
          <label>
            Assistant Message:
            <textarea
              value={assistantMsg}
              onChange={(e) => setAssistantMsg(e.target.value)}
              placeholder="Enter assistant's message..."
              rows={4}
            />
          </label>
        </div>

        <div className="input-group">
          <label>
            User Message:
            <textarea
              value={userMsg}
              onChange={(e) => setUserMsg(e.target.value)}
              placeholder="Enter user's message..."
              rows={4}
            />
          </label>
        </div>

        <button 
          onClick={handleUpdate}
          disabled={loading || !assistantMsg || !userMsg}
        >
          Update Knowledge Graph
        </button>
      </div>

      {error && (
        <div className="error">
          Error: {error}
        </div>
      )}

      {loading && (
        <div className="loading">
          Processing...
        </div>
      )}
    </div>
  );
} 