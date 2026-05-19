const RAZORPAY_OVERLAY_SELECTOR = [
  '.razorpay-container',
  '.razorpay-backdrop',
  'iframe[src*="api.razorpay.com"]',
  'iframe[src*="checkout.razorpay.com"]',
].join(', ')

export function pinRazorpayOverlayToViewport() {
  const apply = () => {
    const containers = document.querySelectorAll('.razorpay-container, .razorpay-backdrop')

    containers.forEach((element) => {
      Object.assign(element.style, {
        position: 'fixed',
        inset: '0',
        width: '100vw',
        height: '100vh',
        zIndex: '2147483647',
      })
    })
  }

  apply()
  requestAnimationFrame(apply)
  setTimeout(apply, 250)
  setTimeout(apply, 750)
}

export function cleanupRazorpayOverlay() {
  document.querySelectorAll(RAZORPAY_OVERLAY_SELECTOR).forEach((element) => {
    element.remove()
  })

  document.body.classList.remove('razorpay-checkout-frame')
  document.body.style.overflow = ''
  document.documentElement.style.overflow = ''
}
