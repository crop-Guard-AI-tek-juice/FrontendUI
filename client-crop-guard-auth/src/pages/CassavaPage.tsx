import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CassavaPage: React.FC = () => {
  const navigate = useNavigate();

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setPrediction("");
  };

  const handleDetect = async () => {
    if (!image) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await fetch(
        // "http://127.0.0.1:8000/api/predict/",
        "https://backend-1-uzka.onrender.com/api/predict/",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      setPrediction(data.prediction);
    } catch (error) {
      console.error(error);
      setPrediction("Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
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
          style={{ width: "100%", marginTop: "15px", borderRadius: "8px" }}
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
    </div>
  );
};

export default CassavaPage;
