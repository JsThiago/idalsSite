import { useGlobalContext } from "../../context/globalContext";
import usePanic from "../../hooks/useQuery/usePanic";

interface Panico {
  //area:string;
  funcionario: string;
  //telefone:string;
  horario: string;
}

export default function PanicMessage({
  panico,
  isAtivo = false,
}: {
  panico?: Panico & { panicNumber: string | number };
  isAtivo?: boolean;
}) {
  const { updatePanics } = useGlobalContext();
  return (
    <div
      style={{
        backgroundColor: "rgba(217, 217, 217, 0.22)",
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h1 style={{ fontSize: "2rem" }}>Pânico {panico?.panicNumber}</h1>
      <ul
        style={{ fontSize: "30px", fontFamily: "Readex Pro", fontWeight: 500 }}
      >
        {
          //<li>Área: {panico?.area}</li>
        }
        <li>Funcionário: {panico?.funcionario}</li>
        {
          //<li>Telefone: {panico?.telefone}</li>
        }
        <li>Horário de acionamento: {panico?.horario}</li>
      </ul>
      {isAtivo && (
        <span
          onClick={() => {
            updatePanics(+(panico?.panicNumber as string | number), {
              tratado: true,
            });
          }}
          style={{
            color: "#410D5B",
            textDecoration: "underline",
            alignSelf: "flex-end",
            marginRight: "1rem",
            cursor: "pointer",
          }}
        >
          Declarar como tratado
        </span>
      )}
    </div>
  );
}
