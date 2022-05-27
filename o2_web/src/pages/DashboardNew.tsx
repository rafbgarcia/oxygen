import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "../components/Button"
import { TextField } from "../components/TextField"
import { api } from "../lib/api"
import { Page } from "./Page"
import { useNavigate } from "react-router-dom"

const Form = ({ onSubmit, register, handleSubmit, waitingResponse }) => {
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField autoFocus label="Name" className="mb-5" register={register("name", { required: true })} />
      <Button loading={waitingResponse}>Save</Button>
    </form>
  )
}

export const DashboardNew = () => {
  const navigate = useNavigate()
  const { register, handleSubmit } = useForm()
  const [waiting, setWaiting] = useState(false)
  const [error, setError] = useState()
  const onSubmit = (data) => {
    setWaiting(true)
    api
      .createDashboard(data)
      .then(() => {
        setWaiting(false)
        navigate("/dashboards")
      })
      .catch((err) => {
        setWaiting(false)
        setError(err)
      })
  }

  return (
    <>
      <Page.Header>
        <Page.Title>New Dataset</Page.Title>
      </Page.Header>
      <Page.Main>
        <div className="container max-w-4xl m-auto p-4">
          <Form
            onSubmit={onSubmit}
            register={register}
            handleSubmit={handleSubmit}
            waitingResponse={waiting}
          />
          {error && <span className="text-sm text-gray-500">{JSON.stringify(error)}</span>}
        </div>
      </Page.Main>
    </>
  )
}
