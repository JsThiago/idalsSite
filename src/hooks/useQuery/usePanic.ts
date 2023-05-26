import { useEffect, useState } from "react";
import { useQuery as query, useMutation, useQueryClient } from "react-query";
import { BodyPanics, DataPanics, Panics, PostFuncionario } from "../../types";
import { getPanics, updatePanic as _updatePanic } from "./api";

export default function usePanic({
  onSuccess,
  body,
  query,
  onSuccessUpdate,
  isAuth,
}: {
  onSuccess?: (data: Array<Panics>) => void;
  body?: BodyPanics;
  query?: string;
  onSuccessUpdate?: (data: DataPanics) => void | Promise<void>;
  isAuth?: boolean;
}) {
  const [panicos, setPanicos] = useState<Array<DataPanics>>([]);
  const {
    mutate: mutateUpdate,
    isLoading: isLoadingUpdate,
    isError: isErrorUpdate,
  } = useMutation(
    ({ body, id }: { body: Partial<DataPanics>; id: string | number }) =>
      _updatePanic(id, body)
  );
  const { mutate, isLoading, isError } = useMutation(
    ({ body, query }: { body: BodyPanics; query: string }) =>
      getPanics(body, query)
  );
  function updatePanic(id: string | number, body: Partial<DataPanics>) {
    mutateUpdate(
      { body, id },
      {
        onSuccess: async (data) => {
          await onSuccessUpdate?.(data);
        },
      }
    );
    return { isLoading: isLoadingUpdate, isError: isErrorUpdate };
  }
  useEffect(() => {
    if (!isAuth) return;
    mutate(
      { body: body || { areas: [], funcionarios: [] }, query: query || "" },
      {
        onSuccess: (data: Array<DataPanics>) => {
          const dataTratado: Array<Panics> = data.map((panico) => {
            return {
              cracha: panico.identificador_cracha,
              date: panico.date,
              funcionario: panico.nome_funcionario,
              id: panico.id,
              localizacao: panico.localizacao,
              tratado: panico.tratado,
              areas: [
                {
                  f1: -1,
                  f2: panico.area,
                },
              ],
              login_confirmacao: panico.login_confirmacao,
              telefone: panico.telefone,
              date_confirmacao: panico.date_confirmacao,
            };
          });
          onSuccess?.(dataTratado);
          setPanicos(data);
        },
      }
    );
  }, [isAuth]);

  return { data: panicos, isLoading, isError, updatePanic };
}
