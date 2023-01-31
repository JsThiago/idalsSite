import { profile } from "console";
import { useRef, useState } from "react";
import brightnessDetector from "../../utils/brightnessDetector";
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
  id?: string;
  onClick?: (name: string) => void;
}) {
  const [color, setColor] = useState<string>(props.color as string);
  return (
    <Paper
      onClick={() => {
        props.onClick && props.onClick(props.title as string);
      }}
      id={props.id}
      onContextMenu={(e) => {
        e.preventDefault();
        const input = document.getElementById("color-input-hidden" + props.id);
        input?.click();
      }}
      style={{
        backgroundColor: "rgba(" + color + ",0.5)" || "#F5C1A4",
        flexBasis: "10rem",
        display: "flex",
        width: "16rem",
        minHeight: "13rem",
        borderRadius: "20px",
        alignItems: "center",
        flexDirection: "column",
        ...props.style,
      }}
    >
      <input
        id={"color-input-hidden" + props.id}
        type="color"
        onChange={(ev) => {
          const color = ev.target.value;
          const r = parseInt(color.substr(1, 2), 16);
          const g = parseInt(color.substr(3, 2), 16);
          const b = parseInt(color.substr(5, 2), 16);
          if (props.id) {
            document.getElementById(
              props.id as string
            )!.style.backgroundColor = `rgba(${r},${g},${b},0.5)`;
            document.getElementById(
              "title-div-" + props.id
            )!.style.backgroundColor = ev.target.value;
          }
        }}
        style={{
          position: "absolute",
          visibility: "hidden",
        }}
      />
      {Title ? (
        <Title />
      ) : (
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
          onContextMenu={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const title = document.getElementById("card-title-" + props.id)
              ?.style.color;
            if (title === "white") {
              document.getElementById("card-title-" + props.id)!.style.color =
                "rgba(0,0,0,0.8)";
              return;
            }
            document.getElementById("card-title-" + props.id)!.style.color =
              "white";
            return;
          }}
          id={"title-div-" + props.id}
          style={{
            textAlign: "center",
            backgroundColor: "rgb(" + color + ")" || "#F89760",
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
            id={"card-title-" + props.id}
            style={{
              fontSize: "24px",
              fontFamily: "Inter",
              color: "rgba(0,0,0,0.8)",
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
