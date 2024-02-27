import { useState } from 'react'
import DiffInput from './components/DiffInput'
import DiffSettings from './components/DiffSettings'
import DiffIFrames from './components/DiffIFrames'
import Navbar from './components/Navbar'
import { useDebounce } from './hooks/useDebounce'
import { DEFAULT_IHEIGHT } from './utils'

function App () {
  const [diffInput, setDiffInput] = useState(
    () => {
      const diffInputLS = window.localStorage.getItem('diffInputLS')
      return diffInputLS !== null ? JSON.parse(diffInputLS) : { leftUrl: '', rightUrl: '' }
    }
  )

  const [diffSettings, setDiffSettings] = useState(
    () => {
      const diffSettingsLS = window.localStorage.getItem('diffSettingsLS')
      return diffSettingsLS !== null
        ? JSON.parse(diffSettingsLS)
        : {
            iHeight: DEFAULT_IHEIGHT,
            iWidth: 0, // (window.innerWidth / 2) - 30,
            sideBySide: true,
            overlayMode: 'swipe',
            opacity: 1,
            leftIFrameTop: '0',
            rightIFrameTop: '0'
          }
    }
  )

  const handleDiffInputChange = (e) => {
    const diffInputChanged = {
      ...diffInput,
      [e.target.name]: e.target.value
    }
    setDiffInput(diffInputChanged)
    window.localStorage.setItem('diffInputLS', JSON.stringify(diffInputChanged))
  }

  const handleDiffSettingsChange = (e) => {
    const diffSettingsChanged = {
      ...diffSettings,
      [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value
    }
    setDiffSettings(diffSettingsChanged)
    window.localStorage.setItem('diffSettingsLS', JSON.stringify(diffSettingsChanged))
  }

  const handleBreakPointChange = () => {
    if (diffSettings.sideBySide) {
      const diffSettingsChanged = {
        ...diffSettings,
        sideBySide: false
      }
      setDiffSettings((prevValue) => ({ ...prevValue, sideBySide: false }))
      window.localStorage.setItem('diffSettingsLS', JSON.stringify(diffSettingsChanged))
    }
  }

  const handleITopChange = (iframe) => {
    const iTopChanged = {
      ...diffSettings,
      [iframe]: '0'
    }

    setDiffSettings(iTopChanged)
    window.localStorage.setItem('diffSettingsLS', JSON.stringify(iTopChanged))
  }

  const handleOnPixelAdjusterChange = (e) => {
    const diffSettingsChanged = {
      ...diffSettings,
      [e.currentTarget.name]: e.currentTarget.dataset.action === 'change' ? e.currentTarget.value : (e.currentTarget.dataset.action === 'up' ? parseInt(diffSettings[e.currentTarget.name]) - 1 : parseInt(diffSettings[e.currentTarget.name]) + 1)
    }
    setDiffSettings(diffSettingsChanged)
    window.localStorage.setItem('diffSettingsLS', JSON.stringify(diffSettingsChanged))
  }

  return (
    <div className="flex flex-col gap-y-6 p-4">
      <Navbar />
      <DiffInput
        diffInput={ diffInput }
        handleDiffInputChange={ handleDiffInputChange }
      />
      <DiffSettings
        diffSettings={diffSettings}
        handleDiffSettingsChange={ handleDiffSettingsChange }
        handleBreakPointChange={ handleBreakPointChange }
        handleOnPixelAdjusterChange= { handleOnPixelAdjusterChange }
      />
      <DiffIFrames debounceInputs= {
          {
            leftUrl: useDebounce(diffInput.leftUrl, 1000),
            rightUrl: useDebounce(diffInput.rightUrl, 1000),
            iHeightDebounce: useDebounce(diffSettings.iHeight, 1000),
            leftIFrameTopDebounce: useDebounce(diffSettings.leftIFrameTop, 500),
            rightIFrameTopDebounce: useDebounce(diffSettings.rightIFrameTop, 500),
            ...diffSettings
          }
        }
        handleITopChange= {handleITopChange}
      />
    </div>
  )
}

export default App
