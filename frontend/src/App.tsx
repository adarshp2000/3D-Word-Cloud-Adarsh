import { Canvas } from "@react-three/fiber";
import { Text, OrbitControls } from "@react-three/drei";
import { useState } from "react";
import axios from "axios";
import "./App.css";

type Word = {
  word: string;
  weight: number;
};

function generateSpherePosition(index: number, total: number, radius: number) {
  const phi = Math.acos(-1 + (2 * index) / total);
  const theta = Math.sqrt(total * Math.PI) * phi;

  return [
    radius * Math.cos(theta) * Math.sin(phi),
    radius * Math.sin(theta) * Math.sin(phi),
    radius * Math.cos(phi),
  ] as [number, number, number];
}

function App() {
  const [url, setUrl] = useState("");
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (!url) return;
    setLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:8000/analyze", {
        url,
      });
      setWords(response.data.words.slice(0, 60));
    } catch (error) {
      console.error(error);
      alert("Error analyzing article");
    }
    setLoading(false);
  };

  return (
    <div style={{ height: "100vh", background: "#111", color: "white" }}>
      <div style={{ padding: 20 }}>
        <input
          type="text"
          placeholder="Enter article URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{
            padding: 10,
            width: 400,
            borderRadius: 5,
            border: "none",
            marginRight: 10,
          }}
        />
        <button
          onClick={analyze}
          style={{
            padding: "10px 20px",
            borderRadius: 5,
            border: "none",
            cursor: "pointer",
          }}
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </div>

      <Canvas camera={{ position: [0, 0, 35] }}>
        <ambientLight intensity={1.5} />
        <OrbitControls autoRotate autoRotateSpeed={1} />

        {words.map((item, index) => {
          const position = generateSpherePosition(index, words.length, 15);

          return (
            <Text
              key={index}
              position={position}
              fontSize={1 + item.weight * 3}
              color={`hsl(${(index * 47) % 360}, 100%, 60%)`}
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