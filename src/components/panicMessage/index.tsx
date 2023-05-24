import { useGlobalContext } from "../../context/globalContext";
import usePanic from "../../hooks/useQuery/usePanic";
import { DadosFuncionarios } from "../../types";
import { getLocalStorageAsync } from "../../utils/localStorageAsync";

interface Panico {
  area: string;
  funcionario: string;
  login_confirmacao?: string;
  date_confirmacao?: string;
  horario: string;
  telefone?: string;
}

export default function PanicMessage({
  panico,
  isAtivo = false,
}: {
  panico?: Panico & { panicNumber: string | number };
  isAtivo?: boolean;
}) {
  const { updatePanics } = useGlobalContext();
  const handlerTratar = async () => {
    const user = await getLocalStorageAsync("usuario");
    if (!user) throw new Error("User not found on local storage");
    const userParsed = JSON.parse(user) as DadosFuncionarios;

    updatePanics(+(panico?.panicNumber as string | number), {
      tratado: true,
      login_confirmacao: userParsed.nome,
      date_confirmacao: new Date(Date.now()).toISOString(),
    });
  };
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
        <li>
          Área:{" "}
          {panico?.area === "" ||
          panico?.area === null ||
          panico?.area === undefined
            ? "desconhecida"
            : panico.area}
        </li>

        <li>Funcionário: {panico?.funcionario}</li>

        <li>Telefone: {panico?.telefone}</li>

        <li>Horário de acionamento: {panico?.horario}</li>
        {panico?.login_confirmacao !== undefined && (
          <li>
            Tratado por:{" "}
            {panico?.login_confirmacao === null
              ? "desconhecido"
              : panico?.login_confirmacao}
          </li>
        )}
        {panico?.date_confirmacao && (
          <li>Dia do tratamento: {panico?.date_confirmacao}</li>
        )}
      </ul>
      {isAtivo && (
        <span
          onKeyDown={async () => await handlerTratar()}
          onClick={async () => await handlerTratar()}
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
