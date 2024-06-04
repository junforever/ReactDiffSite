import { FaFileExport } from 'react-icons/fa'
import { IconContext } from 'react-icons'
import { DEFAULT_DIFF_INPUT, DEFAULT_DIFF_SETTINGS, currentDateTimeString } from '../../utils'

function DiffExpSettings () {
  const handleExpSettings = () => {
    const diffSettingsLS = window.localStorage.getItem('diffSettingsLS')
    const diffInputLS = window.localStorage.getItem('diffInputLS')
    const settings = (diffSettingsLS === null) ? DEFAULT_DIFF_SETTINGS : JSON.parse(diffSettingsLS)
    const urls = (diffInputLS === null) ? DEFAULT_DIFF_INPUT : JSON.parse(diffInputLS)
    const dataToExport = {
      urls,
      settings
    }

    const parsedJson = JSON.stringify(dataToExport, null, 2)
    const blob = new Blob([parsedJson], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const fileName = `React_Diff_Settings_${currentDateTimeString()}`
    const link = document.createElement('a')

    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <button className="btn" onClick={() => handleExpSettings()}>
      Export Settings
      <IconContext.Provider value={{ className: 'text-xl' }}>
        <FaFileExport />
      </IconContext.Provider>
    </button>
  )
}

export default DiffExpSettings
