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
  toastCall: (msg: string) => void;
};
const initialValues: ToastContextValues = {
  toastCall: () => "",
};

export const toastContext =
  React.createContext<ToastContextValues>(initialValues);
export const useToast = () => React.useContext(toastContext);
const ToastProvider: React.FC<PropsWithChildren> = memo(
  ({ children }: PropsWithChildren) => {
    const [visibility, setVisibility] = useState(false);
    const message = useRef<string>("");
    const toastCall = useCallback((text: string) => {
      setVisibility(true);
      message.current = text;
      setTimeout(() => {
        setVisibility(false);
      }, 3000);
    }, []);
    return (
      <div style={{ display: "flex", flex: 1 }}>
        <div
          className={visibility ? "toast" : ""}
          style={{
            visibility: visibility ? "visible" : "hidden",
            backgroundColor: "rgba(51,51,51,1)",
            position: "fixed",
            minWidth: "3rem",
            marginLeft: "-4rem",
            padding: "1rem 1rem 1rem 1rem ",
            bottom: "3%",
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
        {useMemo(
          () => (
            <toastContext.Provider value={{ toastCall }}>
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
