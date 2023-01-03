import Paper from "../paper";
import CustomSelect from "../select";
export default function OptionsMenu({
  ...props
}: {
  options: Array<{
    name: string;
    type: "date" | "selection" | "time";
    ops?: Array<{ label: string; value: string | number }>;
    value: any;
  }>;
}) {
  function Time({ value, name }: { value?: string; name: string }) {
    return (
      <Paper
        style={{
          maxWidth: "fit-content",
          padding: "0.5rem 1rem",
          display: "flex",
          borderRadius: "0.5rem",
          boxShadow: "1px 1px 8px rgba(0,0,0,.25)",
          alignItems: "center",
        }}
      >
        <span style={{ marginRight: "1rem" }}>{name}</span>
        <input type="time" style={{ padding: "0.2rem 0" }} />
      </Paper>
    );
  }
  function Date({ value, name }: { value?: string; name: string }) {
    return (
      <Paper
        style={{
          maxWidth: "fit-content",
          padding: "1rem 1rem",
          display: "flex",
          borderRadius: "0.5rem",
          boxShadow: "1px 1px 8px rgba(0,0,0,.25)",
          alignItems: "center",
        }}
      >
        <span style={{ marginRight: "1rem" }}>{name}</span>
        <input type="date" value={value} style={{ padding: "0.2rem 0" }} />
      </Paper>
    );
  }
  function Selection({
    value,
    name,
    options,
  }: {
    value?: string;
    name: string;
    options: Array<{ label: string; value: string }>;
  }) {
    return (
      <Paper
        style={{
          maxWidth: "fit-content",
          padding: "1rem 1rem",
          display: "flex",
          borderRadius: "0.5rem",
          boxShadow: "1px 1px 8px rgba(0,0,0,.25)",
          alignItems: "center",
        }}
      >
        <span style={{ marginRight: "0.5rem" }}>{name}</span>
        <CustomSelect
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
        alignItems: "center",
      }}
    >
      {props.options.map((op) => {
        if (op.type === "date")
          return <Date value={op.value as string} name={op.name} />;
        else if (op.type === "time")
          return <Time value={op.value} name={op.name} />;
        else if (op.type === "selection")
          return (
            <Selection
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
