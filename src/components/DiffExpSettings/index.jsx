import { FaFileExport } from 'react-icons/fa'
import { IconContext } from 'react-icons'
import { DEFAULT_DIFF_INPUT, DEFAULT_DIFF_SETTINGS, currentDateTimeString, URLS_PROPERTY_NAME, SETTINGS_PROPERTY_NAME } from '../../utils'

function DiffExpSettings () {
  const handleExpSettings = () => {
    const diffSettingsLS = window.localStorage.getItem('diffSettingsLS')
    const diffInputLS = window.localStorage.getItem('diffInputLS')
    const dataToExport = {
      [URLS_PROPERTY_NAME]: (diffInputLS === null) ? DEFAULT_DIFF_INPUT : JSON.parse(diffInputLS),
      [SETTINGS_PROPERTY_NAME]: (diffSettingsLS === null) ? DEFAULT_DIFF_SETTINGS : JSON.parse(diffSettingsLS)
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
