import SharedModule from "../../shared";
import React, { useEffect } from "react"
import { Button } from "antd"
import { useHistory } from "react-router-dom"

export default () => {
  const history = useHistory()

  useEffect(() => {
    const shared = SharedModule.getShared()
    const token = shared.getToken()
    if (!token) {
      history.push("/")
    }
    console.log("我是通过shared通信获取的token:", token)
  }, [history])
  return (
    <div>
      <Button >我是shared通信</Button>
    </div>
  )
}