import gsap from "gsap"

// Queue item animation
export const animateQueueItem = (element: HTMLElement) => {
  gsap.fromTo(
    element,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.4, ease: "back.out" }
  )
}

// Vote button animation
export const animateVoteButton = (element: HTMLElement) => {
  gsap.to(element, {
    scale: 0.95,
    duration: 0.1,
    yoyo: true,
    repeat: 1,
    ease: "power2.inOut",
  })
}

// Vote count pulse animation
export const animateVoteCount = (element: HTMLElement) => {
  gsap.to(element, {
    scale: 1.2,
    duration: 0.3,
    yoyo: true,
    repeat: 1,
    ease: "back.out",
  })
}

// Form submission animation
export const animateFormSubmit = (element: HTMLElement) => {
  gsap.to(element, {
    scale: 0.98,
    duration: 0.1,
    yoyo: true,
    repeat: 1,
    ease: "power2.inOut",
  })
}

// Input focus animation
export const animateInputFocus = (element: HTMLElement) => {
  gsap.to(element, {
    boxShadow: "0 0 0 3px rgba(34, 197, 94, 0.1)",
    duration: 0.3,
    ease: "power2.out",
  })
}

// Input blur animation
export const animateInputBlur = (element: HTMLElement) => {
  gsap.to(element, {
    boxShadow: "0 0 0 0px rgba(34, 197, 94, 0)",
    duration: 0.3,
    ease: "power2.out",
  })
}

// Song entry animation
export const animateSongEntry = (element: HTMLElement) => {
  gsap.fromTo(
    element,
    { opacity: 0, scale: 0.95 },
    { opacity: 1, scale: 1, duration: 0.5, ease: "back.out" }
  )
}

// Song exit animation
export const animateSongExit = (element: HTMLElement): Promise<void> => {
  return gsap.to(element, {
    opacity: 0,
    scale: 0.9,
    duration: 0.3,
    ease: "power2.in",
  }).then()
}

// Container stagger animation for queue items
export const staggerQueueItems = (elements: NodeListOf<Element>) => {
  gsap.fromTo(
    elements,
    { opacity: 0, y: 20 },
    {
      opacity: 1,
      y: 0,
      duration: 0.4,
      stagger: 0.08,
      ease: "back.out",
    }
  )
}
