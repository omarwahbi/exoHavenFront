"use client";

import { createContext, useContext } from "react";
import { NO_SALE } from "@/utils/saleUtils";

// The sale settings, fetched once by the root layout on the server.
const SaleContext = createContext(NO_SALE);

export const SaleProvider = ({ sale, children }) => (
  <SaleContext.Provider value={sale}>{children}</SaleContext.Provider>
);

export const useSale = () => useContext(SaleContext);
