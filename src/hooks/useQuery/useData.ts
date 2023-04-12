import { getDataStatus as _getDataStatus } from "./api";
import { useMutation } from "react-query";
import {
  BodyBigData,
  BodyDataStatus,
  DataDataStatus,
  DataDataStatusTratada,
} from "../../types";
import { useCallback, useEffect, useState } from "react";
export default function useData(
  areas: BodyDataStatus["areas"],
  query: string = ""
) {
  const [data, setData] = useState<Array<DataDataStatusTratada>>([]);
  const getDataStatusMutation = useMutation(
    async ({ body, query }: { body: BodyDataStatus; query?: string }) => {
      return (await _getDataStatus(body, query)) || [];
    }
  );

  const { isError, isLoading, mutate } = getDataStatusMutation;
  useEffect(() => {
    mutate(
      { body: { areas }, query },
      {
        onSuccess: (newData: Array<DataDataStatusTratada>) => {
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
    data: data as Array<DataDataStatusTratada>,
  };
}
