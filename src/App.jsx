import { useState, useEffect, useRef } from 'react'
import DiffInput from './components/DiffInput'
import DiffSettings from './components/DiffSettings'
import DiffIFrames from './components/DiffIFrames'
import Navbar from './components/Navbar'
import BackToTop from './components/BackToTop'
import { useDebounce } from './hooks/useDebounce'
import { useDebounceFunc } from './hooks/useDebounceFunc'
import { DEFAULT_DIFF_INPUT, DEFAULT_DIFF_SETTINGS, LARGE_BREAKPOINT, DEFAULT_STICKY_SETTINGS_CONF, BTT_TOP_DISTANCE, handleWidthResize, castElementValue, URLS_PROPERTY_NAME, SETTINGS_PROPERTY_NAME } from './utils'
import ShowHideButton from './components/ShowHideButton'

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

function App () {
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
      resizeObserver.disconnect()
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

  const currentDiffSettings = useRef(loadDiffSettings)
  const [diffSettings, setDiffSettings] = useState(loadDiffSettings)

  /* visualization states */
  const [bttIsVisible, setBttIsVisible] = useState(false)
  const [shbIsVisible, setShbIsVisible] = useState(false)
  const [stickySettingsConf, setStickySettingsConf] = useState(DEFAULT_STICKY_SETTINGS_CONF)
  const firstTime = useRef(true)

  const handleShowHideClick = () => { setStickySettingsConf((prevValue) => ({ ...prevValue, visibility: !prevValue.visibility })) }

  const scrollEventListener = () => {
    const iframesSection = document.querySelector('.diff-iframes-section')

    if (window.scrollY > BTT_TOP_DISTANCE) {
      setBttIsVisible(true)
    } else {
      setBttIsVisible(false)
    }

    if (window.scrollY > 0 && iframesSection.getBoundingClientRect().top <= 10) {
      if (firstTime.current) {
        firstTime.current = false
        setShbIsVisible(true)
        setStickySettingsConf({
          position: 'sticky',
          visibility: false
        })
      }
    } else {
      firstTime.current = true
      setShbIsVisible(false)
      setStickySettingsConf(DEFAULT_STICKY_SETTINGS_CONF)
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
      [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : castElementValue(e.target)
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
        [e.target.name]: castElementValue(e.target)
      }
    }

    currentDiffSettings.current = diffSettingsChanged
    setDiffSettings(diffSettingsChanged)
    window.localStorage.setItem('diffSettingsLS', JSON.stringify(diffSettingsChanged))
  }

  const handleITopChange = (iframe) => {
    const iTopChanged = {
      ...diffSettings,
      [iframe]: 0
    }

    currentDiffSettings.current = iTopChanged
    setDiffSettings(iTopChanged)
    window.localStorage.setItem('diffSettingsLS', JSON.stringify(iTopChanged))
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

  // import settings
  const handleImportSettings = (data) => {
    setDiffInput(data[URLS_PROPERTY_NAME])
    window.localStorage.setItem('diffInputLS', JSON.stringify(data[URLS_PROPERTY_NAME]))

    // validate the document width to avoid swiper issues
    const validatedValues = data[SETTINGS_PROPERTY_NAME]

    if (document.documentElement.clientWidth <= LARGE_BREAKPOINT) {
      validatedValues.sideBySide = false
    }

    const iConf = handleWidthResize(validatedValues)
    const diffSettingsInitialized = {
      ...validatedValues,
      ...iConf
    }

    setDiffSettings(diffSettingsInitialized)
    currentDiffSettings.current = diffSettingsInitialized
    window.localStorage.setItem('diffSettingsLS', JSON.stringify(diffSettingsInitialized))
  }

  // handle pixel adjuster

  const debouncedPixelAdjusterValue = useDebounceFunc((op) => {
    let parsedValue = parseInt(op.settings[op.propName], 10)

    if (isNaN(parsedValue) || op.currentValue.trim() === '') {
      setDiffSettings({
        ...op.settings,
        [op.propName]: 0
      })
      parsedValue = 0
    }

    op.settings[op.propName] = parsedValue
    currentDiffSettings.current = op.settings
    window.localStorage.setItem('diffSettingsLS', JSON.stringify(op.settings))
  }, 500) // Debounce delay de 1000ms

  const handleOnPixelAdjusterChange = (e) => {
    const diffSettingsChanged = {
      ...diffSettings,
      [e.currentTarget.name]: e.currentTarget.dataset.action === 'change' ? e.currentTarget.value : (e.currentTarget.dataset.action === 'up' ? parseInt(diffSettings[e.currentTarget.name]) - 1 : parseInt(diffSettings[e.currentTarget.name]) + 1)
    }
    setDiffSettings(diffSettingsChanged)
    debouncedPixelAdjusterValue({ settings: diffSettingsChanged, propName: e.currentTarget.name, currentValue: e.currentTarget.value })
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
        stickySettingsConf={stickySettingsConf}
        handleDiffSettingsChange={ handleDiffSettingsChange }
        handleOnPixelAdjusterChange= { handleOnPixelAdjusterChange }
        handleResetSettings= { handleResetSettings }
        handleImportSettings= { handleImportSettings }
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
      <ShowHideButton isVisible={shbIsVisible} componentVisibility={stickySettingsConf.visibility} handleShowHideClick={handleShowHideClick}/>
    </div>
  )
}

export default App
