import React from "react";

export default function ErroDados({
  style,
  message,
  show = true,
}: {
  message?: string;
  style?: React.CSSProperties;
  show?: boolean;
}) {
  if (!show) {
    return <></>;
  }
  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        right: "50%",
        width: "70%",
        padding: "3rem 3rem 3rem 3rem",
        transform: "translate(50%,-50%)",
        backgroundColor: "rgba(65, 13, 91)",
        borderRadius: "20px",
        color: "#fffeff",

        boxSizing: "border-box !important" as any,
        zIndex: 99,
        ...style,
      }}
    >
      {message
        ? message
        : "Ocorreu um erro ao buscar os dados para esse crachá. Por favor tente novamente."}
    </div>
  );
}
