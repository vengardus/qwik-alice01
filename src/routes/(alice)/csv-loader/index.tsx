import { component$ } from "@builder.io/qwik";
import { Form, routeAction$ } from "@builder.io/qwik-city";
import csv from 'csvtojson'

export const useSubmit = routeAction$(async (form, requestEvent) => {
  const formData = await requestEvent.request.formData()

  const file = formData.get('upload') as File

  if (!file.size) return { success: false }

  const fileContent = await file.text()

  const data = await csv().fromString(fileContent)

  data.forEach(row => console.log(row.name))


  return {
    success: true
  }
})


export default component$(() => {

  const actionSubmit = useSubmit()

  return (
    <div>
      <h1>CSV Loader</h1>

      <Form action={actionSubmit}>
        <input type="file" name="upload" accept=".csv" />
        <button type="submit">Cargar</button>
      </Form>
    </div>
  )
});