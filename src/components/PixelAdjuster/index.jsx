import PropTypes from 'prop-types'
import { FaCircleArrowUp, FaCircleArrowDown } from 'react-icons/fa6'
import { IconContext } from 'react-icons'

function PixelAdjuster (
  {
    pixelAdjusterSettings,
    handleOnPixelAdjusterChange
  }
) {
  return (
    <div className="flex flex-row">
      <button
        data-action="up"
        className="btn btn-ghost btn--up-adjuster"
        name={pixelAdjusterSettings.name}
        onClick={handleOnPixelAdjusterChange}
        aria-label={`Increase ${pixelAdjusterSettings.name} top value`}
      >
        <IconContext.Provider value={{ className: 'text-3xl text-primary' }}>
          <FaCircleArrowUp aria-hidden />
        </IconContext.Provider>
      </button>
      <label className="input flex items-center gap-2">
        <input type="text "
          data-action="change"
          maxLength="5"
          className="grow w-14"
          name={pixelAdjusterSettings.name}
          onChange={ handleOnPixelAdjusterChange }
          value={pixelAdjusterSettings.value}
        />
        <span className="badge badge-primary">px</span>
        { pixelAdjusterSettings.innerLabel && <span className="badge badge-primary">{pixelAdjusterSettings.innerLabel}</span> }
      </label>
      <button
        data-action="down"
        className="btn btn-ghost btn--down-adjuster"
        name={pixelAdjusterSettings.name}
        onClick={handleOnPixelAdjusterChange}
        aria-label={`Decrease ${pixelAdjusterSettings.name} top value`}
      >
        <IconContext.Provider value={{ className: 'text-3xl text-primary' }}>
          <FaCircleArrowDown aria-hidden/>
        </IconContext.Provider>
      </button>
    </div>
  )
}

PixelAdjuster.propTypes = {
  pixelAdjusterSettings: PropTypes.object.isRequired,
  handleOnPixelAdjusterChange: PropTypes.func.isRequired
}

export default PixelAdjuster
