import apiClient from './apiClient'

function getFilename(response, fallback) {
  const disposition = response.headers.get('Content-Disposition') ?? ''
  const encoded = /filename\*=UTF-8''([^;]+)/i.exec(disposition)
  if (encoded) return decodeURIComponent(encoded[1])

  const quoted = /filename="?([^";]+)"?/i.exec(disposition)
  return quoted ? quoted[1] : fallback
}

export async function download(path, fallbackName = 'unduhan') {
  const response = await apiClient(path, { raw: true })
  const blob = await response.blob()
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = getFilename(response, fallbackName)
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

export default download
