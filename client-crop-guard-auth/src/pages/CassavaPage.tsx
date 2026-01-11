import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CassavaPage: React.FC = () => {
  const navigate = useNavigate();

  // Image + preview
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // Prediction + advice
  const [prediction, setPrediction] = useState<string>("");
  const [advice, setAdvice] = useState<string>("");

  // Loading states
  const [loading, setLoading] = useState(false);
  const [adviceLoading, setAdviceLoading] = useState(false);

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));

    // Reset old results
    setPrediction("");
    setAdvice("");
  };

  // Fetch AI advice from Render backend
  const fetchAdvice = async (diseaseName: string) => {
    setAdviceLoading(true);
    setAdvice("");

    try {
      const response = await fetch(
        "https://aigen-ihkv.onrender.com/api/generate-advice/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            disease_name: diseaseName,
          }),
        }
      );

      const data = await response.json();
      setAdvice(data.advice || "No advice returned");
    } catch (error) {
      console.error(error);
      setAdvice("Failed to load advice");
    } finally {
      setAdviceLoading(false);
    }
  };

  // Detect disease from image
  const handleDetect = async () => {
    if (!image) return;

    setLoading(true);
    setPrediction("");
    setAdvice("");

    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/predict/",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      const disease = data.prediction;

      setPrediction(disease);

      // Call AI advice backend
      await fetchAdvice(disease);
    } catch (error) {
      console.error(error);
      setPrediction("Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "420px", margin: "auto" }}>
      <button
        onClick={() => navigate(-1)}
        style={{ padding: "10px 20px", marginBottom: "20px" }}
      >
        Back
      </button>

      <h2>Cassava Leaf Disease Detection</h2>

      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleImageChange}
      />

      {preview && (
        <img
          src={preview}
          alt="Leaf preview"
          style={{
            width: "100%",
            marginTop: "15px",
            borderRadius: "8px",
          }}
        />
      )}

      <button
        onClick={handleDetect}
        disabled={!image || loading}
        style={{
          marginTop: "15px",
          padding: "10px",
          width: "100%",
          cursor: "pointer",
        }}
      >
        {loading ? "Detecting..." : "Detect Disease"}
      </button>

      {prediction && (
        <h3 style={{ marginTop: "15px" }}>
          Result: <span>{prediction}</span>
        </h3>
      )}

      {adviceLoading && <p>Loading treatment advice…</p>}

      {advice && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            background: "#f4f9f4",
            borderRadius: "8px",
            lineHeight: "1.6",
          }}
        >
          <h4>Recommended Guidance</h4>
          <p style={{ whiteSpace: "pre-line" }}>{advice}</p>
        </div>
      )}
    </div>
  );
};

export default CassavaPage;
