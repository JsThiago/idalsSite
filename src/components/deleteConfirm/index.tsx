import React from "react";
import Modal from "../../components/modal";
import Paper from "../paper";
import { RxCross2 } from "react-icons/rx";
import Title from "../title";
import Button from "../button";
export default function DeleteConfirm({subtitle,onClose,deleteFunc,visibility}:
    {subtitle?:string|Array<React.ReactElement>,visibility:boolean;onClose:()=>void; deleteFunc:()=>void}){
    return (
        <Modal visibility={visibility}>
            <Paper
          style={{
            display: "flex",
   
            flexWrap:"wrap",
            position: "relative",
            flexDirection: "column",
            borderRadius: "2px",
            padding:"2rem",
            minWidth:"30rem",
            boxShadow: "1px 1px 4px rgba(0,0,0,0.3)",
          }}
        >
          <div >
            <RxCross2
              style={{ position: "absolute", right: "2rem", cursor: "pointer" }}
              onClick={() => {
                onClose();
              }}
              size={30}
              color="rgb(65, 13, 91)"
            />
            <Title style={{margin:0,padding:0}} value="Atenção" />
          </div>
          <div
            style={{
              marginTop:"2rem",
              alignItems:"center",
              flexDirection:"column",
              justifyContent: "flex-end",
              display: "flex",
            }}
          >
            <h2 style={{padding:0,margin:"0 0 2rem 0"}}>{subtitle || "Deseja realmente remover?"}</h2>
            <Button
              onClick={() => {
                    deleteFunc();
                    onClose();
              }}
              label="Sim"
            />
          </div>
        </Paper>
        </Modal>
    )
}