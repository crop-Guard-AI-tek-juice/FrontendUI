import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Message {
  role: "user" | "ai";
  text: string;
}

const CassavaPage: React.FC = () => {
  const navigate = useNavigate();

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [prediction, setPrediction] = useState<string>("");

  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState("");

  const [loading, setLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));

    setPrediction("");
    setMessages([]);
    setQuestion("");
  };

  // Detect disease
  const handleDetect = async () => {
    if (!image) return;

    setLoading(true);
    setPrediction("");
    setMessages([]);

    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await fetch(
        "https://backend-1-uzka.onrender.com/api/predict/",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      setPrediction(data.prediction);
    } catch (err) {
      console.error(err);
      setPrediction("Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  // Ask AI a question
  const askQuestion = async () => {
    if (!question || !prediction) return;

    const userMessage: Message = { role: "user", text: question };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setChatLoading(true);

    try {
      const response = await fetch(
        "https://aigen-ihkv.onrender.com/api/generate-advice/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            disease_name: prediction,
            question: userMessage.text,
          }),
        }
      );

      const data = await response.json();

      const aiMessage: Message = {
        role: "ai",
        text: data.answer || "No response",
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Failed to get response." },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "420px", margin: "auto" }}>
      <button onClick={() => navigate(-1)}>Back</button>

      <h2>Cassava Leaf Disease Detection</h2>

      <input type="file" accept="image/*" onChange={handleImageChange} />

      {preview && (
        <img
          src={preview}
          alt="preview"
          style={{ width: "100%", marginTop: "15px", borderRadius: "8px" }}
        />
      )}

      <button
        onClick={handleDetect}
        disabled={!image || loading}
        style={{ marginTop: "15px", width: "100%" }}
      >
        {loading ? "Detecting..." : "Detect Disease"}
      </button>

      {prediction && (
        <h3 style={{ marginTop: "15px" }}>
          Detected Disease: {prediction}
        </h3>
      )}

      {/* Chat Section */}
      {prediction && (
        <div style={{ marginTop: "20px" }}>
          <h4>Ask Crop Guard AI</h4>

          <div
            style={{
              background: "#f4f9f4",
              padding: "10px",
              borderRadius: "8px",
              maxHeight: "300px",
              overflowY: "auto",
              marginBottom: "10px",
            }}
          >
            {messages.map((msg, idx) => (
              <p key={idx}>
                <strong>{msg.role === "user" ? "You" : "AI"}:</strong>{" "}
                {msg.text}
              </p>
            ))}
            {chatLoading && <p><em>AI is typing…</em></p>}
          </div>

          <input
            type="text"
            placeholder="Ask a question about this disease…"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          />

          <button
            onClick={askQuestion}
            disabled={chatLoading}
            style={{ marginTop: "10px", width: "100%" }}
          >
            Ask
          </button>
        </div>
      )}
    </div>
  );
};

export default CassavaPage;
