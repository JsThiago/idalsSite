import Paper from "../paper";
import React, { CSSProperties, useState } from "react";
import Modal from "../modal";
import PanicMessage from "../panicMessage";
import { useGlobalContext } from "../../context/globalContext";
export default function PanicModalAlert({
  visibility,
  onClickOutside,
}: {
  visibility: boolean;
  onClickOutside?: () => void;
}) {
  const [page, setPage] = useState<number>(0);
  const { panics } = useGlobalContext();
  const styleSelected: CSSProperties = {
    color: "#BC0202",
    textDecoration: "underline",
    cursor: "pointer",
  };
  const styleNotSelected: CSSProperties = {
    cursor: "pointer",
  };
  return (
    <Modal
      onClickOutside={onClickOutside}
      style={{ width: "100vw", display: "flex" }}
      visibility={visibility}
    >
      <Paper
        style={{
          minWidth: "50vw",
          minHeight: "50vh",
          maxHeight: "80vh",
          display: "flex",
          flex: 1,
          borderRadius: "10px",
          overflow: "auto",
          flexDirection: "column",
        }}
      >
        <div style={{ flex: 1, justifyContent: "center", display: "flex" }}>
          <h1 style={{ color: "#BC0202" }}>ATENÇÃO !</h1>
        </div>
        <div
          style={{
            display: "flex",
            flex: 1,
            width: "100%",
            justifyContent: "space-around",
            margin: "2rem 0 2rem 0",
          }}
        >
          <span
            style={page === 0 ? styleSelected : styleNotSelected}
            onClick={() => {
              setPage(0);
            }}
          >
            Ativo
          </span>
          <span
            style={page === 1 ? styleSelected : styleNotSelected}
            onClick={() => {
              setPage(1);
            }}
          >
            Marcar como tratado
          </span>
        </div>
        <div
          style={{
            flex: 2,
            padding: "1rem",
            display: "flex",
            flexDirection: "column",
            rowGap: "1rem",
          }}
        >
          {page === 0 &&
            panics.map((panic, index) => {
              console.info("esse é o pânico",panic)
              return (
                <PanicMessage
                  panico={{
                    panicNumber: index + 1,

                    funcionario: panic?.funcionario,
                    horario: `${
                      new Date(panic?.date)
                        .toISOString()
                        .split("T")[1]
                        .split(".")[0]
                    } ${new Date(panic?.date).toISOString().split("T")[0]}`,
                  }}
                />
              );
            })}
        </div>
      </Paper>
    </Modal>
  );
}
