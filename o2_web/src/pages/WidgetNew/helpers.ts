import { useEffect } from "react"

export const componentDidMount = (cb) => useEffect(cb, [])
