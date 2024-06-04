/** CONFIG VARIABLES */
export const DEFAULT_IHEIGHT = 8200
export const MIN_IHEIGHT = 1500
export const MAX_IHEIGHT = 25000
export const IHEIGHT_STEP = 250
export const BTT_TOP_DISTANCE = 300
// according to the intersection observer
export const LARGE_BREAKPOINT = 1007
// according to the intersection observer
export const DEFAULT_DIFF_INPUT = {
  leftUrl: '',
  rightUrl: ''
}

export const DEFAULT_IFRAME_SETTINGS = {
  iFrameContainerWidth: '100%',
  iFrameContainerPaddingRight: '0',
  iFrameJustifyContent: 'center',
  swiperPos: window.innerWidth / 2
}

export const DEFAULT_DIFF_SETTINGS = {
  iHeight: DEFAULT_IHEIGHT,
  iWidth: 0,
  sideBySide: false,
  overlayMode: 'swipe',
  opacity: 1,
  leftIFrameTop: '0',
  rightIFrameTop: '0',
  ...DEFAULT_IFRAME_SETTINGS
}

export const DEFAULT_STICKY_SETTINGS_CONF = {
  position: '',
  visibility: true
}

export const IMPORT_SETTINGS = {
  urls: DEFAULT_DIFF_INPUT,
  settings: DEFAULT_DIFF_SETTINGS
}

/** GLOBAL FUNCTIONS */

export function isValidUrl (url) {
  if (!url) return ''

  const enhancedUrl = enhanceUrl(url)

  if (checkValidUrl(enhancedUrl)) return enhancedUrl

  return ''
}

export function isNumber (value) {
  return /^[-]?[0-9]+$/.test(value)
}

export function handleWidthResize (props) {
  const initSwiperPos = {
    ...DEFAULT_IFRAME_SETTINGS,
    swiperPos: parseInt(props.iWidth) === 0 ? window.innerWidth / 2 : props.iWidth / 2
  }

  if (parseInt(props.iWidth) === 0) return initSwiperPos

  const { innerWidth } = window

  if (props.sideBySide) {
    if (((parseInt(props.iWidth) * 2) + 24) > innerWidth) {
      return {
        ...initSwiperPos,
        iFrameContainerWidth: `${((parseInt(props.iWidth) * 2) + 24)}px`,
        iFrameContainerPaddingRight: '1rem',
        iFrameJustifyContent: 'flex-start'

      }
    }
    return initSwiperPos
  }

  if ((parseInt(props.iWidth) + 32) > innerWidth) {
    return {
      ...initSwiperPos,
      iFrameContainerWidth: `${parseInt(props.iWidth)}px`,
      iFrameContainerPaddingRight: '1rem',
      iFrameJustifyContent: 'flex-start'
    }
  }

  return initSwiperPos
}

function enhanceUrl (url) {
  if (url.indexOf('http') !== 0) url = 'https://' + url
  return url
};

function checkValidUrl (url) {
  const urlPattern = new RegExp('^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|localhost|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', 'i') // fragment locator

  return urlPattern.test(url)
}

export function currentDateTimeString () {
  const dateFormatOptions = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false
  }

  const formatter = new Intl.DateTimeFormat('en-US', dateFormatOptions)
  // this return dd_mm_yy_hh_mim_sec eg: 5_1_2024_14_57_31
  return formatter.format(Date.now()).replaceAll('/', '_').replaceAll(', ', '_').replaceAll(':', '_')
}

export function parseJSON (jsonString, errorAdditionalText = '') {
  if (jsonString === '' || jsonString === null) {
    return {
      data: null,
      err: 'The json string is empty'
    }
  }

  try {
    const jsonObj = JSON.parse(jsonString)
    return {
      data: jsonObj,
      err: null
    }
  } catch (err) {
    return {
      data: null,
      err: `There was an error parsing the json string: ${err} ${errorAdditionalText && `<br>${errorAdditionalText}`}`
    }
  }
}

export function objectPropertiesCompare (baseObj, objToCompare) {
  return Object.keys(baseObj).every(prop => {
    if (typeof baseObj[prop] === 'object') {
      const resp = objectPropertiesCompare(baseObj[prop], objToCompare[prop])
      if (!resp) return false
    }
    return Object.hasOwn(objToCompare, prop) && typeof baseObj[prop] === typeof objToCompare[prop]
  })
}
