import React, { ComponentPropsWithoutRef, PropsWithChildren } from "react";
type GlobalContextValues = {};
const initialValues: GlobalContextValues = {};
export const GlobalContext = React.createContext<GlobalContextValues>({});

const GlobalContextWrapper: React.FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  return (
    <GlobalContext.Provider value={initialValues}>
      {children}
    </GlobalContext.Provider>
  );
};
export default GlobalContextWrapper;
