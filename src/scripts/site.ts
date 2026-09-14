// Shared behaviour for every page: navbar, mobile menu, reveals, counters,
// article rail. Every block is guarded on its elements so any page can import it.

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

// ---------- Navbar: solid once scrolled past the top ----------
// Pages without a dark header set data-solid on #navbar to keep it solid always.
const navbar = document.getElementById("navbar")
const menuBtn = document.getElementById("menu-btn")
const mobileMenu = document.getElementById("mobile-menu")

if (navbar) {
  const alwaysSolid = navbar.hasAttribute("data-solid")
  const menuOpen = () => mobileMenu !== null && !mobileMenu.hidden
  const update = () =>
    navbar.classList.toggle(
      "is-scrolled",
      alwaysSolid || menuOpen() || window.scrollY > 24,
    )
  update()
  window.addEventListener("scroll", update, { passive: true })

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", () => {
      mobileMenu.hidden = !mobileMenu.hidden
      menuBtn.setAttribute("aria-expanded", String(!mobileMenu.hidden))
      update()
    })
    for (const link of mobileMenu.querySelectorAll("a")) {
      link.addEventListener("click", () => {
        mobileMenu.hidden = true
        menuBtn.setAttribute("aria-expanded", "false")
      })
    }
  }
}

// ---------- Scroll reveals ----------
// `[data-reveal]` starts hidden (main.css); add `.is-visible` on first entry.
const reveals = document.querySelectorAll<HTMLElement>("[data-reveal]")
if (reveals.length > 0) {
  if (reduceMotion) {
    for (const el of reveals) el.classList.add("is-visible")
  } else {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const el = entry.target as HTMLElement
          const delay = Number(el.dataset.revealDelay ?? 0)
          if (delay > 0) el.style.transitionDelay = `${delay}ms`
          el.classList.add("is-visible")
          obs.unobserve(el)
        }
      },
      { rootMargin: "0px 0px -60px 0px" },
    )
    for (const el of reveals) observer.observe(el)
  }
}

// ---------- Counting stats ----------
const numberFormat = new Intl.NumberFormat("id-ID")

function countUp(el: HTMLElement) {
  const target = Number(el.dataset.count)
  const suffix = el.dataset.suffix ?? ""
  if (reduceMotion) {
    el.textContent = numberFormat.format(target) + suffix
    return
  }
  const duration = 1800
  const start = performance.now()
  const tick = (now: number) => {
    const p = Math.min((now - start) / duration, 1)
    const eased = 1 - Math.pow(1 - p, 3)
    el.textContent = numberFormat.format(Math.round(target * eased)) + suffix
    if (p < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

const counters = document.querySelectorAll<HTMLElement>("[data-count]")
if (counters.length > 0) {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        countUp(entry.target as HTMLElement)
        obs.unobserve(entry.target)
      }
    },
    { threshold: 0.6 },
  )
  for (const el of counters) observer.observe(el)
}

// ---------- Article rail arrows (home page) ----------
const rail = document.querySelector<HTMLElement>(".rail")
if (rail) {
  const step = () => (rail.firstElementChild?.getBoundingClientRect().width ?? 340) + 32
  const behavior: ScrollBehavior = reduceMotion ? "auto" : "smooth"
  document
    .querySelector(".rail-prev")
    ?.addEventListener("click", () => rail.scrollBy({ left: -step(), behavior }))
  document
    .querySelector(".rail-next")
    ?.addEventListener("click", () => rail.scrollBy({ left: step(), behavior }))
}
