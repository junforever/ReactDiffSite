import './DiffIFrames.css'
import { useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { FaMagnifyingGlass } from 'react-icons/fa6'
import { IconContext } from 'react-icons'
import { isValidUrl, isNumber } from '../../utils'

function DiffIFrames ({
  debounceInputs,
  handleITopChange,
  handleIWidthChange
}) {
  const [swiperPos, setSwiperPos] = useState(() => {
    return debounceInputs.iWidth === 0 ? window.innerWidth / 2 : debounceInputs.iWidth / 2
  })

  const [leftUrlValidated, setLeftUrlValidated] = useState(isValidUrl(debounceInputs.leftUrl))
  const [rightUrlValidated, setRightUrlValidated] = useState(isValidUrl(debounceInputs.rightUrl))
  const [leftIFrameLoaded, setLeftIFrameLoaded] = useState(false)
  const [rightIFrameLoaded, setRightIFrameLoaded] = useState(false)
  const [leftIFrameAllowed, setLeftIFrameAllowed] = useState(true)
  const [rightIFrameAllowed, setRightIFrameAllowed] = useState(true)

  const iFramesContainer = useRef(null)
  let eventStart = false

  useEffect(() => {
    if (!isNumber(debounceInputs.leftIFrameTopDebounce)) {
      handleITopChange('leftIFrameTop')
      return
    }

    if (!isNumber(debounceInputs.rightIFrameTopDebounce)) {
      handleITopChange('rightIFrameTop')
    }
  }, [
    debounceInputs.leftIFrameTopDebounce,
    debounceInputs.rightIFrameTopDebounce
  ])

  useEffect(() => {
    setSwiperPos(parseInt(debounceInputs.iWidth) === 0 ? iFramesContainer.current.getBoundingClientRect().width / 2 : parseInt(debounceInputs.iWidth) / 2)
    // handleIWidthChange(debounceInputs.iWidth, debounceInputs.sideBySide)
  }, [
    debounceInputs.iWidth,
    debounceInputs.sideBySide
  ])

  useEffect(() => {
    setLeftIFrameLoaded(debounceInputs.leftUrl === '' || !isValidUrl(debounceInputs.leftUrl))
    setLeftUrlValidated(isValidUrl(debounceInputs.leftUrl))
    setLeftIFrameAllowed(true)
  }, [debounceInputs.leftUrl])

  useEffect(() => {
    setRightIFrameLoaded(debounceInputs.rightUrl === '' || !isValidUrl(debounceInputs.rightUrl))
    setRightUrlValidated(isValidUrl(debounceInputs.rightUrl))
    setRightIFrameAllowed(true)
  }, [debounceInputs.rightUrl])

  const swipeHandleDown = (e) => {
    e.preventDefault()
    eventStart = true
    window.addEventListener('mousemove', swipeHandleMove)
    window.addEventListener('mouseup', swipeHandleUp)
  }

  const swipeHandleMove = (e) => {
    if (!eventStart) return false

    const posFactorLeft = 6
    const posFactorRight = 25
    const cursorFactor = 18
    const { width, left } = iFramesContainer.current.getBoundingClientRect()
    const iWidth = parseInt(debounceInputs.iWidth) === 0 ? width : parseInt(debounceInputs.iWidth)

    // total px
    const total = left + iWidth
    const diff = total - (e.clientX - cursorFactor)
    const currentSwiperPos = iWidth - diff

    // left edge
    if (left - (e.clientX - cursorFactor) > posFactorLeft) {
      return false
    }

    // right edge
    if (total - (e.clientX - cursorFactor) < posFactorRight) {
      return false
    }
    setSwiperPos(currentSwiperPos)
  }

  const swipeHandleUp = (e) => {
    eventStart = false
    window.removeEventListener('mousemove', swipeHandleMove)
    window.removeEventListener('mouseup', swipeHandleUp)
  }

  return (
    <section
      className={`diff-iframes-section flex flex-row relative items-start ${!debounceInputs.sideBySide ? `dif-mode-overlay dif-mode-overlay--${debounceInputs.overlayMode}` : ''}`}
      style={{
        width: debounceInputs.iFrameContainerWidth,
        paddingRight: debounceInputs.iFrameContainerPaddingRight,
        justifyContent: debounceInputs.iFrameJustifyContent
      }}
    >
      <div
        ref={iFramesContainer}
        className='flex flex-row gap-x-6 relative justify-center items-start w-full' style={{
          height: `${debounceInputs.iHeightDebounce}px`,
          width: debounceInputs.sideBySide ? '100%' : (parseInt(debounceInputs.iWidth) === 0 ? '100%' : `${debounceInputs.iWidth}px`)
        }}>
        {/* left iframe */}
        <div
          className="mockup-browser border bg-base-300 left-iframe overflow-hidden h-full"
          style={{
            opacity: debounceInputs.sideBySide || debounceInputs.overlayMode === 'swipe' ? 1 : debounceInputs.opacity,
            width: (!debounceInputs.sideBySide && debounceInputs.overlayMode === 'swipe') ? `${swiperPos + 18}px` : (parseInt(debounceInputs.iWidth) === 0 ? '100%' : `${debounceInputs.iWidth}px`)
          }}
        >
          <div
            className="mockup-browser-toolbar overflow-hidden mockup-browser-toolbar--diff relative bg-base-300"
            style={{
              zIndex: 5,
              width: (!debounceInputs.sideBySide && debounceInputs.overlayMode === 'swipe') ? (parseInt(debounceInputs.iWidth) === 0 ? 'calc(100vw - 50px)' : `${debounceInputs.iWidth}px`) : (parseInt(debounceInputs.iWidth) === 0 ? '100%' : `${debounceInputs.iWidth}px`)
            }}
          >
            <div className={`input input--flat justify-start items-center gap-x-2 ${debounceInputs.leftUrl && !leftUrlValidated ? 'input-error' : ''} ${leftUrlValidated && !leftIFrameAllowed ? 'input-warning' : ''}`}>
              { !leftIFrameLoaded && <span className="loading loading-spinner loading-sm -ml-1"></span> }
              { leftIFrameLoaded &&
                <span>
                  <IconContext.Provider value={{
                    className: 'text-sm'
                  }}>
                    <FaMagnifyingGlass aria-hidden />
                  </IconContext.Provider>
                </span>
              }
              <span>
                { leftUrlValidated }
              </span>
            </div>
          </div>
          <iframe
            scrolling="no"
            src={ leftUrlValidated }
            name="leftIFrame"
            onLoad={(e) => {
              setLeftIFrameLoaded(true)
              setLeftIFrameAllowed(leftUrlValidated && e.target.contentWindow.length > 0)
            }}
            className="h-full overflow-hidden relative"
            style={{
              top: `${debounceInputs.leftIFrameTopDebounce}px`,
              width: (!debounceInputs.sideBySide && debounceInputs.overlayMode === 'swipe') ? (parseInt(debounceInputs.iWidth) === 0 ? 'calc(100vw - 50px)' : `${debounceInputs.iWidth}px`) : (parseInt(debounceInputs.iWidth) === 0 ? '100%' : `${debounceInputs.iWidth}px`)
            }}
          ></iframe>
        </div>

        {/* right iframe */}
        <div
          className="mockup-browser border bg-base-300 w-full right-iframe overflow-hidden h-full"
          style={{
            width: parseInt(debounceInputs.iWidth) === 0 ? '100%' : `${debounceInputs.iWidth}px`
          }}
        >
          <div
            className="mockup-browser-toolbar overflow-hidden mockup-browser-toolbar--diff relative bg-base-300"
            style={{
              zIndex: 5,
              width: parseInt(debounceInputs.iWidth) === 0 ? '100%' : `${debounceInputs.iWidth}px`
            }}
          >
            <div className={`input input--flat justify-start items-center gap-x-2 ${debounceInputs.rightUrl && !rightUrlValidated ? 'input-error' : ''} ${rightUrlValidated && !rightIFrameAllowed ? 'input-warning' : ''}`}>
              { !rightIFrameLoaded && <span className="loading loading-spinner loading-sm -ml-1"></span> }
              { rightIFrameLoaded &&
                <span>
                  <IconContext.Provider value={{
                    className: 'text-sm'
                  }}>
                    <FaMagnifyingGlass aria-hidden />
                  </IconContext.Provider>
                </span>
              }
              <span>
                { rightUrlValidated }
              </span>
            </div>
          </div>
          <iframe
            scrolling="no"
            src={ rightUrlValidated }
            name="rightIFrame"
            onLoad={(e) => {
              setRightIFrameLoaded(true)
              setRightIFrameAllowed(rightUrlValidated && e.target.contentWindow.length > 0)
            }}
            className="h-full overflow-hidden relative"
            style={{
              top: `${debounceInputs.rightIFrameTopDebounce}px`,
              width: parseInt(debounceInputs.iWidth) === 0 ? '100%' : `${debounceInputs.iWidth}px`
            }}
          ></iframe>
        </div>

        {/* swiper handle */}
        <div
          className={`absolute z-10 w-8 opacity-70 cursor-ew-resize ${debounceInputs.sideBySide || debounceInputs.overlayMode !== 'swipe' ? 'hidden' : ''}`}
          onMouseDown={swipeHandleDown}
          style={{
            left: `${swiperPos}px`,
            height: `${debounceInputs.iHeightDebounce}px`
          }}
        >
          <div className="my-0 mx-auto bg-red-600 h-full w-[3px]"></div>
        </div>
      </div>
    </section>
  )
}

DiffIFrames.propTypes = {
  debounceInputs: PropTypes.object.isRequired,
  handleITopChange: PropTypes.func.isRequired,
  handleIWidthChange: PropTypes.func.isRequired
}

export default DiffIFrames
