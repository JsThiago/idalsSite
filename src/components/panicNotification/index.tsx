import * as React from "react"
import { useGlobalContext } from "../../context/globalContext"
import "./styles.css"

const PanicIconNotificationPanic = (props: React.SVGProps<SVGSVGElement>&{onPress:()=>void}) => (

  <svg
    viewBox="0 0 39 35"
    style={{cursor:"pointer",position:"relative"}}
    width={39}
    onClick={()=>{
        props.onPress && props.onPress();
    }}
    height={35}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
  
    <rect
      x={0.625}
      y={0.625}
      width={37.75}
      height={33.75}
      rx={6.375}
      fill="#fff"
      stroke="#BC0202"
      strokeWidth={1.25}
    />
    <path
      d="M27 19.586V16c0-3.217-2.185-5.927-5.145-6.742A1.99 1.99 0 0 0 20 8a1.99 1.99 0 0 0-1.855 1.258C15.185 10.074 13 12.783 13 16v3.586l-1.707 1.707A.997.997 0 0 0 11 22v2a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-2a.996.996 0 0 0-.293-.707L27 19.586ZM27 23H13v-.586l1.707-1.707A.997.997 0 0 0 15 20v-4c0-2.757 2.243-5 5-5s5 2.243 5 5v4c0 .266.105.52.293.707L27 22.414V23Zm-7 5a2.98 2.98 0 0 0 2.818-2h-5.636A2.98 2.98 0 0 0 20 28Z"
      fill="#BC0202"
    />
    <circle
      cx={29.5}
      cy={9.5}
      r={6.25}
      fill="#BC0202"
      stroke="#000"
      strokeWidth={0.5}
    />
    <path
      d="m29.332 11.108-.072-1.044-.048-1.068c-.008-.36-.012-.708-.012-1.044l.012-2.352h.624v2.352c.008.344.004.7-.012 1.068-.008.36-.024.716-.048 1.068-.016.352-.04.692-.072 1.02h-.372Zm.156 3a.512.512 0 0 1-.396-.156c-.088-.104-.132-.252-.132-.444 0-.176.044-.32.132-.432a.494.494 0 0 1 .396-.168c.176 0 .308.052.396.156.096.104.144.252.144.444a.637.637 0 0 1-.156.432.48.48 0 0 1-.384.168Z"
      fill="#fff"
    />
  </svg>
 
)

const PanicIconNotificationNoNetworkPanic = (props: React.SVGProps<SVGSVGElement>) => (
  <div className="panic-notification-no-network" style={{position:"relative"}}>
  <div className="panic-notification-no-network-tooltip" style={{visibility:"hidden",position:"absolute",bottom:"-140px",padding:"1rem",
  left:"50%",transform:"translate(-50%,0)",color:"white",
  backgroundColor:"rgba(0,0,0,0.7)",borderRadius:"4px"}}>
    A conexão com o<br/> servidor não foi estabelecida
  </div>
  <svg
    viewBox="0 0 39 35"
    style={{cursor:"pointer"}}
    width={39}
    height={35}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect
      x={0.625}
      y={0.625}
      width={37.75}
      height={33.75}
      rx={6.375}
      fill="#fff"
      stroke="#9B870C"
      strokeWidth={1.25}
    />
    <path
      d="M27 19.586V16c0-3.217-2.185-5.927-5.145-6.742A1.99 1.99 0 0 0 20 8a1.99 1.99 0 0 0-1.855 1.258C15.185 10.074 13 12.783 13 16v3.586l-1.707 1.707A.997.997 0 0 0 11 22v2a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-2a.996.996 0 0 0-.293-.707L27 19.586ZM27 23H13v-.586l1.707-1.707A.997.997 0 0 0 15 20v-4c0-2.757 2.243-5 5-5s5 2.243 5 5v4c0 .266.105.52.293.707L27 22.414V23Zm-7 5a2.98 2.98 0 0 0 2.818-2h-5.636A2.98 2.98 0 0 0 20 28Z"
      fill="#9B870C"
    />
    <circle
      cx={29.5}
      cy={9.5}
      r={6.25}
      fill="#9B870C"
      stroke="#000"
      strokeWidth={0.5}
    />
    <path
      d="m29.332 11.108-.072-1.044-.048-1.068c-.008-.36-.012-.708-.012-1.044l.012-2.352h.624v2.352c.008.344.004.7-.012 1.068-.008.36-.024.716-.048 1.068-.016.352-.04.692-.072 1.02h-.372Zm.156 3a.512.512 0 0 1-.396-.156c-.088-.104-.132-.252-.132-.444 0-.176.044-.32.132-.432a.494.494 0 0 1 .396-.168c.176 0 .308.052.396.156.096.104.144.252.144.444a.637.637 0 0 1-.156.432.48.48 0 0 1-.384.168Z"
      fill="#fff"
    />
  </svg>
  </div>
)


const PanicIconNotificationNoPanic = (props:React.SVGProps<SVGSVGElement>&{onPress:()=>void}) => (
  <svg
    style={{cursor:"pointer"}}
    onClick={()=>{
        props.onPress && props.onPress()
    }}
    viewBox="0 0 39 35"
    width={39}
    height={35}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect
      x={0.625}
      y={0.625}
      width={37.75}
      height={33.75}
      rx={6.375}
      fill="#fff"
      stroke="#000"
      strokeWidth={1.25}
    />
    <path
      d="M27 19.586V16c0-3.217-2.185-5.927-5.145-6.742A1.99 1.99 0 0 0 20 8a1.99 1.99 0 0 0-1.855 1.258C15.185 10.074 13 12.783 13 16v3.586l-1.707 1.707A.997.997 0 0 0 11 22v2a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-2a.996.996 0 0 0-.293-.707L27 19.586ZM27 23H13v-.586l1.707-1.707A.997.997 0 0 0 15 20v-4c0-2.757 2.243-5 5-5s5 2.243 5 5v4c0 .266.105.52.293.707L27 22.414V23Zm-7 5a2.98 2.98 0 0 0 2.818-2h-5.636A2.98 2.98 0 0 0 20 28Z"
      fill="#000"
    />
  </svg>
)

export default function PanicNotification({onClick}:{onClick?:(panics:Array<any>)=>void}){
    const {panics,hasConnectionWithWs}= useGlobalContext();
    if(!hasConnectionWithWs){
      return <PanicIconNotificationNoNetworkPanic/>
    }
    const handlerOnClick =  ()=>{
        onClick && onClick(panics)
    }
    if(panics.length > 0){
        return <PanicIconNotificationPanic onPress={handlerOnClick}/>
    }
    return <PanicIconNotificationNoPanic onPress={handlerOnClick}/>
}
