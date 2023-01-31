export default function Table({
  ...props
}: {
  columns: Array<{ name: any; size: number; style?: React.CSSProperties }>;
  rows: Array<Array<any>>;
}) {
  return (
    <table
      style={{
        backgroundColor: "#F0F0F0",
        justifyContent: "center",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <thead>
        <tr
          style={{
            display: "flex",
            color: "#410D5B",
            fontFamily: "Inter",
            fontSize: "20px",
            alignItems: "center",
            marginBottom: "1rem",

            marginTop: "1rem",
          }}
        >
          {props.columns?.map((column) => (
            <th
              style={{
                flex: column.size,
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
              }}
            >
              {column.name}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {props.rows.map((row, index) => {
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
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      flex: props.columns[index].size,
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
  );
}
