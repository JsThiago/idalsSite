import { useMutation } from "react-query";
import { BodyLogin, DataLogin } from "../../types";
import { login as _login } from "./api";

export default function useLogin() {
  const mutateLogin = useMutation(_login);

  function login(
    body: BodyLogin,
    cb: (data: DataLogin) => void | Promise<void>,
    cbErr?: (err: unknown, body: BodyLogin, context: unknown) => void
  ) {
    try {
      console.debug("login");
      const { mutate, data, error, isLoading } = mutateLogin;
      mutate(body, {
        onSuccess: async (data: DataLogin) => {
          await cb(data);
        },
        onError: (err, body, context) => {
          cbErr?.(err, body, context);
        },
      });
    } catch (e) {
      console.error("err", e);
      throw e;
    }
  }

  return login;
}
