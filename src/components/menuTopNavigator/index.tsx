import Paper from "../paper";

export default function MenuTopNavigator({
  ...props
}: {
  options?: Array<string>;
  actualRoute?: number;
  onChangeRoute?: (route: number) => void;
}) {
  return (
    <div
      style={{
        marginTop: "-2rem",
        marginBottom: "3rem",
        display: "flex",
        color: "#410D5B",
      }}
    >
      {props.options?.map((option, index) => {
        return (
          <div
            style={{ cursor: "pointer" }}
            onClick={() => {
              props.onChangeRoute && props.onChangeRoute(index);
            }}
          >
            <Paper
              style={{
                padding: "0.5rem",
                backgroundColor:
                  index === props.actualRoute ? "#D9D9D9" : "white",
                marginLeft: "1rem",
                borderRadius: "10px",
              }}
            >
              {option}
            </Paper>
          </div>
        );
      })}
    </div>
  );
}
