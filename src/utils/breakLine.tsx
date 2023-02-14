import React from "react"

export default function breakLine(string:string) {
    const result:Array<React.ReactElement> = []
    const stringArray = string.split("<br/>")
    stringArray.forEach((value,index)=>{
        result.push(<span>{value}</span>);
        if(index < stringArray.length - 1)
            result.push(<br/>)
    })
    console.info(result)
    return result;
}