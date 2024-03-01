import { useState } from 'react'
import { IconContext } from 'react-icons'
import { RiSunFill } from 'react-icons/ri'
import { HiMoon } from 'react-icons/hi'
import Modal from '../Modal'
import { DEFAULT_IHEIGHT, MIN_IHEIGHT, MAX_IHEIGHT } from '../../utils'

function Navbar () {
  const [isDarkMode, setIsDarkMode] = useState(window.localStorage.getItem('diffTheme') ? window.localStorage.getItem('diffTheme') === 'true' : true)

  const handleDarkModeChange = () => {
    setIsDarkMode(() => {
      document.querySelector('html').setAttribute('data-theme', !isDarkMode ? 'dark' : 'winter')
      window.localStorage.setItem('diffTheme', !isDarkMode)
      return !isDarkMode
    })
  }

  return (
    <div className="navbar bg-base-300 rounded-box pr-3 max-[370px]:flex-col">
      <div className="navbar-start max-[370px]:w-auto">
        <Modal
          btnText="How to use this tool?"
          title="How to use the Site Diff Tool"
          content={`Enter a valid URL in both input fields to start the comparison, in case a URL is invalid, the border of the navigation bar on the corresponding browser mock will turn <b class='text-error'>red</b>,
          and in case that a URL can't be embedded (or can but the page may not work/show correctly), the border of the navigation bar on the corresponding browser mock will turn <b class='text-warning'>orange</b>. <br>
          The height of the iframes is customizable between a range of ${MIN_IHEIGHT}px - ${MAX_IHEIGHT}px, the default value is ${DEFAULT_IHEIGHT}px.<br>
          For the overlay <u>blend</u> and <u>onion</u> modes, the opacity can be adjusted.<br>
          In <u>blend mode</u>, if both pages match, you will see a black screen (with the opacity at 100%), if they don't, you will see the differences in other colors.<br>
          Classy and Treasury breakpoints are available as well as other common mobile devices, for a responsive view, use the <u>full width</u> option.<br>
          There are two themes available, the dark and light themes, the default theme is dark.<br>
          A functionality to move the iframes' content vertically was included, if a vertical adjustment is needed to make the iframes match between them.<br>
          <b><u>Important Note</u></b>: Not all websites can be iframed because of their own configuration, if you encounter any issues, please try another website.`}
        />
      </div>
      <div className="navbar-center">
        <h2 className="text-xl font-medium tracking-wider">Bankrate Site Diff Tool</h2>
      </div>
      <div className="navbar-end max-[370px]:w-auto">
        <label className="swap swap-rotate">
          {/* theme switcher */}
          <input
            type="checkbox"
            name="sideBySide"
            checked={isDarkMode}
            onChange={handleDarkModeChange}
          />
          <div className="swap-on">
            <div className="flex flex-col items-center">
              <IconContext.Provider value={{ className: 'text-3xl ' }}>
                <HiMoon aria-hidden />
              </IconContext.Provider>
            </div>
          </div>
          <div className="swap-off">
            <div className="flex flex-col items-center">
              <IconContext.Provider value={{ className: 'text-3xl' }}>
                <RiSunFill aria-hidden />
              </IconContext.Provider>
            </div>
          </div>
        </label>
      </div>
    </div>
  )
}

export default Navbar
