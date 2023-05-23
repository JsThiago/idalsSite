import React, {
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useToast } from "../components/toast";
import { DataPanics, DataPanicWs, Panics, PanicsAll } from "../types";
import usePanic from "../hooks/useQuery/usePanic";
type GlobalContextValues = {
  panics: PanicsAll;
  socket: WebSocket | null;
  hasConnectionWithWs: boolean;
  updatePanics: (id: string | number, body: Partial<DataPanics>) => void;
};

export const GlobalContext = React.createContext<GlobalContextValues>({
  panics: {
    tratados: [],
    naoTratados: [],
  },
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
            lastCopy.tratados.push(panic);
            return false;
          }

          return true;
        });

        return lastCopy;
      });
    },
    []
  );
  const panicsRef = useRef<typeof panics>({
    tratados: [],
    naoTratados: [],
  });
  const socketRef = useRef<null | WebSocket>(null);
  const refTimer = useRef<number>();
  const { updatePanic } = usePanic({
    onSuccessUpdate: (data) => {
      updatePanics(data.id as number, {
        tratado: true,
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
      setPanics(panicsAll);
    },
    query: "",
  });
  const [hasConnectionWithWs, setHasConnectionWithWs] = useState(false);
  useEffect(() => {
    if (refTimer !== undefined) {
      clearTimeout(refTimer.current);
      refTimer.current = undefined;
    }
    function sendPanicNotification() {
      panicsRef.current = panics;
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
      panicsRef.current = panics;
      refTimer.current = setTimeout(() => {
        sendPanicNotification();
      }, 20000) as unknown as number;
    }
    if (isShowingFuncToast) {
      return;
    }
    setTimeout(() => {
      sendPanicNotification();
    }, 1000);
  }, [panics, isShowingFuncToast]);

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
        });
        return { naoTratados: panicsClone, tratados: last.tratados };
      });
    },
    [setPanics]
  );
  useEffect(() => {
    webSocketConnect(socketRef, onClose, onOpen, onMessage);
  }, []);

  return (
    <GlobalContext.Provider
      value={{
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
