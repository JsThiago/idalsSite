import "./styles.css";
import React, {
  memo,
  PropsWithChildren,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
type ToastContextValues = {
  toastCall: (msg: string, time?: number) => void;
  toastCallTopRight: (msg: string, time?: number) => void;
};
const initialValues: ToastContextValues = {
  toastCall: () => "",
  toastCallTopRight: () => ""
};

export const toastContext =
  React.createContext<ToastContextValues>(initialValues);
export const useToast = () => React.useContext(toastContext);
const ToastProvider: React.FC<PropsWithChildren> = memo(
  ({ children }: PropsWithChildren) => {
    const [visibilityBotton, setVisibilityBotton] = useState(false);
    const [visibilityTopRight, setVisibilityTopRight] = useState(false);
    const message = useRef<string>("");
    const toastCall = useCallback((text: string, time = 3000) => {
      setVisibilityBotton(true);
      message.current = text;
      setTimeout(() => {
        setVisibilityBotton(false);
      }, time);
    }, []);
    const toastCallTopRight = useCallback((text: string, time = 3000) => {
      setVisibilityTopRight(true);
      message.current = text;
      setTimeout(() => {
        setVisibilityTopRight(false);
      }, time);
    }, []);
    return (
      <div style={{ display: "flex", flex: 1 }}>
        <div
          className={visibilityBotton ? "toast" : ""}
          style={{
            visibility: visibilityBotton ? "visible" : "hidden",
            backgroundColor: "rgba(51,51,51,1)",
            position: "fixed",
            minWidth: "3rem",
            marginLeft: "-4rem",
            padding: "1rem 1rem 1rem 1rem ",
            bottom: "3%",
            transform:"translate(-30%,0)",
            left: "50%",
            color: "white",
            zIndex: 9999999,
            fontSize: "17px",
            textAlign: "center",
            borderRadius: "2px",
          }}
        >
          <span>{message.current}</span>
        </div>
        <div
          className={visibilityTopRight ? "toast-top-right" :"" }
          style={{
            visibility:visibilityTopRight ? "visible":"hidden",
            backgroundColor: "rgba(51,51,51,1)",
            position: "fixed",
            minWidth: "3rem",
            marginLeft: "-4rem",
            padding: "1rem 1rem 1rem 1rem ",
            top: "3%",
            transform:"translate(-30%,0)",
            right: "3%",
            color: "white",
            zIndex: 9999999,
            fontSize: "17px",
            textAlign: "center",
            borderRadius: "2px",
          }}
        >
          <span>{message.current}</span>
        </div>
        {useMemo(
          () => (
            <toastContext.Provider value={{ toastCall,toastCallTopRight }}>
              {children}
            </toastContext.Provider>
          ),
          [toastCall, children]
        )}
      </div>
    );
  }
);
export default ToastProvider;
