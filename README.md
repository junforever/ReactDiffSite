# Site Diff Tool Comparison Project

## Overview

The Site Diff Tool is a websites comparison tool built with React. It enables users to compare two sites side by side or with an overlay effect, you can use it to compare your qa site vs your production site. The tool provides various customization options and themes to enhance the comparison experience.

## Built With

- React 18.2.0
- Tailwind CSS 3.4.1
- Vite 5.1.0
- DaisyUI 4.7.2
- Node 18.18.2
- React Icons

## Features

- Compare two sites side by side or with an overlay effect.
- Detects invalid URLs and highlights them in <span style="color:red">red</span>.
- Detects URLs that can't be embedded (or can but the page may not work/show correctly) and highlights them in <span style="color:orange">orange</span>.
- Customize the height of iframes within a range of 1500px - 25000px.
- Default iframe height is set to 8200px.
- Adjust opacity for overlay blend and onion modes.
- Choose from various viewport width options, including classy and treasury breakpoints.
- Use 'full width' option for responsive view on the iframes.
- A functionality to move the iframes' content vertically was included, for cases where the user needed a vertical adjustment to make the iframes match between them.
- Toggle between dark and light themes.
- Responsive design that works on all devices.
- 'Side to Side' compare mode is only available for large viewport and forward.
- For medium and lower viewports, the 'Comparison mode' will be hidden automatically and it will be set to 'overlay'.
- While the 'scroll position' is below the 'Settings' section, a sticky circular button will appear in the top left corner of the screen, this button allows the user to show and hide the settings, while continuing scrolling up/down between the iframes.
- 'Back to top' button is included, and will automatically appear on the bottom right corner of the screen.
- If a viewport that overflows the screen width is selected, the horizontal scroll bar will appear automatically.
- This application use local storage to save the settings configurations used during the user session.
- A reset settings button is included to restore local storage values to their default state.
- A modal with a brief description of how to use the tool is in the nav bar, in the right corner.
- Localhost sites like 'fantasia.test' can be loaded on the iframes too.
- Users can interact with the pages loaded in the iframes.

## How to Use

1. Enter the URLs of the websites you want to compare in the input fields.
2. Customize the height of iframes and adjust opacity for overlay modes as desired.
3. Choose viewport width options for the iframes inner pages visualization.
4. Toggle between dark and light themes for different visual experiences.
5. For the 'Overlay' mode, 'Swipe' option, moves the swipe line smoothly to avoid losing the line focus.
6. If a vertical adjustment is needed to make the iframes match, use the controls inside of 'Iframes Vertical Shifting' section.
7. If you want to reset all the settings to their default values, click on 'Reset Settings to Default' button.


## Additional Context

The Site Diff Tool provides a seamless experience for comparing websites. It offers a range of customization options and themes to suit different preferences. With its responsive design, users can access and utilize the tool on various devices for efficient website comparison.

## How to run it locally

Open the project folder using the terminal and run this command:

`npm i && npm run dev`

**Important Notes:**
- Not all websites can be iframed due to their own configurations. If you encounter any issues, please try another website.
- For Unix/Linux/macOS users, I recommend to use this configuration `git config --global core.autocrlf input` to avoid any issues and unnecessary LF/CRLF conversions of the end of line characters.

**For any questions please reach out me on github**

## This project was based on this [pianomister-diffsite-tool](https://github.com/pianomister/diffsite) that use vanilla javascript only.
