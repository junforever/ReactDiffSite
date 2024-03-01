export const DEFAULT_IHEIGHT = 8200
export const MIN_IHEIGHT = 1500
export const MAX_IHEIGHT = 25000
export const IHEIGHT_STEP = 250
export const MOBILE_TOP_DISTANCE = 350
export const OTHER_TOP_DISTANCE = 220
export const BTT_TOP_DISTANCE = 300
// according to the intersection observer
export const LARGE_BREAKPOINT = 1007
// according to the intersection observer
export const MOBILE_BREAKPOINT = 624
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
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', 'i') // fragment locator

  return urlPattern.test(url)
}

// TODO:
/*
*- poner un range para el iheight
*- agregar la opcion para mover verticalmente los iframes
*- agregar el boton de reset to default
*- agregar el boton de back to top
*- notificacion de error si la página tiene restricciones de cargar en iframe
*- eliminar el bloqueo de localhost
*- eliminar el bloque de interactuar con la página
*- agregar los otros breakpoints y el scroll horizontal
*- cuando se hace resize y se oculta el tipo de comparacion setearle a overlay
- actualizar la ayuda y los docs
*/
