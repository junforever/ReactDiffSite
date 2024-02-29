import { useState, useEffect } from 'react'
import DiffInput from './components/DiffInput'
import DiffSettings from './components/DiffSettings'
import DiffIFrames from './components/DiffIFrames'
import Navbar from './components/Navbar'
import BackToTop from './components/BackToTop'
import { useDebounce } from './hooks/useDebounce'
import { DEFAULT_DIFF_INPUT, DEFAULT_DIFF_SETTINGS, LARGE_BREAKPOINT, MOBILE_BREAKPOINT, OTHER_TOP_DISTANCE, MOBILE_TOP_DISTANCE, BTT_TOP_DISTANCE } from './utils'
import ShowHideButton from './components/ShowHideButton'

function App () {
  /* visualization states */
  const [bttIsVisible, setBttIsVisible] = useState(false)
  const [shbIsVisible, setShbIsVisible] = useState(false)
  const [settingsAreVisible, setSettingsAreVisible] = useState(true)
  const [isLgView, setIsLgView] = useState(
    () => {
      const { width } = document.documentElement.getBoundingClientRect()
      if (width <= LARGE_BREAKPOINT) return false
      return true
    }
  )

  // This functionality is for disable the side by side comparison mode for tablets and mobile
  const resizeObserver = new ResizeObserver((entries) => {
    const { width } = entries[0].contentRect
    if (width <= LARGE_BREAKPOINT) {
      setIsLgView(false)
    } else {
      setIsLgView(true)
    }
  })

  // activate the resizeObserver only the first time
  useEffect(() => {
    resizeObserver.observe(document.documentElement)

    return () => {
      resizeObserver.unobserve(document.documentElement)
    }
  }, [])

  // watch if the window is resized to disable the side by side comparison mode for tablets and mobile
  useEffect(() => {
    const { width } = document.documentElement.getBoundingClientRect()
    if (!isLgView && width <= LARGE_BREAKPOINT && diffSettings.sideBySide) {
      handleBreakPointChange()
    }
  }, [isLgView])

  const handleShowHideClick = () => { setSettingsAreVisible((prevValue) => !prevValue) }

  const scrollEventListener = () => {
    const { width } = document.documentElement.getBoundingClientRect()
    const iframesSection = document.querySelector('.diff-iframes-section')
    const iframesTopDistance = width <= MOBILE_BREAKPOINT ? MOBILE_TOP_DISTANCE : OTHER_TOP_DISTANCE

    if (window.scrollY > BTT_TOP_DISTANCE) {
      setBttIsVisible(true)
    } else {
      setBttIsVisible(false)
    }

    if (window.scrollY > 0 && iframesSection.getBoundingClientRect().top <= iframesTopDistance) {
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

  /* settings states */
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

    setDiffSettings(isLgView ? DEFAULT_DIFF_SETTINGS : { ...DEFAULT_DIFF_SETTINGS, sideBySide: false })
    window.localStorage.setItem('diffSettingsLS', JSON.stringify(DEFAULT_DIFF_SETTINGS))
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
        settingsAreVisible={settingsAreVisible}
        isLgView={isLgView}
        handleDiffSettingsChange={ handleDiffSettingsChange }
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
      <ShowHideButton isVisible={shbIsVisible} isComponentVisible={settingsAreVisible} handleShowHideClick={handleShowHideClick}/>
    </div>
  )
}

export default App
