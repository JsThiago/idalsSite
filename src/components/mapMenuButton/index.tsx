import "./styles.css";
export default function BaseMapButton({
  ...props
}: {
  onClick?: () => void;
  style?: React.CSSProperties;
  msgToolbox?: string;
  color?: string;
  children?: any;
}) {
  return (
    <div style={{ position: "relative", flex: 1 }}>
      <div className="button-base-map-wrapper" style={props.style}>
        <span
          className="button-base-map-tooltip"
          style={{
            color: "white",
            textAlign: "center",
            minWidth: "10rem",
            padding: "0.5rem 1rem 0.5rem 1rem",
            position: "absolute",
            top: "40%",
            right: "-14rem",
            borderRadius: 10,
            backgroundColor: "rgba(0,0,0,0.9)",
          }}
        >
          {props.msgToolbox || "Menu"}
        </span>
        <div
          className="button-base-map"
          onClick={() => {
            props.onClick && props.onClick();
          }}
          style={{
            height: 100,
            width: 100,
            borderRadius: "100%",
            backgroundColor: props.color || "#006867",
            boxShadow: "1px 1px 8px rgba(0,0,0,1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            cursor: "pointer",
          }}
        >
          {props.children}
        </div>
      </div>
    </div>
  );
}
