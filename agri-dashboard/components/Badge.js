// components/Badge.js
export default function Badge({ text, color }) {
  return (
    <span
      className="badge"
      style={{
        backgroundColor: `${color}1A`,
        color,
        borderRadius: "9999px",
        letterSpacing: "0.02em",
      }}
    >
      {text}
    </span>
  );
}
