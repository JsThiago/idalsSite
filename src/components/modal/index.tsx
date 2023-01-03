import { useContext } from "react";
import Button from "../button";
import CustomInput from "../input";
import Paper from "../paper";
import CustomSelect from "../select";
import Title from "../title";
import { toastContext } from "../toast";

export default function Modal({
  ...props
}: {
  visibility?: boolean;
  onConfirm?: () => void;
  children?: JSX.Element;
}) {
  return (
    <div
      style={{
        visibility: props.visibility ? "visible" : "hidden",
        position: "fixed",
        top: 0,
        right: 0,
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        zIndex: 999,
        width: "100vw",
        display: "flex",
        height: "100vh",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {props.children}
    </div>
  );
}
