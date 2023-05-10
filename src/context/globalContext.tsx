import React, {
  ComponentPropsWithoutRef,
  PropsWithChildren,
  Ref,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { start } from "repl";
import { useToast } from "../components/toast";
import { DataPanicWs, Panics } from "../types";
import usePanic from "../hooks/useQuery/usePanic";
type GlobalContextValues = {
  panics: Array<Panics>;
  socket: WebSocket | null;
  hasConnectionWithWs: boolean;
};

export const GlobalContext = React.createContext<GlobalContextValues>({
  panics: [],
  socket: null,
  hasConnectionWithWs: false,
});

export const useGlobalContext = () => useContext(GlobalContext);
async function connectWsPromise(): Promise<WebSocket> {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket("ws://idals.com.br:3502");
    setTimeout(() => {
      reject();
    }, 5000);
    function onOpen() {
      ws.removeEventListener("open", onOpen);
      resolve(ws);
    }
    ws.addEventListener("open", onOpen);
  });
}
const GlobalContextWrapper: React.FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const { toastCallPanic, toastCallTopRight } = useToast();
  function webSocketConnect(
    socketRef: React.MutableRefObject<WebSocket | null>,
    onClose: () => void,
    onOpen: () => void,
    onMessage: (message: DataPanicWs) => void
  ) {
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
          toastCallTopRight(
            `O funcionário ${data.args.message.nome_funcionario} disparou um sinal de pânico`
          );
          console.log("recebido" + e.data);
        });
      })
      .catch((ws) => {
        console.warn("socket fechado");
        setTimeout(() => {
          console.warn("Tentando reconectar");
          webSocketConnect(socketRef, onClose, onOpen, onMessage);
        }, 5000);
      });
  }
  const [panics, setPanics] = useState<Array<Panics>>([]);
  const panicsRef = useRef<typeof panics>([]);
  const socketRef = useRef<null | WebSocket>(null);
  const { data, isError, isLoading } = usePanic({
    onSuccess: (data) => {
      setPanics(data as Array<Panics>);
    },
  });
  const [hasConnectionWithWs, setHasConnectionWithWs] = useState(false);
  const hasListener = useRef<{
    close: boolean;
    open: boolean;
    message: boolean;
  }>({
    close: false,
    message: false,
    open: false,
  });
  useEffect(() => {
    panicsRef.current = panics;
    function sendPanicNotification() {
      if (panicsRef.current.length === 1)
        toastCallPanic(
          `Existe ${panicsRef.current.length} pânicos não tratado`
        );
      else if (panicsRef.current.length > 1)
        toastCallPanic(
          `Existem ${panicsRef.current.length} pânicos não tratados`
        );
      setTimeout(() => {
        sendPanicNotification();
      }, 20000);
    }
    sendPanicNotification();
  }, [panics]);
  useEffect(() => {
    webSocketConnect(
      socketRef,
      () => {
        setHasConnectionWithWs((last) => false);
      },
      () => {
        socketRef.current?.send("olá, agora eu tenho conexão");
        setHasConnectionWithWs((last) => true);
      },
      (message: DataPanicWs) => {
        console.info(message,"message")
        setPanics((last) => {
          const panicsClone = [...last];
          panicsClone.push({
            cracha: message.args.message.cracha,
            date: message.args.message.date,
            localizacao: message.args.message.localizacao,
            vinculado: message.args.message.vinculado,
            id: 1,
            tratado: false,
            funcionario: message.args.message.nome_funcionario,
          });
          return panicsClone;
        });
      }
    );
  }, []);

  return (
    <GlobalContext.Provider
      value={{ panics, socket: socketRef.current, hasConnectionWithWs }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
export default GlobalContextWrapper;
