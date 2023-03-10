import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";

export default function ReactQueryWrapper({
  children,
}: {
  children: JSX.Element;
}) {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
