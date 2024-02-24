import React from "react"
import styles from "./Table.module.css"

const Table = ({ children }: { children: any }) => {
  return <div className={styles.table}>{children}</div>
}

const THead = ({ children }: { children: any }) => {
  return <div className={styles.head}>{children}</div>
}

const TBody = ({ children }: { children: any }) => {
  return <div className={styles.body}>{children}</div>
}

export { Table, THead, TBody }
