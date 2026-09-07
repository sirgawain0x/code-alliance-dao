"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { useAppKitNetwork } from "@reown/appkit/react"
import { base, optimism } from "@reown/appkit/networks"

import {
  DEFAULT_SIBLING_DAO_ID,
  getDefaultSiblingDao,
  getSiblingDaoById,
  type SiblingDao,
} from "@/lib/sibling-daos"

const STORAGE_KEY = "creative-dao-active-sibling"

interface ActiveDaoContextValue {
  activeDao: SiblingDao
  setActiveDaoId: (id: string) => void
  isSwitchingNetwork: boolean
}

const ActiveDaoContext = createContext<ActiveDaoContextValue | null>(null)

function readStoredDaoId(): string {
  if (typeof window === "undefined") return DEFAULT_SIBLING_DAO_ID
  const stored = window.localStorage.getItem(STORAGE_KEY)
  return getSiblingDaoById(stored ?? "")?.id ?? DEFAULT_SIBLING_DAO_ID
}

export function ActiveDaoProvider({ children }: { children: ReactNode }) {
  const [activeDaoId, setActiveDaoIdState] = useState(DEFAULT_SIBLING_DAO_ID)
  const [isSwitchingNetwork, setIsSwitchingNetwork] = useState(false)
  const { switchNetwork } = useAppKitNetwork()

  useEffect(() => {
    setActiveDaoIdState(readStoredDaoId())
  }, [])

  const activeDao = useMemo(
    () => getSiblingDaoById(activeDaoId) ?? getDefaultSiblingDao(),
    [activeDaoId]
  )

  const setActiveDaoId = useCallback(
    async (id: string) => {
      const nextDao = getSiblingDaoById(id)
      if (!nextDao) return

      setActiveDaoIdState(nextDao.id)
      if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, nextDao.id)

      setIsSwitchingNetwork(true)
      try {
        await switchNetwork(nextDao.chainId === 10 ? optimism : base)
      } catch {
        // Wallet may reject network switch; DAO context still updates for read-only views.
      } finally {
        setIsSwitchingNetwork(false)
      }
    },
    [switchNetwork]
  )

  const value = useMemo(
    () => ({
      activeDao,
      setActiveDaoId,
      isSwitchingNetwork,
    }),
    [activeDao, isSwitchingNetwork, setActiveDaoId]
  )

  return <ActiveDaoContext.Provider value={value}>{children}</ActiveDaoContext.Provider>
}

export function useActiveDao() {
  const context = useContext(ActiveDaoContext)
  if (!context) throw new Error("useActiveDao must be used within ActiveDaoProvider")
  return context
}
