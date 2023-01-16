import { profile } from "console";
import Paper from "../paper";

export default function Card({
  Title,
  ...props
}: {
  color?: string;
  Title?: () => JSX.Element;
  title?: string;
  number?: number;
  titleColor?: string;
  style?: React.CSSProperties;
  styleLegenda?: React.CSSProperties;
}) {
  return (
    <Paper
      style={{
        background: props.color || "#F5C1A4",
        flexBasis: "10rem",
        display: "flex",
        maxWidth: "15%",
        minWidth: "12rem",
        minHeight: "13rem",
        borderRadius: "20px",
        alignItems: "center",
        flexDirection: "column",
        ...props.style,
      }}
    >
      {Title ? (
        <Title />
      ) : (
        <div
          style={{
            textAlign: "center",
            backgroundColor: props.titleColor || "#F89760",
            height: "fit-content",
            display: "flex",
            width: "80%",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "1.5rem",
            flex: 0.7,
            borderRadius: "20px",
          }}
        >
          <h1
            style={{
              fontSize: "24px",
              fontFamily: "Inter",

              lineHeight: "29px",
              fontWeight: 800,
              margin: 0,
              padding: 0,
            }}
          >
            {props.title || "Mina 1"}
          </h1>
        </div>
      )}
      <div
        style={{
          fontFamily: "Inter",
          marginTop: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: "1.3rem",
          ...props.styleLegenda,
        }}
      >
        <h3
          style={{ fontSize: "26px", margin: 0, padding: 0, fontWeight: 400 }}
        >
          {props.number || 0}
        </h3>
        <h3
          style={{
            fontSize: "20px",
            color: "rgba(0, 0, 0, 0.68)",
            margin: 0,
            marginTop: "0.6rem",
            fontWeight: 400,
          }}
        >
          Pessoas
        </h3>
      </div>
    </Paper>
  );
}
