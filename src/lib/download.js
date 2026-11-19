import apiClient from './apiClient'

const MIME_EXTENSIONS = {
  'application/pdf': '.pdf',
  'application/msword': '.doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
  'application/vnd.ms-excel': '.xls',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
}

function getFilename(response, fallback) {
  const disposition = response.headers.get('Content-Disposition') ?? ''
  const encoded = /filename\*=UTF-8''([^;]+)/i.exec(disposition)
  if (encoded) return decodeURIComponent(encoded[1])

  const quoted = /filename="?([^";]+)"?/i.exec(disposition)
  return quoted ? quoted[1] : fallback
}

function withExtension(name, contentType) {
  if (/\.[a-z0-9]+$/i.test(name)) return name
  const mime = (contentType ?? '').split(';')[0].trim()
  const extension = MIME_EXTENSIONS[mime]
  return extension ? `${name}${extension}` : name
}

export async function download(path, fallbackName = 'unduhan') {
  const response = await apiClient(path, { raw: true })
  const blob = await response.blob()
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = withExtension(
    getFilename(response, fallbackName),
    response.headers.get('Content-Type'),
  )
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

export default download
