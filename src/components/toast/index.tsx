import "./styles.css";
import React, {
  CSSProperties,
  memo,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { v4 } from "uuid";

type ToastContextValues = {
  toastCall: (msg: string, time?: number) => void;
  toastCallTopRight: (
    text: string,
    time?: number,
    style?: CSSProperties,
    cb?: () => void
  ) => void;
};
const initialValues: ToastContextValues = {
  toastCall: () => "",
  toastCallTopRight: () => "",
};

export const toastContext =
  React.createContext<ToastContextValues>(initialValues);
export const useToast = () => React.useContext(toastContext);
const ToastProvider: React.FC<PropsWithChildren> = memo(
  ({ children }: PropsWithChildren) => {
    const uidGenerator = useCallback(() => {
      return v4();
    }, []);
    const [visibilityBotton, setVisibilityBotton] = useState(false);
    const panicCallback = useRef<() => void | undefined>();
    const message = useRef<string>("");
    const [topRightMessages, setTopRightMessages] = useState<
      Record<
        string,
        {
          text: string;
          isVisible: boolean;
          fadein: boolean;
          style?: CSSProperties;
          cb: () => void;
        }
      >
    >({});
    const toastCall = useCallback((text: string, time = 3000) => {
      setVisibilityBotton(true);
      message.current = text;
      setTimeout(() => {
        setVisibilityBotton(false);
      }, time);
    }, []);
    const toastCallTopRight = useCallback(
      (
        text: string,
        time = 3000,
        style: CSSProperties = {},
        cb = () => {
          return;
        }
      ) => {
        const newMessage = {
          text,
          isVisible: true,
          fadein: true,
          style,
          cb,
        };
        if (time < 2000) {
          time = 2000;
        }
        const id = uidGenerator();
        setTopRightMessages((last) => {
          return { [id]: newMessage, ...last };
        });
        const timer0 = setTimeout(() => {
          setTopRightMessages((last) => {
            const cloneValue = { ...last };
            cloneValue[id].fadein = false;
            return cloneValue;
          });
        }, 600);
        const timer1 = setTimeout(() => {
          setTopRightMessages((last) => {
            const cloneValue = { ...last };
            console.info(last, id);
            cloneValue[id].isVisible = false;
            return cloneValue;
          });
          const timer2 = setTimeout(() => {
            setTopRightMessages((last) => {
              const { [id]: remove, ...rest } = last;
              remove.cb();
              return rest;
            });
            return () => clearTimeout(timer2);
          }, 500);
        }, time);
        return () => {
          clearTimeout(timer1);
          clearTimeout(timer0);
        };
      },
      []
    );
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
            transform: "translate(-30%,0)",
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
          style={{
            marginLeft: "-4rem",

            position: "fixed",

            zIndex: 999999999,
            top: "1rem",

            right: "5rem",
            transform: "translate(2rem,1rem)",
            display: "flex",
            flexDirection: "column",
            rowGap: "1rem",
          }}
        >
          {Object.values(topRightMessages).map((message) => (
            <div
              className={
                message.fadein
                  ? "toast-top-right-fadein"
                  : !message.isVisible
                  ? "toast-top-right-fadeout"
                  : ""
              }
              style={{
                backgroundColor: "rgba(51,51,51,1)",
                position: "relative",
                marginLeft: "auto",
                maxWidth: "fit-content",
                padding: "1rem 1rem 1rem 1rem ",
                color: "white",
                alignSelf: "right",
                fontSize: "17px",
                textAlign: "center",
                borderRadius: "2px",
                ...message.style,
              }}
            >
              <span>{message.text}</span>
            </div>
          ))}
        </div>
        {useMemo(
          () => (
            <toastContext.Provider value={{ toastCall, toastCallTopRight }}>
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
