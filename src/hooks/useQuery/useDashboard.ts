import { getDashboard as _getDashboard } from "./api";
import { useMutation } from "react-query";
import { BodyBigData, DataBigDataStatus } from "../../types";
import { useCallback, useEffect, useState } from "react";
export default function useDashboard(
  areas: BodyBigData["areas"],
  query: string
) {
  const [data, setData] = useState<DataBigDataStatus>({
    areas: {},
    total: [{ count: "0" }],
  });
  const getBigDataDataStatusMutation = useMutation(
    async ({ body, query }: { body: BodyBigData; query?: string }) => {
      return (await _getDashboard({ areas }, query)) || [];
    }
  );

  const { isError, isLoading, mutate } = getBigDataDataStatusMutation;
  useEffect(() => {
    mutate(
      { body: { areas }, query },
      {
        onSuccess: (newData: DataBigDataStatus) => {
          setData(newData);
        },
        onError: (e) => {
          console.log(e);
        },
      }
    );
  }, [areas, query]);

  return {
    isError,
    isLoading,
    data: data as DataBigDataStatus,
  };
}
