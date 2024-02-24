import React from "react"
import styles from "./TableCells.module.css"
import classNames from "classnames"

export type Status = "active" | "cancelled" | undefined

interface TdProps {
  status?: Status
  children?: React.ReactNode
}

const Th = ({ children }: { children: any }) => {
  return <div className={styles.th}>{children}</div>
}

const Td: React.FC<TdProps> = ({ status, children }) => {
  const classname = classNames(styles.td, {
    [styles.active]: status === "active",
    [styles.cancelled]: status === "cancelled"
  })

  return <div className={status ? classname : styles.td}>{children}</div>
}

const Tr = ({ children }: { children: any }) => {
  return <div className={styles.tr}>{children}</div>
}

export { Th, Td, Tr }
