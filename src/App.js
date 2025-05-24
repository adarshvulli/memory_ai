import { useState } from "react";
import KGView from "./components/KGView";
import KGEditor from "./components/KGEditor";

function App() {
  const [user] = useState("User"); // You can make this dynamic later
  const [reloadKey, setReloadKey] = useState(0);

  return (
    <div className="app">
      <header>
        <h1>Knowledge Graph Manager</h1>
      </header>

      <main>
        <div className="container">
          <KGEditor
            user={user}
            onUpdate={() => setReloadKey(k => k + 1)}
          />
          <KGView
            key={reloadKey}
            user={user}
          />
        </div>
      </main>

      <style jsx>{`
        .app {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        header {
          margin-bottom: 30px;
          text-align: center;
        }

        .container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        @media (max-width: 768px) {
          .container {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default App; 