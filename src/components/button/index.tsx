import "./styles.css";
import { CSSProperties, useMemo, useState } from "react";

export default function Button({
  ...props
}: {
  style?: CSSProperties;
  label: string;
  onClick?: () => void;
}) {
  const [animation, setAnimation] = useState(false);
  return (
    <button
      className="button"
      onClick={() => {
        setAnimation(true);
        setTimeout(() => {
          setAnimation(false);
        }, 200);

        props.onClick && props.onClick();
      }}
      style={{
        position: "relative",
        width: 120,
        height: 50,
        backgroundColor: "rgba(65,13,91)",
        color: "white",
        borderRadius: "10px",
        border: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        userSelect: "none",
        ...props.style,
      }}
    >
      <span>{props.label}</span>
    </button>
  );
}
