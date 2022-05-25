import * as o2 from '../lib/o2'
import PivotTableChartIcon from '@mui/icons-material/PivotTableChart'
import Pivot from '../components/Pivot'
import { useEffect } from 'react'
import { useImmer } from 'use-immer'

const trashIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-5a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
)

const plusSmIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
)

const fns = ['COUNT', 'SUM', 'PERCENT']

const WidgetBuild = ({ fields, build, updateBuild }) => {
  const remove = (key, index) => () => {
    updateBuild((draft) => {
      draft[key].splice(index, 1)
    })
  }
  const add = (key) => () => {
    updateBuild((draft) => {
      draft[key].push({})
    })
  }
  return (
    <div className="w-3/12 h-screen px-4 py-8 overflow-y-auto bg-gray-100">
      <div className="border-b border-gray-200 pb-3 mb-3">
        <PivotTableChartIcon />
        Pivot
      </div>

      <div className="mb-3 pb-3 border-b-2 border-white">
        <p>Rows</p>
        {build.rows.map((row, i) => (
          <div key={row.field} className="flex justify-between items-center mb-1">
            <select className="w-full" defaultValue={row.field}>
              <option key="blank" value="blank">
                Select
              </option>
              {fields.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
            <a className="cursor-pointer" onClick={remove('rows', i)}>
              {trashIcon}
            </a>
          </div>
        ))}
        <a onClick={add('rows')} className="cursor-pointer px-3 py-1 border border-gray-500 bg-white flex w-min">
          <span>Add</span>
          <span>{plusSmIcon}</span>
        </a>
      </div>

      {/**
       * Values
       **/}
      <div className="mb-3 pb-3 border-b-2 border-white">
        <p>Values</p>
        {build.values.map((value, i) => (
          <div key={value.fn + value.field} className="flex justify-between items-center mb-1">
            <select className="w-4/12 mr-1" defaultValue={value.fn}>
              {fns.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
            <select className="w-8/12" defaultValue={value.field}>
              {fields.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
            <a className="cursor-pointer" onClick={remove('values', i)}>
              {trashIcon}
            </a>
          </div>
        ))}
        <a onClick={add('rows')} className="cursor-pointer px-3 py-1 border border-gray-500 bg-white flex w-min">
          Add {plusSmIcon}
        </a>
      </div>

      <div className="mb-3 pb-3 border-b-2 border-white">
        <p>Columns</p>
        {build.columns.map((column, i) => (
          <div key={column.field} className="flex justify-between items-center mb-1">
            <select className="w-full" defaultValue={column.field}>
              <option key="blank" value="blank">
                Select
              </option>
              {fields.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
            <a className="cursor-pointer" onClick={remove('columns', i)}>
              {trashIcon}
            </a>
          </div>
        ))}
        <a onClick={add('columns')} className="cursor-pointer px-3 py-1 border border-gray-500 bg-white flex w-min">
          Add {plusSmIcon}
        </a>
      </div>
    </div>
  )
}

export const Widget = () => {
  const { data, error } = o2.getWidget(1)
  const [build, updateBuild] = useImmer({ rows: [], columns: [], values: [] })

  useEffect(() => {
    if (!!data) {
      updateBuild(data.build)
    }
  }, [!!data])

  if (error) return <p>{'Error: ' + error}</p>
  if (!data) return <p>Loading...</p>

  const fields = data.dataset.fields.map((field) => field.name)

  return (
    <div className="flex">
      <WidgetBuild fields={fields} build={build} updateBuild={updateBuild} />
      <div className="w-9/12 h-screen px-4 py-8 overflow-y-auto overflow-x-auto shadow-md">
        <Pivot meta={data.meta} theme={{}} />
      </div>
      {/* <div className="w-96 h-screen px-4 py-8 overflow-y-auto bg-gray-100"></div> */}
    </div>
  )
}
