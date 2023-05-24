import React, {
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useToast } from "../components/toast";
import { DataPanics, DataPanicWs, Panics, PanicsAll } from "../types";
import usePanic from "../hooks/useQuery/usePanic";
import { validateToken } from "../hooks/useQuery/api";
import Spin from "../components/spin";
type GlobalContextValues = {
  panics: PanicsAll;
  socket: WebSocket | null;
  hasConnectionWithWs: boolean;
  isAuth: boolean;
  setIsAuth: (auth: boolean) => void;
  updatePanics: (id: string | number, body: Partial<DataPanics>) => void;
};

export const GlobalContext = React.createContext<GlobalContextValues>({
  panics: {
    tratados: [],
    naoTratados: [],
  },
  isAuth: false,
  setIsAuth: () => {},
  socket: null,
  hasConnectionWithWs: false,
  updatePanics: () => {},
});

export const useGlobalContext = () => useContext(GlobalContext);
const connectWsPromise = async function (): Promise<WebSocket> {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(process.env?.REACT_APP_WSS_URL as string);
    setTimeout(() => {
      reject();
    }, 5000);
    function onOpen() {
      ws.removeEventListener("open", onOpen);
      resolve(ws);
    }
    ws.addEventListener("open", onOpen);
  });
};
const GlobalContextWrapper: React.FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const { toastCallTopRight } = useToast();
  const [isShowingFuncToast, setIsShowingFuncToast] = useState(false);
  const webSocketConnect = useCallback(
    (
      socketRef: React.MutableRefObject<WebSocket | null>,
      onClose: () => void,
      onOpen: () => void,
      onMessage: (message: DataPanicWs) => void
    ) => {
      connectWsPromise()
        .then((ws) => {
          socketRef.current = ws;
          onOpen();
          ws?.addEventListener(
            "close",
            () => {
              console.warn("Conexão perdida");
              onClose();
              webSocketConnect(socketRef, onClose, onOpen, onMessage);
            },
            { once: true }
          );

          ws?.addEventListener("message", (e) => {
            if (!isAuth) return;
            const data = JSON.parse(e.data) as DataPanicWs;
            if (data?.func !== "panico") return;
            onMessage(data);
            setIsShowingFuncToast(true);
            toastCallTopRight(
              `O funcionário ${data.args.message.nome_funcionario} disparou um sinal de pânico`,
              10000,
              {
                backgroundColor: "#BC0202",
              },
              () => {
                setIsShowingFuncToast(false);
              }
            );
          });
        })
        .catch((ws) => {
          console.warn("socket fechado");
          setTimeout(() => {
            console.warn("Tentando reconectar");
            webSocketConnect(socketRef, onClose, onOpen, onMessage);
          }, 5000);
        });
    },
    []
  );
  const [isAuth, setIsAuth] = useState(false);
  const [panics, setPanics] = useState<PanicsAll>({
    naoTratados: [],
    tratados: [],
  });
  const updatePanics = useCallback(
    (id: string | number, body: Partial<DataPanics>) => {
      setPanics((last) => {
        const lastCopy = { ...last };
        lastCopy.naoTratados = lastCopy.naoTratados.filter((panic) => {
          if (panic.id === id) {
            lastCopy.tratados.push({ ...panic, ...body });
            return false;
          }

          return true;
        });
        panicsRef.current = lastCopy;
        return lastCopy;
      });
      toastCallTopRight(`Pânico ${id} tratado com sucesso`, 1000);
    },
    []
  );
  const panicsRef = useRef<typeof panics>({
    tratados: [],
    naoTratados: [],
  });
  const socketRef = useRef<null | WebSocket>(null);
  const refTimer = useRef<number | null | undefined>(undefined);
  const { updatePanic } = usePanic({
    onSuccessUpdate: async (data) => {
      updatePanics(data.id as number, {
        tratado: true,
        date_confirmacao: data.date_confirmacao,
        login_confirmacao: data.login_confirmacao,
      });
    },
    onSuccess: (data: Array<Panics>) => {
      const panicsAll: typeof panics = {
        naoTratados: [],
        tratados: [],
      };
      data.forEach((value) => {
        if (value.tratado) {
          panicsAll.tratados.push(value);
          return;
        }
        panicsAll.naoTratados.push(value);
      });
      panicsRef.current = panicsAll;
      setPanics(panicsAll);
    },
    query: "",
  });
  const [hasConnectionWithWs, setHasConnectionWithWs] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    function sendPanicNotification() {
      console.debug(refTimer.current, "ref");
      if (refTimer.current !== undefined && refTimer.current !== null) return;

      if (panicsRef.current?.naoTratados?.length === 0) return;
      if (panicsRef.current?.naoTratados?.length === 1) {
        toastCallTopRight(
          `Existe ${panicsRef.current?.naoTratados?.length} sem tratamento`,
          3000,
          {
            backgroundColor: "#BC0202",
          }
        );
      } else {
        toastCallTopRight(
          `Existem ${panicsRef.current?.naoTratados?.length} sem tratamento`,
          3000,
          { backgroundColor: "#BC0202" }
        );
      }
      refTimer.current = setTimeout(() => {
        refTimer.current = null;
        sendPanicNotification();
      }, 20000) as unknown as number;
    }

    setTimeout(() => {
      sendPanicNotification();
    }, 1000) as unknown as number;
  }, [isShowingFuncToast, isAuth, panicsRef.current]);

  const onClose = useCallback(() => {
    setHasConnectionWithWs(() => false);
  }, [setHasConnectionWithWs]);
  const onOpen = useCallback(() => {
    socketRef.current?.send("olá, agora eu tenho conexão");
    setHasConnectionWithWs(() => true);
  }, [setHasConnectionWithWs]);
  const onMessage = useCallback(
    (message: DataPanicWs) => {
      setPanics((last) => {
        const panicsClone = [...last.naoTratados];
        panicsClone.push({
          cracha: message.args.message.cracha,
          date: message.args.message.date,
          localizacao: message.args.message.localizacao,
          vinculado: message.args.message.vinculado,
          id: message.args.message.id,
          tratado: false,
          funcionario: message.args.message.nome_funcionario,
          telefone: message.args.message.telefone,
          date_confirmacao: message.args.message.date_confirmacao,
          login_confirmacao: message.args.message.login_confirmacao,
          areas: message.args.message.areas,
        });
        return { naoTratados: panicsClone, tratados: last.tratados };
      });
    },
    [setPanics]
  );
  useEffect(() => {
    validateToken()
      .then(() => {
        setIsAuth(true);
      })
      .catch(() => {
        console.info("Token invalid");
      })
      .finally(() => {
        setIsLoading(false);
      });

    webSocketConnect(socketRef, onClose, onOpen, onMessage);
  }, []);
  function Loading() {
    return useMemo(
      () => (
        <div
          style={{
            position: "relative",
            width: "100vw",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "f4f4f4",
            flexDirection: "column",
            rowGap: "10rem",
          }}
        >
          <Spin
            style={{
              width: "10rem",
              height: "10rem",
              transform: "translate(100%, -50%)",
              zIndex: 99,
            }}
          />
          <h2>Por favor aguarde</h2>
        </div>
      ),
      []
    );
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <GlobalContext.Provider
      value={{
        isAuth,
        setIsAuth,
        updatePanics: updatePanic,
        panics,
        socket: socketRef.current,
        hasConnectionWithWs,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
export default GlobalContextWrapper;
