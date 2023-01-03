import "./styles.css";
export default function Switch({ ...props }: { checked?: boolean }) {
  return (
    <label
      style={{
        position: "relative",
        width: "60px",
        height: "34px",
        display: "inline-block",
      }}
    >
      <input
        id="checkbox"
        checked={props.checked || false}
        onClick={() => {
          console.log("oi");
        }}
        style={{ opacity: 0, width: 0, height: 0 }}
        type="checkbox"
      />
      <span
        className="slider"
        style={{
          position: "absolute",
          cursor: "pointer",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "#ccc",
          borderRadius: "34px",
        }}
      />
    </label>
  );
}
