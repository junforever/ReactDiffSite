import { FaArrowUp } from 'react-icons/fa'
import { IconContext } from 'react-icons'
import PropTypes from 'prop-types'

function BackToTop ({
  isVisible
}) {
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

BackToTop.propTypes = {
  isVisible: PropTypes.bool.isRequired
}

export default BackToTop
