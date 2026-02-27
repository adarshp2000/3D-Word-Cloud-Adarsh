import { useState, useCallback } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Text } from "@react-three/drei"

type Word = {
  word: string
  weight: number
}

const SAMPLE_URLS = [
  "https://www.bbc.com/news/world-us-canada-66231824",
  "https://www.themarthablog.com/2026/02/happy-valentines-day-2026.html",
  "https://www.nytimes.com/2023/09/01/technology/ai-news.html",
]

const STRAND_A_COLORS = ["#60a5fa", "#38bdf8", "#a78bfa", "#818cf8"]
const STRAND_B_COLORS = ["#34d399", "#4ade80", "#f472b6", "#fb923c"]

function DoubleHelixCloud({ words }: { words: Word[] }) {
  const maxWeight = words.length > 0 ? words[0].weight : 1

  return (
    <>
      {words.map((item, index) => {
        const strand = index % 2
        const strandIndex = Math.floor(index / 2)
        const total = Math.ceil(words.length / 2)

        const t = (strandIndex / Math.max(total - 1, 1)) * Math.PI * 4
        const radius = 28
        const heightSpread = 80
        const y = (strandIndex / Math.max(total - 1, 1)) * heightSpread - heightSpread / 2

        const angle = t + (strand === 1 ? Math.PI : 0)
        const x = radius * Math.cos(angle)
        const z = radius * Math.sin(angle)

        const normalized = item.weight / maxWeight
        const size = 2 + normalized * 6

        const colors = strand === 0 ? STRAND_A_COLORS : STRAND_B_COLORS
        const color = colors[strandIndex % colors.length]

        return (
          <Text
            key={index}
            position={[x, y, z]}
            fontSize={size}
            color={color}
            letterSpacing={0.05}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.04}
            outlineColor="#00000088"
            rotation={[0, -angle + Math.PI / 2, 0]}
          >
            {item.word.toUpperCase()}
          </Text>
        )
      })}
    </>
  )
}

function EmptyState() {
  return (
    <Text
      position={[0, 0, 0]}
      fontSize={4}
      color="#374151"
      anchorX="center"
      anchorY="middle"
      letterSpacing={0.1}
    >
      ENTER A URL TO BEGIN
    </Text>
  )
}

export default function App() {
  const [url, setUrl] = useState(SAMPLE_URLS[0])
  const [words, setWords] = useState<Word[]>([])
  const [loading, setLoading] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [error, setError] = useState("")

  const analyze = useCallback(async () => {
    if (!url) return
    setLoading(true)
    setError("")
    try {
      const res = await fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      })
      if (!res.ok) throw new Error(`Server error: ${res.status}`)
      const data = await res.json()
      if (data.words) {
        const sorted = [...data.words].sort(
          (a: Word, b: Word) => b.weight - a.weight
        )
        setWords(sorted.slice(0, 40))
      }
    } catch (err: any) {
      setError(err.message || "Error analyzing article. Make sure your backend is running.")
    }
    setLoading(false)
  }, [url])

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body, #root {
          width: 100%;
          height: 100%;
          overflow: hidden;
          background: #030712;
        }
      `}</style>

      <div style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#030712",
        color: "white",
        fontFamily: "'DM Mono', 'Courier New', monospace",
        overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{
          padding: "18px 28px 14px",
          borderBottom: "1px solid #111827",
          background: "linear-gradient(to bottom, #0a0f1e, #030712)",
          flexShrink: 0,
          zIndex: 10,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#60a5fa", boxShadow: "0 0 10px #60a5fa" }} />
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#34d399", boxShadow: "0 0 10px #34d399" }} />
            </div>
            <h1 style={{
              fontSize: 14,
              fontWeight: 500,
              letterSpacing: "0.18em",
              color: "#e2e8f0",
              textTransform: "uppercase",
            }}>
              3D Article Word Cloud
            </h1>
          </div>

          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            {SAMPLE_URLS.map((sample, index) => (
              <button
                key={index}
                onClick={() => { setUrl(sample); setActiveIndex(index) }}
                style={{
                  padding: "5px 14px",
                  borderRadius: 4,
                  border: `1px solid ${activeIndex === index ? "#3b82f6" : "#1f2937"}`,
                  background: activeIndex === index ? "#1e3a5f" : "transparent",
                  color: activeIndex === index ? "#60a5fa" : "#6b7280",
                  cursor: "pointer",
                  fontSize: 11,
                  letterSpacing: "0.08em",
                  fontFamily: "inherit",
                  transition: "all 0.15s ease",
                }}
              >
                SAMPLE {index + 1}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && analyze()}
              placeholder="https://..."
              style={{
                flex: 1,
                padding: "9px 14px",
                borderRadius: 6,
                border: "1px solid #1f2937",
                background: "#0d1117",
                color: "#e2e8f0",
                fontSize: 13,
                fontFamily: "inherit",
                outline: "none",
                letterSpacing: "0.02em",
                minWidth: 0,
              }}
              onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
              onBlur={(e) => e.target.style.borderColor = "#1f2937"}
            />
            <button
              onClick={analyze}
              disabled={loading}
              style={{
                padding: "9px 22px",
                borderRadius: 6,
                border: "1px solid #3b82f6",
                background: loading ? "#1e3a5f" : "#1d4ed8",
                color: loading ? "#93c5fd" : "white",
                cursor: loading ? "default" : "pointer",
                fontSize: 11,
                fontFamily: "inherit",
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
                flexShrink: 0,
                boxShadow: loading ? "none" : "0 0 20px #1d4ed844",
                transition: "all 0.15s ease",
              }}
            >
              {loading ? "ANALYZING..." : "ANALYZE →"}
            </button>
          </div>

          <div style={{ marginTop: 8, fontSize: 11, color: "#4b5563", letterSpacing: "0.08em", minHeight: 16 }}>
            {error
              ? <span style={{ color: "#f87171" }}>{error}</span>
              : words.length > 0
              ? `${words.length} KEYWORDS · DOUBLE HELIX · DRAG TO ROTATE · SCROLL TO ZOOM`
              : null
            }
          </div>
        </div>

        {/* Canvas */}
        <div style={{ flex: 1, position: "relative", minHeight: 0 }}>
          <div style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse at 50% 50%, #0f1f3d18 0%, transparent 70%)",
            pointerEvents: "none",
            zIndex: 1,
          }} />
          <Canvas
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
            camera={{ position: [80, 0, 80], fov: 55 }}
            gl={{ antialias: true }}
          >
            <ambientLight intensity={2} />
            <pointLight position={[100, 100, 100]} intensity={1} />
            <OrbitControls
              enableZoom
              enablePan={false}
              autoRotate
              autoRotateSpeed={0.8}
              minDistance={40}
              maxDistance={250}
            />
            {words.length > 0 ? <DoubleHelixCloud words={words} /> : <EmptyState />}
          </Canvas>
        </div>
      </div>
    </>
  )
}