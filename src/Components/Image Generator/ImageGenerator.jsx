import { useState } from "react";
import "./imageGenerator.css";
import Default from "../../assets/new.webp";

export const ImageGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateImage = async () => {
    if (!prompt) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:8080/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      console.log("Response data:", data);

      if (data.images && data.images.length > 0) {
        setImageUrl(data.images[0].url);
      } else {
        setError("No image generated");
      }

      setLoading(false);
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to generate image");
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      generateImage();
    }
  };

  return (
    <div className="Ai_Image_Gen">
      <div className="Header">
        AI Image <span>generator</span>
      </div>

      <input
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Describe your image..."
        disabled={loading}
      />

      <button onClick={generateImage} disabled={loading || !prompt}>
        {loading ? "Generating..." : "Generate"}
      </button>

      {error && <div className="error">{error}</div>}

      <div className="image">
        <img src={imageUrl || Default} alt="Generated or default" />
      </div>
    </div>
  );
};