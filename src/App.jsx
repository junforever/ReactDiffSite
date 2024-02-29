import { useState, useEffect } from 'react'
import DiffInput from './components/DiffInput'
import DiffSettings from './components/DiffSettings'
import DiffIFrames from './components/DiffIFrames'
import Navbar from './components/Navbar'
import BackToTop from './components/BackToTop'
import { useDebounce } from './hooks/useDebounce'
import { DEFAULT_DIFF_INPUT, DEFAULT_DIFF_SETTINGS } from './utils'
import ShowHideButton from './components/ShowHideButton'

function App () {
  const [bttIsVisible, setBttIsVisible] = useState(false)
  const [shbIsVisible, setShbIsVisible] = useState(false)
  const [settingsAreVisible, setSettingsAreVisible] = useState(true)
  const [diffInput, setDiffInput] = useState(
    () => {
      const diffInputLS = window.localStorage.getItem('diffInputLS')
      return diffInputLS !== null ? JSON.parse(diffInputLS) : DEFAULT_DIFF_INPUT
    }
  )

  const [diffSettings, setDiffSettings] = useState(
    () => {
      const diffSettingsLS = window.localStorage.getItem('diffSettingsLS')
      return diffSettingsLS !== null
        ? JSON.parse(diffSettingsLS)
        : DEFAULT_DIFF_SETTINGS
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
  const handleResetSettings = () => {
    setDiffInput(DEFAULT_DIFF_INPUT)
    window.localStorage.setItem('diffInputLS', JSON.stringify(DEFAULT_DIFF_INPUT))

    setDiffSettings(DEFAULT_DIFF_SETTINGS)
    window.localStorage.setItem('diffSettingsLS', JSON.stringify(DEFAULT_DIFF_SETTINGS))
  }

  const handleShowHideClick = () => { setSettingsAreVisible((prevValue) => !prevValue) }

  const scrollEventListener = () => {
    // const settingsSection = document.querySelector('.diff-settings-section')
    const iframesSection = document.querySelector('.diff-iframes-section')
    // console.log('scroll', window.scrollY)
    // console.log('element', settingsSection.getBoundingClientRect())
    // console.log('iframes', iframesSection.getBoundingClientRect())
    if (window.scrollY > 300) {
      setBttIsVisible(true)
    } else {
      setBttIsVisible(false)
    }

    if (window.scrollY > 0 && iframesSection.getBoundingClientRect().top <= 200) {
      setShbIsVisible(true)
    } else {
      setShbIsVisible(false)
      setSettingsAreVisible(true)
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', scrollEventListener)
    return () => {
      window.removeEventListener('scroll', scrollEventListener)
    }
  }, [])

  return (
    <div className="flex flex-col gap-y-6 p-4">
      <Navbar />
      <DiffInput
        diffInput={ diffInput }
        handleDiffInputChange={ handleDiffInputChange }
      />
      <DiffSettings
        diffSettings={diffSettings}
        settingsAreVisible={settingsAreVisible}
        handleDiffSettingsChange={ handleDiffSettingsChange }
        handleBreakPointChange={ handleBreakPointChange }
        handleOnPixelAdjusterChange= { handleOnPixelAdjusterChange }
        handleResetSettings= { handleResetSettings }
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
      <BackToTop isVisible={bttIsVisible} />
      <ShowHideButton isVisible={shbIsVisible} isComponentVisible handleShowHideClick={handleShowHideClick}/>
    </div>
  )
}

export default App
