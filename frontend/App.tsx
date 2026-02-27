import { Canvas } from "@react-three/fiber";
import { Text, OrbitControls } from "@react-three/drei";
import { useState, useMemo } from "react";
import axios from "axios";

type Word = {
  word: string;
  weight: number;
};

function App() {
  const [url, setUrl] = useState("");
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (!url) return;
    setLoading(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/analyze",
        { url }
      );

      const sorted = response.data.words
        .sort((a: Word, b: Word) => b.weight - a.weight)
        .slice(0, 25);

      setWords(sorted);
    } catch (err) {
      alert("Backend error");
    }

    setLoading(false);
  };

  // Normalize font sizes safely
  const maxWeight = useMemo(
    () => Math.max(...words.map((w) => w.weight), 1),
    [words]
  );

  return (
    <div
      style={{
        height: "100vh",
        background: "#0f0f14",
        color: "white",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ padding: 20, textAlign: "center" }}>
        <h2>AI 3D Article Word Cloud</h2>

        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter article URL"
          style={{
            padding: 10,
            width: 420,
            borderRadius: 6,
            border: "none",
            marginRight: 10,
          }}
        />

        <button
          onClick={analyze}
          style={{
            padding: "10px 20px",
            borderRadius: 6,
            border: "none",
            background: "#3b82f6",
            color: "white",
            cursor: "pointer",
          }}
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </div>

      <Canvas camera={{ position: [0, 0, 35] }}>
        <ambientLight intensity={1.5} />
        <OrbitControls autoRotate autoRotateSpeed={0.6} />

        {words.map((item, index) => {
          const cols = 5;
          const spacing = 6;

          const row = Math.floor(index / cols);
          const col = index % cols;

          const x = (col - 2) * spacing;
          const y = (2 - row) * spacing;

          const size =
            1.5 + (item.weight / maxWeight) * 3;

          return (
            <Text
              key={index}
              position={[x, y, 0]}
              fontSize={size}
              color={`hsl(${(index * 37) % 360}, 70%, 65%)`}
              anchorX="center"
              anchorY="middle"
            >
              {item.word}
            </Text>
          );
        })}
      </Canvas>
    </div>
  );
}

export default App;