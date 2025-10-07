export default defineEventHandler((event) => {
  const url = getRequestURL(event)
  const pathname = url.pathname

  if (
    pathname === '/'
    || pathname.endsWith('/')
    || pathname.includes('.')
    || pathname.startsWith('/api')
  ) {
    return
  }

  // Добавляем слэш и редиректим
  return sendRedirect(event, `${pathname}/` + (url.search || ''), 301)
})
