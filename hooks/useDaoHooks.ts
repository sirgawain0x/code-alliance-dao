"use client";

import { useContext } from "react";
import { DaoHooksContext } from "@/contexts/DaoHooksContext";

export function useDaoHooks() {
  const context = useContext(DaoHooksContext);
  
  if (!context) {
    throw new Error("useDaoHooks must be used within a DaoHooksProvider");
  }
  
  return context;
}
