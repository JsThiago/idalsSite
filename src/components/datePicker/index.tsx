
import React from  "react"
export default function DatePicker({id,style,label,defaultValue,onChange,onBlur}:{
    id?:string,
    onChange?:(value:string)=>void,
    onBlur?:(value:string)=>void
    label?:string,
    defaultValue?:string;
    style?:React.CSSProperties
}){
    return (
    <>
    {label && <span style={{ marginRight: "1rem" }}>{label}</span>}
        <input
          onChange={(e) => {
            onChange && onChange(e.target.value);
          }}
          onBlur={(e)=>{
            onBlur && onBlur(e.target.value)
          }}
          defaultValue={defaultValue}
          id={id}
          type="date"
          style={{ padding:"1rem",borderRadius:"4px",border: "1px solid rgba(0,0,0,0.2)",...style }}
        />
        </>
    )
}