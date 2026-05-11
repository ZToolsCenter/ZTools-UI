import { onBeforeUnmount } from 'vue'

let overlayScrollLockCount = 0
let originalBodyOverflow = ''

function lockBodyScroll(): void {
  if (typeof document === 'undefined') {
    return
  }

  if (overlayScrollLockCount === 0) {
    originalBodyOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
  }

  overlayScrollLockCount += 1
}

function unlockBodyScroll(): void {
  if (typeof document === 'undefined') {
    return
  }

  overlayScrollLockCount = Math.max(0, overlayScrollLockCount - 1)

  if (overlayScrollLockCount === 0) {
    document.body.style.overflow = originalBodyOverflow
    originalBodyOverflow = ''
  }
}

export function useBodyScrollLock(): { lock: () => void; unlock: () => void } {
  let locked = false

  function lock(): void {
    if (locked) {
      return
    }

    lockBodyScroll()
    locked = true
  }

  function unlock(): void {
    if (!locked) {
      return
    }

    unlockBodyScroll()
    locked = false
  }

  onBeforeUnmount(() => {
    unlock()
  })

  return {
    lock,
    unlock
  }
}
