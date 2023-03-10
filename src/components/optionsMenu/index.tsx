import Paper from "../paper";
import CustomSelect from "../select";
import Timepicker from "../timepicker";
import "./styles.css";
import DatePicker from "../datePicker";
export default function OptionsMenu({
  ...props
}: {
  style?: React.CSSProperties;
  options: Array<{
    name: string;
    type: "date" | "selection" | "time";
    ops?: Array<{ label: string; value: string | number }>;
    value: any;
    onChange?: (user: string) => void;
  }>;
}) {
  function Time({
    value,
    name,
    onChange,
  }: {
    value?: string;
    name: string;
    onChange?: (time: string) => void;
  }) {
    return (
      <Paper
        style={{
          maxWidth: "fit-content",
          padding: "1.5rem 1rem",
          display: "flex",
          borderRadius: "0.5rem",
          boxShadow: "1px 1px 8px rgba(0,0,0,.25)",
          alignItems: "center",
        }}
      >
        <span style={{ marginRight: "1rem" }}>{name}</span>
        <Timepicker
          defaultValue={value}
          onChange={(value) => {
            onChange && onChange(value);
          }}
          type="time"
          className="without-ampm"
          style={{ padding: "0.2rem 0" }}
        />
      </Paper>
    );
  }
  function DateComponent({
    value,
    name,
    onChange,
  }: {
    value?: string;
    name: string;
    onChange?: (value: string) => void;
  }) {
    return (
      <Paper
        style={{
          maxWidth: "fit-content",
          padding: "1.5rem 1rem",
          display: "flex",
          borderRadius: "0.5rem",
          boxShadow: "1px 1px 8px rgba(0,0,0,.25)",
          alignItems: "center",
        }}
      >
        <DatePicker
          defaultValue={value}
          label={name}
          id={name}
          style={{ padding: "0.2rem 0" }}
          onChange={(newValue) => {
            onChange && onChange(newValue);
          }}
        />
      </Paper>
    );
  }
  function Selection({
    value,
    name,
    options,
    onChange,
  }: {
    value?: string;
    name: string;
    options: Array<{ label: string; value: string }>;
    onChange: (user: string) => void;
  }) {
    return (
      <Paper
        style={{
          maxWidth: "fit-content",
          padding: "1.5rem 1rem",
          display: "flex",
          borderRadius: "0.5rem",
          boxShadow: "1px 1px 8px rgba(0,0,0,.25)",
          alignItems: "center",
        }}
      >
        <span style={{ marginRight: "0.5rem" }}>{name}</span>
        <CustomSelect
          value={value}
          onChange={(user) => {
            console.log("func:" + onChange);
            onChange && onChange(user);
          }}
          style={{
            display: "flex",
            flexDirection: "row",
            padding: "0.2rem 2rem",
          }}
          options={options}
        />
      </Paper>
    );
  }
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        columnGap: "1rem",
        justifyContent: "space-between",
        alignItems: "center",
        ...props.style,
      }}
    >
      {props.options.map((op) => {
        if (op.type === "date")
          return (
            <DateComponent
              onChange={op.onChange}
              value={op.value as string}
              name={op.name}
            />
          );
        else if (op.type === "time")
          return (
            <Time value={op.value} name={op.name} onChange={op.onChange} />
          );
        else if (op.type === "selection")
          return (
            <Selection
              onChange={op.onChange as () => void}
              value={op.value}
              name={op.name}
              options={op.ops as Array<{ label: string; value: string }>}
            />
          );
        return <></>;
      })}
    </div>
  );
}
