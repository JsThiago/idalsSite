import { useContext, useState } from "react";
import Button from "../../components/button";
import Modal from "../../components/modal";
import Paper from "../../components/paper";
import CustomSelect from "../../components/select";
import Switch from "../../components/switch";
import Table from "../../components/table";
import Title from "../../components/title";
import { toastContext } from "../../components/toast";

export default function Vinculos() {
  const [openModal, setOpenModal] = useState(false);
  const toastCall = useContext(toastContext).toastCall as Function;
  return (
    <>
      <Modal visibility={openModal}>
        <Paper
          style={{
            display: "flex",
            width: "50rem",
            height: "30rem",
            flexDirection: "column",
            borderRadius: "2px",
            paddingBottom: "2rem",
            boxShadow: "1px 1px 4px rgba(0,0,0,0.3)",
          }}
        >
          <div style={{ padding: "2rem" }}>
            <Title value="Adicionar vínculo" />
            <div style={{ margin: "3rem 5rem 0 5rem" }}>
              <CustomSelect
                label="Nome"
                style={{
                  border: "1px solid #979797",
                  borderRadius: "16px",
                  marginBottom: "2rem",
                }}
              />
              <CustomSelect
                label="ID"
                style={{ border: "1px solid #979797", borderRadius: "16px" }}
              />
            </div>
          </div>
          <div
            style={{
              padding: "2rem",

              justifyContent: "flex-end",
              display: "flex",
            }}
          >
            <Button
              onClick={() => {
                toastCall("Vínculo adicionado com sucesso");
                setOpenModal(false);
              }}
              label="Salvar"
            />
          </div>
        </Paper>
      </Modal>

      <Paper
        style={{
          display: "flex",
          padding: "1rem 0rem 3rem 0rem",
          flexDirection: "column",
          boxShadow: "0.5px 0.5px 1px rgba(0,0,0,0.05)",
        }}
      >
        <div style={{ marginBottom: "3rem" }}>
          <Title value="Vínculos" />
        </div>
        <div style={{ padding: "0 3rem" }}>
          <Table
            rows={[
              [<Switch checked={true} />, "Felipe Teixeira", "U45F4S1J"],
              [<Switch checked={true} />, "Matheus Aluno", "U45F4S2J"],
              [<Switch checked={true} />, "Marko Aurélio", "U45F4S3J"],
              [<Switch checked={false} />, "Exemplo", "U45F4S4J"],
            ]}
            columns={[
              { name: "Status", size: 0.5 },
              { name: "Nome do funcionário", size: 1 },
              { name: "Matrícula", size: 1 },
            ]}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            padding: "2rem",

            marginTop: "4rem",
          }}
        >
          <Button
            onClick={() => {
              setOpenModal(true);
            }}
            style={{
              backgroundColor: "white",
              border: "1px solid #410D5B",
              color: "#410D5B",
              textAlign: "center",
              minWidth: "10rem",
              marginRight: "5rem",
            }}
            label="Adicionar vínculo"
          />
          <Button
            label="Salvar"
            onClick={() => {
              toastCall("Vínculos salvos");
            }}
          />
        </div>
      </Paper>
    </>
  );
}
