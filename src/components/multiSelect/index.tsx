import { LegacyRef, useEffect, useRef, useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { useToast } from "../toast";
function OptionSelected({
  ...props
}: {
  op: string | number;
  onRemove?: () => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0.5rem",
        background: "rgba(0, 0, 0, 0.08)",
        borderRadius: "16px",
        columnGap: "0.4rem",
        textAlign: "center",
      }}
    >
      <span>{props.op}</span>
      <RxCross2
        style={{ cursor: "pointer" }}
        onClick={(e) => {
          e.stopPropagation();
          props.onRemove && props.onRemove();
        }}
      />
    </div>
  );
}
function Option({ ...props }: { op: string }) {
  return (
    <div
      style={{
        display: "flex",

        height: "fit-content",
        maxWidth: "100%",
        padding: "0.5rem",
        margin: "0 0.5rem",
        marginTop: "0.5rem",
      }}
    >
      <span
        style={{
          marginLeft: "1rem",
        }}
      >
        {props.op}
      </span>
    </div>
  );
}
export default function MultiSelect({
  options = {},
  selected = {},
  onSelect,
  onRemove,
  onRemoveAll,
  onSelectAll,
  limit = 10,
  ...props
}: {
  options?: Record<string | number, string | number>;
  selected?: Record<string | number, string | number>;
  onSelect?: (selected: [string | number, string | number]) => void;
  onRemove?: (removed: [string | number, string | number]) => void;
  onRemoveAll?: () => void;
  onSelectAll?: () => void;
  limit?: number;
}) {
  const inputRef = useRef<HTMLDivElement>();

  function generateSelected() {
    const optionsArray: Array<[string | number, string | number]> = [];
    Object.entries(selected).forEach(([key, value], index) => {
      optionsArray.push([key, value]);
    });

    return optionsArray;
  }

  function generateOptions() {
    const optionsArray: Array<[string | number, string | number]> = [];
    if (!("todos" in selected)) optionsArray.push(["todos", "Todos"]);
    Object.entries(options).forEach(([key, value], index) => {
      if (key in selected) return;
      optionsArray.push([key, value]);
    });
    return optionsArray;
  }

  return (
    <div
      onClick={() => {
        if (inputRef.current && inputRef.current.style.visibility === "hidden")
          inputRef.current.style.visibility = "visible";
        else if (inputRef.current) inputRef.current.style.visibility = "hidden";
      }}
      style={{
        border: "1px solid rgba(0,0,0,0.2)",
        minWidth: "5rem",
        flex: 1,

        borderRadius: "4px",

        minHeight: "2rem",
        position: "relative",

        flexDirection: "row",
        display: "flex",

        alignItems: "center",
        padding: "0.5rem 0rem .5rem .5rem",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          rowGap: "0.5rem",
          columnGap: "0.3rem",
          minWidth: "90%",
          flex: 1,
        }}
      >
        {generateSelected().map((value, index) => {
          return (
            <OptionSelected
              onRemove={() => onRemove && onRemove(value)}
              op={value[1]}
            />
          );
        })}
      </div>
      <div style={{ flex: 0.3 }}>
        {Object.keys(selected).length >= 1 && (
          <RxCross2
            color="rgba(0,0,0,0.5)"
            onClick={(e) => {
              e.stopPropagation();
              onRemoveAll && onRemoveAll();
            }}
            style={{ cursor: "pointer", fontSize: "30px", marginLeft: "auto" }}
          />
        )}
        <IoMdArrowDropdown
          color="rgba(0,0,0,0.5)"
          style={{
            right: "0.5rem",
            fontSize: "30px",
            marginLeft: "auto",
          }}
        />
      </div>

      <div
        ref={inputRef as LegacyRef<HTMLDivElement>}
        style={{
          backgroundColor: "white",
          position: "absolute",
          height: "fit-content",

          paddingBottom: "1rem",
          zIndex: 999,
          maxHeight: "200px",
          width: "100%",
          top: "100.9%",
          flexDirection: "column",
          borderRadius: "0 0px 16px 16px",
          boxShadow: "0.1px 0.1px  1px 0.5px rgba(0,0,0,0.2)",
          display: "flex",
          visibility: "hidden",
          overflow: "scroll",
          right: 0,
        }}
      >
        {generateOptions().map((value) => {
          return (
            <div
              onClick={() => {
                console.info(value);
                if (value[0] === "todos") {
                  onSelectAll && onSelectAll();
                  return;
                }
                onSelect && onSelect(value);
              }}
              style={{
                display: "flex",
                cursor: "pointer",
                height: "fit-content",
                maxWidth: "100%",
                padding: "0.5rem",
                margin: "0 0.5rem",
                marginTop: "0.5rem",
              }}
            >
              <span
                style={{
                  marginLeft: "1rem",
                }}
              >
                {value[1]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
