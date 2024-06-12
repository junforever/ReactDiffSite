import PropTypes from 'prop-types'
import { BsLayoutSplit } from 'react-icons/bs'
import { MdContentCopy } from 'react-icons/md'
import { GrPowerReset } from 'react-icons/gr'
import { IconContext } from 'react-icons'
import { MIN_IHEIGHT, MAX_IHEIGHT } from '../../utils'
import PixelAdjuster from '../PixelAdjuster'
import DiffExpSettings from '../DiffExpSettings'
import DiffImpSettings from '../DiffImpSettings'

function DiffSettings ({
  diffSettings,
  stickySettingsConf,
  handleDiffSettingsChange,
  handleOnPixelAdjusterChange,
  handleResetSettings,
  handleImportSettings
}) {
  const btnStyles = {
    backgroundColor: 'slategrey',
    borderColor: 'slategrey'
  }

  return (
    <section className={`flex flex-col top-0 z-20 bg-base-300 rounded-box p-4 pb-6 gap-y-2 ${stickySettingsConf.position} ${!stickySettingsConf.visibility ? 'invisible' : ''}`}>
      {/* first row settings */}
      <div className="flex flex-col items-center gap-y-4 sm:flex-row justify-center sm:items-start gap-x-8 flex-wrap">
        {/* iframe height */}
        <div className="flex flex-col w-56">
          <div className="label self-center">
            <span className="label-text text-base">Iframes height (px)</span>
          </div>
          <input
            name="iHeight"
            type="range"
            min={ MIN_IHEIGHT }
            max={ MAX_IHEIGHT }
            value={ diffSettings.iHeight }
            step="250"
            className="range range-primary"
            data-cast="int"
            onChange={handleDiffSettingsChange}
          />
          <div className="label self-center">
            <span className="label-text text-base"> { diffSettings.iHeight }px</span>
          </div>
        </div>
        {/* viewport width */}
        <label className="form-control min-w-56 max-w-xs">
          <div className="label self-center">
            <span className="label-text text-base">Viewport width</span>
          </div>
          <select
            name="iWidth"
            className="select select-bordered"
            data-cast="int"
            value={diffSettings.iWidth}
            onChange={handleDiffSettingsChange}
          >
            <option value="0" data-breakpoint="full-width">Full Width</option>
            <optgroup label="Breakpoints A">
              <option value="599" data-breakpoint="classy-mb">Mobile (min 599px)</option>
              <option value="999" data-breakpoint="classy-sm">Small (min 999px)</option>
              <option value="1438" data-breakpoint="classy-md">Medium (min 1438px)</option>
            </optgroup>

            <optgroup label="Breakpoints B">
              <option value="639" data-breakpoint="treasury-mb">Mobile (min 639px)</option>
              <option value="879" data-breakpoint="treasury-sm">Small (min 879px) </option>
              <option value="1119" data-breakpoint="treasury-md">Medium (min 1119px)</option>
            </optgroup>

            <optgroup label="Mobile Devices">
              <option value="320" data-breakpoint="iphone-5">iPhone 5/SE</option>
              <option value="360" data-breakpoint="galaxy-s5">Galaxy S5</option>
              <option value="412" data-breakpoint="galaxy-a51">Galaxy A51</option>
              <option value="375" data-breakpoint="iphone-xxs">iPhone X/XS</option>
              <option value="411" data-breakpoint="pixel-2">Pixel 2</option>
            </optgroup>
          </select>
        </label>

        {/* compare mode */}
        <div className="hidden lg:flex flex-col">
          <div className="label self-center">
            <span className="label-text text-base">Comparison mode</span>
          </div>
          <label className="swap swap-flip">
            {/* this hidden checkbox controls the state */}
            <input
              type="checkbox"
              name="sideBySide"
              checked={diffSettings.sideBySide}
              onChange={handleDiffSettingsChange}
            />
            <div className="swap-on">
              <div className="flex flex-col items-center">
                <IconContext.Provider value={{ className: 'text-4xl text-primary' }}>
                  <BsLayoutSplit aria-hidden />
                </IconContext.Provider>
                <span className="label-text text-base" >Side By Side</span>
              </div>
            </div>
            <div className="swap-off">
              <div className="flex flex-col items-center">
                <IconContext.Provider value={{ className: 'text-4xl text-primary' }}>
                  <MdContentCopy aria-hidden />
                </IconContext.Provider>
                <span className="label-text text-base">Overlay</span>
              </div>
            </div>
          </label>
        </div>

        {/* overlay options */}
        <div className="flex flex-col">
          <div className="label self-center">
            <span className={`label-text text-base ${diffSettings.sideBySide ? 'disabled-text' : ''}`}>Overlay mode</span>
          </div>
          <div className="join">
            <div className="tooltip tooltip-bottom" data-tip="Move the swipe line smoothly">
              <input
                style={ diffSettings.overlayMode === 'swipe' && diffSettings.sideBySide ? btnStyles : {} }
                className="join-item btn custom-radio"
                type="radio"
                name="overlayMode"
                aria-label="Swipe"
                value="swipe"
                checked={ diffSettings.overlayMode === 'swipe'}
                onChange={ handleDiffSettingsChange }
                disabled={ diffSettings.sideBySide }
              />
            </div>
            <input
              style={ diffSettings.overlayMode === 'blend' && diffSettings.sideBySide ? btnStyles : {} }
              className="join-item btn custom-radio"
              type="radio"
              name="overlayMode"
              aria-label="Blend"
              value="blend"
              checked={ diffSettings.overlayMode === 'blend'}
              onChange={handleDiffSettingsChange}
              disabled={diffSettings.sideBySide}
            />
            <input
              style={ diffSettings.overlayMode === 'onion' && diffSettings.sideBySide ? btnStyles : {} }
              className="join-item btn custom-radio"
              type="radio"
              name="overlayMode"
              aria-label="Onion"
              value="onion"
              checked={ diffSettings.overlayMode === 'onion'}
              onChange={handleDiffSettingsChange}
              disabled={diffSettings.sideBySide}
            />
          </div>
        </div>

        {/* opacity for overlay options */}
        <div className="flex flex-col w-56">
          <div className="label self-center">
            <span className={`label-text text-base ${diffSettings.sideBySide || diffSettings.overlayMode === 'swipe' ? 'disabled-text' : ''}`}>Opacity</span>
          </div>
          <input
            name="opacity"
            type="range"
            min="0"
            max="1"
            value={diffSettings.opacity}
            step="0.01"
            className={`range ${diffSettings.sideBySide || diffSettings.overlayMode === 'swipe' ? '' : 'range-primary'}`}
            data-cast="float"
            data-decimals="2"
            onChange={handleDiffSettingsChange}
            disabled={diffSettings.sideBySide || diffSettings.overlayMode === 'swipe'}
          />
          <div className="label self-center">
            <span className={`label-text text-base ${diffSettings.sideBySide || diffSettings.overlayMode === 'swipe' ? 'disabled-text' : ''}`}>{Math.floor(diffSettings.opacity * 100)}%</span>
          </div>
        </div>
      </div>

      {/* second row settings */}
      <div className="flex flex-col items-center">
        <div className="label self-center">
          <span className="label-text text-base">Iframes Vertical Shifting</span>
        </div>
        <div className="flex flex-col gap-y-4 sm:gap-y-0 sm:flex-row justify-center gap-x-8">
          <PixelAdjuster
            pixelAdjusterSettings={{ name: 'leftIFrameTop', value: diffSettings.leftIFrameTop, innerLabel: 'L' }}
            handleOnPixelAdjusterChange={ handleOnPixelAdjusterChange }
          />
          <PixelAdjuster
            pixelAdjusterSettings={{ name: 'rightIFrameTop', value: diffSettings.rightIFrameTop, innerLabel: 'R' }}
            handleOnPixelAdjusterChange={ handleOnPixelAdjusterChange }
          />
        </div>
      </div>

      {/* third row settings */}
      <div className="flex flex-col sm:flex-row items-center justify-center mt-4 gap-x-2 gap-y-4 sm:gap-y-0">
        <DiffImpSettings handleImportSettings={ handleImportSettings } />
        <DiffExpSettings />
        <button className="btn" onClick={() => handleResetSettings()}>
          Reset Settings
          <IconContext.Provider value={{ className: 'text-xl' }}>
            <GrPowerReset />
          </IconContext.Provider>
        </button>
      </div>
    </section>
  )
}

DiffSettings.propTypes = {
  diffSettings: PropTypes.object.isRequired,
  stickySettingsConf: PropTypes.object.isRequired,
  handleDiffSettingsChange: PropTypes.func.isRequired,
  handleOnPixelAdjusterChange: PropTypes.func.isRequired,
  handleResetSettings: PropTypes.func.isRequired,
  handleImportSettings: PropTypes.func.isRequired
}
export default DiffSettings
