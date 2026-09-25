import { Lightbulb } from "lucide-react";

export default function Recommendation({ text }) {
  if (!text) return null;
  return (
    <div className="section">
      <div className="recommendation">
        <Lightbulb size={18} strokeWidth={2} color="#2d7a3a" />
        <div>
          <span className="recommendation__label">CropIQ recommends</span>
          <p className="recommendation__text">{text}</p>
        </div>
      </div>
    </div>
  );
}
