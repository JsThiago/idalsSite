import { stopPropagation } from "ol/events/Event";
import { relative } from "path";
import React, {
  LegacyRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import Button from "../button";
import "./styles.css";
const REGEX_MINUTES = new RegExp(/^([1-5]?[0-9]|0)$/);

const REGEX_HOURS = new RegExp(/^(\d|1\d|2[0-3])$/);
export default function Timepicker({
  ...props
}: {
  defaultValue?: string;
  onClick?: (value: string) => void;
  onChange?: (e: any) => void;
  type?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  useEffect(() => {
    return () => {
      document.removeEventListener("click", () => {});
    };
  }, []);
  const pickerRef = useRef<HTMLDivElement>();
  const [hour, setHour] = useState<string | number>(
    props?.defaultValue ? +props?.defaultValue?.split(":")[0] : 0
  );
  const [minutes, setMinutes] = useState<string | number>(
    props?.defaultValue ? +props?.defaultValue?.split(":")[1] : 0
  );
  const [finalHour, setFinalHour] = useState<string>(
    props.defaultValue as string
  );
  const endEdit = () => {
    let finalHourArray = finalHour.split(":");
    if (minutes < 10) {
      finalHourArray[1] = `0${minutes}`;
    } else finalHourArray[1] = minutes.toString();
    if (+hour < 10) {
      finalHourArray[0] = `0${hour}`;
    } else finalHourArray[0] = hour.toString();
    const finalHourEdited = finalHourArray.join(":");
    setFinalHour(finalHourEdited);
    return finalHourEdited;
  };
  const documentEventCallback = useCallback((e: Event) => {
    if (
      !e.composedPath().includes(pickerRef.current as any) &&
      pickerRef.current?.style.visibility === "visible"
    ) {
      pickerRef.current.style.visibility = "hidden";

      e.stopPropagation();
      document.removeEventListener("click", documentEventCallback);
    }
  }, []);
  return (
    <div style={{ position: "relative" }}>
      <div
        className="timepicker-input"
        id="timepicker-input"
        onClick={(e) => {
          if (
            pickerRef.current?.style.visibility === "hidden" ||
            pickerRef.current?.style.visibility === ""
          ) {
            console.log("oi");
            pickerRef.current.style.visibility = "visible";
            setTimeout(() => {
              document.addEventListener("click", documentEventCallback);
            }, 100);
            console.log(pickerRef.current.style.visibility);
          } else if (pickerRef.current) {
            document.removeEventListener("click", documentEventCallback);
            pickerRef.current.style.visibility = "hidden";
          }
        }}
        style={{
          height: "1rem",
          width: "2.6rem",
          backgroundColor: "white",
          textAlign: "center",
          position: "relative",
          display: "flex",
          alignItems: "flex",
          justifyContent: "center",
          border: "0.5px solid rgba(0,0,0,0.5)",
          borderRadius: "3px",
          padding: "0.4rem",
        }}
      >
        {finalHour}
      </div>

      <div
        ref={pickerRef as LegacyRef<HTMLDivElement>}
        style={{
          display: "flex",
          justifyContent: "space-around",
          flexDirection: "column",
          padding: "1rem",
        }}
        className="picker"
        id="picker"
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            flex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <IoIosArrowUp
              onClick={() => {
                if (+hour + 1 > 23) setHour(0);
                else setHour(+hour + 1);
              }}
              style={{ cursor: "pointer" }}
              size={30}
              color="rgb(65, 13, 91)"
            />
            <input
              max={23}
              value={hour}
              onChange={(e) => {
                const value = e.target.value;

                if (REGEX_HOURS.test(value) || value === "") setHour(value);
              }}
              maxLength={2}
              style={{
                maxWidth: "1rem",
                outline: 0,
                border: "1px solid rgba(0,0,0,0.5)",
                marginTop: "0.3rem",
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                verticalAlign: "center",
                lineHeight: "2rem",
                borderRadius: "6px",
                padding: "0 0.5rem",
                marginBottom: "0.3rem",
              }}
            />
            <IoIosArrowDown
              onClick={() => {
                if (+hour - 1 < 0) {
                  setHour(23);
                } else setHour(+hour - 1);
              }}
              style={{ cursor: "pointer" }}
              size={30}
              color={"rgb(65, 13, 91)"}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <IoIosArrowUp
              onClick={() => {
                if (+minutes + 1 >= 60) setMinutes(0);
                else setMinutes(+minutes + 1);
              }}
              style={{ cursor: "pointer" }}
              color="rgb(65, 13, 91)"
              size={30}
            />
            <input
              maxLength={2}
              onChange={(e) => {
                const value = e.target.value;

                if (REGEX_MINUTES.test(value) || value === "")
                  setMinutes(value);
              }}
              style={{
                maxWidth: "1rem",
                outline: 0,
                border: "1px solid rgba(0,0,0,0.5)",
                marginTop: "0.3rem",
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                verticalAlign: "center",
                padding: "0 0.5rem",
                lineHeight: "2rem",
                borderRadius: "6px",
                marginBottom: "0.3rem",
              }}
              value={minutes}
            />
            <IoIosArrowDown
              onClick={() => {
                if (+minutes - 1 < 0) {
                  setMinutes(59);
                } else setMinutes(+minutes - 1);
              }}
              style={{ cursor: "pointer" }}
              color={"rgb(65, 13, 91)"}
              size={30}
            />
          </div>
        </div>

        <Button
          onClick={() => {
            document.removeEventListener("click", documentEventCallback);
            pickerRef.current!.style.visibility = "hidden";
            props.onChange && props.onChange(endEdit());
          }}
          style={{ marginTop: "1rem" }}
          label="Editar"
        />
      </div>
    </div>
  );
}
