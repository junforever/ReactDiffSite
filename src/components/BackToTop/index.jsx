import { useState, useEffect } from 'react'
import { FaArrowUp } from 'react-icons/fa'
import { IconContext } from 'react-icons'

function BackToTop () {
  const [isVisible, setIsVisible] = useState(false)
  const scrollEventListener = () => {
    if (window.scrollY > 300) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', scrollEventListener)
    return () => {
      window.removeEventListener('scroll', scrollEventListener)
    }
  }, [])

  return (
    <>
      {isVisible && (
        <button className="btn btn-circle btn-outline btn-primary fixed bottom-4 right-8 z-40" aria-label="Back to top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <IconContext.Provider value={{ className: 'text-xl' }}>
            <FaArrowUp aria-hidden />
          </IconContext.Provider>
        </button>
      )}
    </>
  )
}
export default BackToTop
