import React, { useContext } from "react";
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
  style?:React.CSSProperties
  onClickOutside?:()=>void
}) {
  return (
    <div
    onClick={props?.onClickOutside}
      style={{
        visibility: props.visibility ? "visible" : "hidden",
        position: "fixed",
        top: 0,
        right: 0,
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        zIndex: 9999,
        width: "100vw",
        display: "flex",
        height: "100vh",
    
        alignItems: "center",
        justifyContent: "center",
        ...props.style
      }}
    >
      <div onClick={(e)=>{
          e.stopPropagation();
      }} >
      {props.children}
      </div>
    </div>
  );
}
