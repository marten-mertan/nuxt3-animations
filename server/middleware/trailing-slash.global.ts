export default defineEventHandler((event) => {
  const url = getRequestURL(event)
  const pathname = url.pathname

  if (pathname.includes('.') || pathname.startsWith('/api')) return

  if (!pathname.endsWith('/')) {
    const redirectTo = `${pathname}/` + (url.search || '')
    return sendRedirect(event, redirectTo, 301)
  }
})
