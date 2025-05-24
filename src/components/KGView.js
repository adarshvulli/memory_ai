import { useEffect, useState } from "react";
import { queryKG } from "../api/kgApi";

export default function KGView({ user }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async (query = "") => {
    try {
      setLoading(true);
      setError(null);
      const response = await queryKG(user, query);
      setData(response.kg_context);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  if (loading) return <div>Loading knowledge graph...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>No data available</div>;

  return (
    <div className="kg-view">
      <h2>{user}'s Knowledge Graph</h2>
      
      {data.interests && data.interests.length > 0 && (
        <div className="section">
          <h3>Interests</h3>
          <ul>
            {data.interests.map((interest, index) => (
              <li key={index}>{interest}</li>
            ))}
          </ul>
        </div>
      )}

      {data.skills && data.skills.length > 0 && (
        <div className="section">
          <h3>Skills</h3>
          <ul>
            {data.skills.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
        </div>
      )}

      {data.personality_traits && data.personality_traits.length > 0 && (
        <div className="section">
          <h3>Personality Traits</h3>
          <ul>
            {data.personality_traits.map((trait, index) => (
              <li key={index}>{trait}</li>
            ))}
          </ul>
        </div>
      )}

      {data.topics && data.topics.length > 0 && (
        <div className="section">
          <h3>Topics</h3>
          <ul>
            {data.topics.map((topic, index) => (
              <li key={index}>{topic}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 