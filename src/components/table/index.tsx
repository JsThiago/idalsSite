import React, { LegacyRef, PropsWithChildren, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import CustomSelect from "../select";
import {IoIosArrowUp,IoIosArrowDown} from "react-icons/io"

const MIN_SIZE = 100;

const QUANT_PER_PAGE = 15

export default function Table({
  ...props
}: {
  pagination?:null|"client"|"backend";
  columns: Array<{ name: any; size: number; style?: React.CSSProperties }>;
  rows: Array<Array<any>>;
}) {
  const minSize = useRef<number>(0);
  const [pageNumber,setPageNumber] = useState(0);
  const [pages,setPages] = useState<Array<typeof props.rows>>([[]]);
  const sortIcons = useRef<Array<React.ReactElement>>([<></>,<IoIosArrowUp size={20}/>,<IoIosArrowDown size={20}/>]);
  const [sortNumber,setSortNumber] = useState<Array<number>>(new Array(props.columns.length).fill(0));
  const clientWidthRef = useRef<number|null>(null);
  const pastSort = useRef(sortNumber);
  const [pagesNumbersSelect,setPagesNumberSelect] = useState<Array<{label:string|number,value:string|number}>>([]);
  console.info("width",clientWidthRef)
  useEffect(()=>{
      const pagesNumbersSelectAux:typeof pagesNumbersSelect = [] 
      for(let i = 0; i<pages.length;i++){
          pagesNumbersSelectAux.push({value:i,label:`${i+1}`})
      }
      setPagesNumberSelect(pagesNumbersSelectAux);
  },[pages])
  
  useEffect(()=>{
      const pagesAux:typeof pages = [[]];
      let pageNumberAux = 0
      const rows = [...props.rows];
      sortNumber.forEach((value,index)=>{
        if(value === pastSort.current[index]) return
          rows.sort((a,b)=>{
              if(value === 1 && typeof a[index] === "string")
                return (a[index] as string).localeCompare(b[index])
              else if(value === 2 && typeof a[index] === "string")
                return (b[index] as string).localeCompare(a[index])
              else if(value === 1 && typeof a[index] === "number")
                return +(a[index] > b[index])
              else
               return +(a[index]<b[index])
          })
        
      
      })
      rows.forEach((row,index)=>{
          pagesAux[pageNumberAux].push(row); 
          if((index+1)%QUANT_PER_PAGE === 0){
            pageNumberAux++
            pagesAux[pageNumberAux] = []
        }
      })
      console.log("pages",pagesAux);
      setPages(pagesAux)
  },[props.rows,sortNumber])
  function calcWidth(size:number){
    let quantTotalSize = 0
   
    const table = document.getElementById("table"+ "-" +props?.columns[0]?.name);
    
    props.columns.forEach((column)=>{
        quantTotalSize +=column.size;
    })
    if(quantTotalSize === 0) return 0;
    if(clientWidthRef.current === null || clientWidthRef.current === undefined){
       clientWidthRef.current = table?.clientWidth as number;
    }
    if(table){
        return clientWidthRef.current * (size/quantTotalSize);
    }
    return 0;
  }
  useEffect(()=>{
    const element = document.getElementById(props?.columns[0]?.name);
    if(element)
      minSize.current = +element.clientWidth;
  },[]);
  return (
    <>
    <table
      id={"table"+"-"+props?.columns[0]?.name}
      style={{
        backgroundColor: "#F0F0F0",
        justifyContent: "center",
        display: "flex",
        maxWidth:"100%",
        minWidth:"100%",
        flexDirection: "column",
        flex:1
      }}
    >
      <thead style={{maxWidth:"fit-content"}}>
        <tr
          
          style={{
            display: "flex",
            color: "#410D5B",
            fontFamily: "Inter",
            fontSize: "20px",
            alignItems: "center",
            marginBottom: "1rem",
            minWidth:"fit-content",
         
         
            flex:1,

            marginTop: "1rem",
          }}
        >
          {props.columns?.map((column,index) => (
           
                <th
                  className="headers"
                  id={"table-header-"+index} 
                  style={{
                  
                  
              
                    alignItems: "center",
                    justifyContent: "center",
                    display: "inline-flex",
                    minWidth:calcWidth(props.columns[index]?.size),
                    width:calcWidth(props.columns[index]?.size),
                    maxWidth:calcWidth(props.columns[index]?.size),
                  
                    
                
                    
                  }}
                >
                  <div style={{cursor:"pointer",
                  justifyContent:"center",
                  alignItems:"center",
                  flex:1,
                  marginLeft:"1rem",
                  marginRight:"1rem",
                  display:"inline-flex",
                  overflow:"hidden",
                  userSelect:"none",
                  }} onClick={()=>{
                        const sortNumberAux = [...sortNumber];
                        if(sortNumber[index] + 1 >= sortIcons.current.length){
                          sortNumberAux[index] = 0
                        }else{
                          sortNumberAux[index] = sortNumber[index] + 1
                        }
                        console.info("sortnumber",sortNumberAux);
                        setSortNumber(sortNumberAux);
                  }}>
                  <span   id={`span-${index}`}
                  
                  >{column.name}</span>
                  {sortIcons.current[sortNumber[index]]}
                  </div>
                  {index !== props.columns.length - 1 && <div id={`resize-${index}`} style={{
                    flex:0}}><div  onMouseDown={(e)=>{
                   
                   function changeWidth(e2: any){
                   
                      
                      
                   
                    
                    const header = document.getElementById("table-header-"+index)
                    const horizontalScrollOffset = document.documentElement.scrollLeft
                    
                       if(header){
                          if(horizontalScrollOffset + e2.clientX - header.offsetLeft<200){
                            return
                          }
                      
                          console.info(horizontalScrollOffset + e2.clientX - header.offsetLeft,header.scrollWidth);
                          header.style.maxWidth =   `${horizontalScrollOffset + e2.clientX - header.offsetLeft}px`;
                          header.style.minWidth =   `${horizontalScrollOffset + e2.clientX - header.offsetLeft}px`;
                          header.style.width = `${horizontalScrollOffset + e2.clientX - header.offsetLeft}px`;
                          const rows = document.getElementsByClassName(`row-${index}`);
                          for(let i = 0; i < rows.length; i++){
                               const element = rows[i] as HTMLElement;
                               element.style.maxWidth =   `${horizontalScrollOffset + e2.clientX - header.offsetLeft}px`;
                               element.style.minWidth =   `${horizontalScrollOffset + e2.clientX - header.offsetLeft}px`;
                               element.style.width = `${horizontalScrollOffset + e2.clientX - header.offsetLeft}px`;
                         }
                         const headers= document.getElementsByClassName('headers');
                         const table = document.getElementById("table");
                         let totalWidth = 0
                         for(let i = 0; i<headers.length;i++){
                            const element = headers[i] as HTMLElement;
                       
                            totalWidth += +(element.clientWidth);
                         }
                     
                         if(totalWidth > minSize.current && table){
                              table.style.width = `${totalWidth}px`;
                         }

                       }
                       
                      
                       
                  
                   }
                   window.addEventListener("mouseup",()=>{
                     window.removeEventListener("mousemove",changeWidth);
                   },{once:true})
                   window.addEventListener("mousemove",changeWidth);
                  
                   
                  
                   
               }} style={{cursor:"ew-resize",maxWidth:0,height:10,border:"1px solid rgb(0,0,0,0.5)",flex:0,zIndex:9999}}/></div>}
                </th>
                
        
          ))}
        </tr>
      </thead>
      <tbody>
        {pages[pageNumber].map((row, index) => {
        
          return (
            <tr
              style={{
                
                display: "flex",
                marginBottom: "0.1rem",
                alignItems: "center",
                backgroundColor: "white",
                paddingBottom: "1rem",
                boxShadow: "0px 0.5px 1px rgba(0,0,0,0.1)",
                paddingTop: "1rem",
                
              }}
            >
              {row.map((value, index) => {

                return (
                  <td
                    className={`row-${index}`}
                    style={{
                   
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                      
                      maxWidth:calcWidth(props.columns[index]?.size),
                      minWidth:calcWidth(props.columns[index]?.size),
                      flex: props.columns[index]?.size,
                      textAlign: "center",
                      ...props?.columns[index]?.style,
                    }}
                  >
                    {value}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
    <div style={{marginTop:"1rem"}}>
    <CustomSelect onChange={(value)=>{
        setPageNumber(+value);
    }}  options={pagesNumbersSelect} style={{maxWidth:"3rem",paddingRight:"1.2rem",alignSelf:"flex-end"}}></CustomSelect>
    </div>
    </>
  );
}
