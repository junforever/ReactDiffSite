import { useState, useEffect, useRef } from 'react'
import DiffInput from './components/DiffInput'
import DiffSettings from './components/DiffSettings'
import DiffIFrames from './components/DiffIFrames'
import Navbar from './components/Navbar'
import BackToTop from './components/BackToTop'
import { useDebounce } from './hooks/useDebounce'
import { DEFAULT_DIFF_INPUT, DEFAULT_DIFF_SETTINGS, LARGE_BREAKPOINT, MOBILE_BREAKPOINT, OTHER_TOP_DISTANCE, MOBILE_TOP_DISTANCE, BTT_TOP_DISTANCE, handleWidthResize } from './utils'
import ShowHideButton from './components/ShowHideButton'

function App () {
  /* visualization states */
  const [bttIsVisible, setBttIsVisible] = useState(false)
  const [shbIsVisible, setShbIsVisible] = useState(false)
  const [settingsAreVisible, setSettingsAreVisible] = useState(true)

  // activate the resizeObserver only the first time
  useEffect(() => {
    window.addEventListener('scroll', scrollEventListener)
    const resizeObserver = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect
      if (width <= LARGE_BREAKPOINT) {
        currentDiffSettings.current = { ...currentDiffSettings.current, sideBySide: false }
      }
      handleIWidthChange()
    })
    resizeObserver.observe(document.documentElement)

    return () => {
      resizeObserver.unobserve(document.documentElement)
      window.removeEventListener('scroll', scrollEventListener)
    }
  }, [])

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

  /* settings states */
  const handleIWidthChange = () => {
    const conf = handleWidthResize(currentDiffSettings.current)
    const diffSettingsChanged = {
      ...currentDiffSettings.current,
      ...conf
    }
    currentDiffSettings.current = diffSettingsChanged
    setDiffSettings(diffSettingsChanged)
  }

  const loadDiffSettings = (() => {
    const diffSettingsLS = window.localStorage.getItem('diffSettingsLS')
    let settings = null
    if (diffSettingsLS !== null) {
      settings = JSON.parse(diffSettingsLS)
    }

    return settings !== null
      ? { ...settings, ...handleWidthResize(settings) }
      : DEFAULT_DIFF_SETTINGS
  })()

  const [diffInput, setDiffInput] = useState(
    () => {
      const diffInputLS = window.localStorage.getItem('diffInputLS')
      return diffInputLS !== null ? JSON.parse(diffInputLS) : DEFAULT_DIFF_INPUT
    }
  )

  const currentDiffSettings = useRef(loadDiffSettings)
  const [diffSettings, setDiffSettings] = useState(loadDiffSettings)

  const handleDiffInputChange = (e) => {
    const diffInputChanged = {
      ...diffInput,
      [e.target.name]: e.target.value
    }
    setDiffInput(diffInputChanged)
    window.localStorage.setItem('diffInputLS', JSON.stringify(diffInputChanged))
  }

  const handleDiffSettingsChange = (e) => {
    let diffSettingsChanged = {
      ...currentDiffSettings.current,
      [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value
    }

    if (e.target.name === 'sideBySide') {
      const iConf = handleWidthResize({ ...currentDiffSettings.current, sideBySide: e.target.checked })
      diffSettingsChanged = {
        ...currentDiffSettings.current,
        ...iConf,
        [e.target.name]: e.target.checked
      }
    }

    if (e.target.name === 'iWidth') {
      const iConf = handleWidthResize({ ...currentDiffSettings.current, iWidth: e.target.value })
      diffSettingsChanged = {
        ...currentDiffSettings.current,
        ...iConf,
        [e.target.name]: e.target.value
      }
    }

    currentDiffSettings.current = diffSettingsChanged
    setDiffSettings(diffSettingsChanged)
    window.localStorage.setItem('diffSettingsLS', JSON.stringify(diffSettingsChanged))
  }

  // const handleBreakPointChange = () => {
  //   if (diffSettings.sideBySide) {
  //     const diffSettingsChanged = {
  //       ...diffSettings,
  //       sideBySide: false
  //     }
  //     setDiffSettings((prevValue) => ({ ...prevValue, sideBySide: false }))
  //     window.localStorage.setItem('diffSettingsLS', JSON.stringify(diffSettingsChanged))
  //   }
  // }

  const handleITopChange = (iframe) => {
    const iTopChanged = {
      ...diffSettings,
      [iframe]: '0'
    }

    currentDiffSettings.current = iTopChanged
    setDiffSettings(iTopChanged)
    window.localStorage.setItem('diffSettingsLS', JSON.stringify(iTopChanged))
  }

  const handleOnPixelAdjusterChange = (e) => {
    const diffSettingsChanged = {
      ...diffSettings,
      [e.currentTarget.name]: e.currentTarget.dataset.action === 'change' ? e.currentTarget.value : (e.currentTarget.dataset.action === 'up' ? parseInt(diffSettings[e.currentTarget.name]) - 1 : parseInt(diffSettings[e.currentTarget.name]) + 1)
    }
    currentDiffSettings.current = diffSettingsChanged
    setDiffSettings(diffSettingsChanged)
    window.localStorage.setItem('diffSettingsLS', JSON.stringify(diffSettingsChanged))
  }

  const handleResetSettings = () => {
    setDiffInput(DEFAULT_DIFF_INPUT)
    window.localStorage.setItem('diffInputLS', JSON.stringify(DEFAULT_DIFF_INPUT))

    currentDiffSettings.current = DEFAULT_DIFF_SETTINGS
    setDiffSettings(DEFAULT_DIFF_SETTINGS)
    window.localStorage.setItem('diffSettingsLS', JSON.stringify(DEFAULT_DIFF_SETTINGS))
  }

  const handleSwiperPosChange = (value) => {
    const diffSettingsChanged = {
      ...diffSettings,
      swiperPos: value
    }
    currentDiffSettings.current = diffSettingsChanged
    setDiffSettings(diffSettingsChanged)
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
        handleSwiperPosChange= {handleSwiperPosChange}
      />
      <BackToTop isVisible={bttIsVisible} />
      <ShowHideButton isVisible={shbIsVisible} isComponentVisible={settingsAreVisible} handleShowHideClick={handleShowHideClick}/>
    </div>
  )
}

export default App
