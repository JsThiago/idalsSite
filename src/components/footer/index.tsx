import { CSSProperties } from "react";
import Paper from "../paper";

export default function Footer({ ...props }: { style?: CSSProperties }) {
  return (
    <footer
      style={{
        display: "flex",
        flex: 1,
        backgroundColor: "white",
        boxShadow: "0px -2px 8px rgba(0,0,0,0.1)",
        ...props.style,
      }}
    >
      <Paper
        style={{
          alignItems: "flex-end",
          display: "flex",
          flex: 1,
          justifyContent: "flex-end",
        }}
      >
        <small>&copy; Copyright {new Date().getFullYear()}&nbsp;, Idals</small>
      </Paper>
    </footer>
  );
}
