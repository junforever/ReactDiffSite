export const DEFAULT_IHEIGHT = 8200
export const MIN_IHEIGHT = 1500
export const MAX_IHEIGHT = 25000
export const IHEIGHT_STEP = 250

export function isValidUrl (url) {
  if (!url) return ''

  const enhancedUrl = enhanceUrl(url)

  if (checkValidUrl(enhancedUrl)) return enhancedUrl

  return ''
}

export function isNumber (value) {
  return /^[-]?[0-9]+$/.test(value)
}

function enhanceUrl (url) {
  if (url.indexOf('http') !== 0) url = 'https://' + url
  return url
};

function checkValidUrl (url) {
  if (url.indexOf('localhost') !== -1) return false
  if (url.indexOf('fantasia.test') !== -1) return false

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
- agregar el boton de reset to default
- agregar el boton de back to top
- notificacion de error si la página tiene restricciones de cargar en iframe
- eliminar el bloqueo de localhost
- eliminar el bloque de interactuar con la página
- agregar los otros breakpoints y el scroll horizontal
- actualizar la ayuda y los docs
*/
