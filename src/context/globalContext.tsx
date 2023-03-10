import { SocketAddress } from "net";
import React, { ComponentPropsWithoutRef, PropsWithChildren, Ref, useContext, useEffect, useRef, useState } from "react";
import { start } from "repl";
import { useToast } from "../components/toast";
type GlobalContextValues = {
  panics:Array<any>;
  socket:WebSocket|null;
  hasConnectionWithWs:boolean;
};



export const GlobalContext = React.createContext<GlobalContextValues>({panics:[],socket:null,hasConnectionWithWs:false});

export const useGlobalContext = ()=> useContext(GlobalContext);
async function connectWsPromise():Promise<WebSocket>{
    return new Promise((resolve,reject)=>{

      const ws = new WebSocket("ws://idals.com.br:3502");
      setTimeout(()=>{
        reject()
    },5000)
      function onOpen(){
        ws.removeEventListener("open",onOpen)
        resolve(ws)
      }
      ws.addEventListener("open",onOpen)
    })
}
const GlobalContextWrapper: React.FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const {toastCallPanic} = useToast()
  function webSocketConnect(socketRef:React.MutableRefObject<WebSocket|null>,onClose:()=>void,onOpen:()=>void,onMessage:(message:any)=>void){
    connectWsPromise().then((ws)=>{
          console.warn("conexão com o socket estabelecida")
          socketRef.current = ws
          onOpen()
          ws?.addEventListener("close",()=>{
            console.warn("Conexão perdida")
            onClose()
            webSocketConnect(socketRef,onClose,onOpen,onMessage);
          },{once:true})
        
          ws?.addEventListener('message', (e) => {
            const data = JSON.parse(e.data)
            if(data?.func !== "panico") return
            onMessage(data)
            toastCallPanic(`O funcionário ${data.funcionario} disparou um sinal de pánico`);
            console.log("recebido" + e.data);
          })

    }).catch((ws)=>{
        console.warn("socket fechado")
        setTimeout(()=>{
          console.warn("Tentando reconectar");
          webSocketConnect(socketRef,onClose,onOpen,onMessage);

        },5000)
    });
 

  }
  const [panics,setPanics] = useState<Array<any>>([]);
  const panicsRef = useRef<typeof panics>([])
  const socketRef = useRef<null|WebSocket>(null);
  const [hasConnectionWithWs,setHasConnectionWithWs] = useState(false);
  const hasListener = useRef<{close:boolean,open:boolean,message:boolean}>({
    close:false,
    message:false,
    open:false
  })
  useEffect(()=>{
    panicsRef.current = panics;
    function sendPanicNotification(){
      if(panicsRef.current.length === 1 )
        toastCallPanic(`Existe ${panicsRef.current.length} pânicos não tratado`)
      else if(panicsRef.current.length > 1 )
        toastCallPanic(`Existem ${panicsRef.current.length} pânicos não tratados`)
      setTimeout(()=>{
        sendPanicNotification()
      },20000)
    }
    sendPanicNotification()
  },[panics])
  useEffect(()=>{


    webSocketConnect(socketRef,()=>{
      setHasConnectionWithWs((last)=>false
      )
    },()=>{
      socketRef.current?.send("olá, agora eu tenho conexão")
      setHasConnectionWithWs((last)=>
      true)
    },(message)=>{
      setPanics((last)=>{
        const panicsClone = [...last];
        panicsClone.push(message);
        return panicsClone
      });

    })
  },[])

  return (
    <GlobalContext.Provider value={{panics,socket:socketRef.current,hasConnectionWithWs}}>
      {children}
    </GlobalContext.Provider>
  );
};
export default GlobalContextWrapper;
