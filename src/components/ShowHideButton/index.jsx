import { FaPlus } from 'react-icons/fa'
import { IconContext } from 'react-icons'
import PropTypes from 'prop-types'

function ShowHideButton ({
  isVisible,
  componentVisibility,
  handleShowHideClick
}) {
  return (
    <>
      {isVisible && (
        <button className="btn btn-circle btn-outline btn--medium btn-primary fixed top-2 left-6 z-40" aria-label={`${componentVisibility ? 'Hide' : 'Show'} settings`}
          onClick={handleShowHideClick}
        >
          <IconContext.Provider value={{ className: `text-xl ${componentVisibility ? 'rotate-[135deg]' : ''}  transition-all` }}>
            <FaPlus aria-hidden />
          </IconContext.Provider>
        </button>
      )}
    </>
  )
}

ShowHideButton.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  componentVisibility: PropTypes.bool.isRequired,
  handleShowHideClick: PropTypes.func.isRequired
}

export default ShowHideButton
