/*
 * Frontend smoke checks for the campus event app (issue #17 evidence).
 *
 * The Docker Compose stack must be running (frontend on :5173, backend on :8080).
 * Playwright is not a project dependency, so install it ad hoc first:
 *
 *   npm install --no-save playwright && npx playwright install chromium
 *   node documentation/qa/frontend-smoke.cjs
 *
 * Every line prints PASS or FAIL with the observed value; the exit code is 1 when
 * any check fails. Screenshots are written to screenshots/.
 */
const path = require('path')
const { chromium } = require('playwright')

const BASE = process.env.APP_URL || 'http://localhost:5173'
const API = process.env.API_URL || 'http://localhost:8080'
const SHOTS = path.resolve(__dirname, '../../screenshots')
const STUDENT = { email: 'sidra.butt@gmail.com', password: 'Demo@12345' }
const ADMIN = { email: 'ayesha.khan.admin@gmail.com', password: 'Demo@12345' }
let failures = 0

function log(ok, name, extra = '') {
  if (!ok) failures += 1
  console.log(`${ok ? 'PASS' : 'FAIL'}\t${name}${extra ? '\t' + extra : ''}`)
}

async function login(page, { email, password }) {
  await page.goto(`${BASE}/login`)
  await page.getByPlaceholder('you@university.edu').fill(email)
  await page.locator('input[type=password]').fill(password)
  await page.getByRole('button', { name: 'Log in' }).click()
  await page.waitForURL(/\/my-events|\/dashboard/, { timeout: 15000 })
  await page.waitForLoadState('networkidle')
}

async function resultCount(page) {
  await page.waitForLoadState('networkidle')
  return (await page.locator('.result-count').first().innerText()).trim()
}

;(async () => {
  const browser = await chromium.launch()
  const guest = await browser.newContext({ viewport: { width: 1250, height: 710 } })
  const page = await guest.newPage()

  await page.goto(`${BASE}/events`)
  let count = await resultCount(page)
  log(count === '1–12 of 555 events', 'public list shows 12 of 555 events', count)

  await page.getByPlaceholder('Search events').fill('Resume and LinkedIn Clinic')
  await page.waitForTimeout(600)
  count = await resultCount(page)
  const searched = Number(count.match(/of (\d+) events/)?.[1] ?? 0)
  log(searched > 0 && searched < 555, 'search narrows the list', count)
  log(!page.url().includes('page='), 'search resets pagination', page.url())

  await page.getByPlaceholder('Search events').fill('')
  await page.getByRole('button', { name: 'Workshops', exact: true }).click()
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(400)
  count = await resultCount(page)
  log(page.url().includes('category=WORKSHOP'), 'category filter updates the URL', page.url())
  log(/of 11\d events/.test(count), 'category filter narrows the list', count)

  await page.getByRole('button', { name: 'All events', exact: true }).click()
  await page.waitForLoadState('networkidle')
  await page.getByRole('button', { name: 'Next' }).click()
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(500)
  count = await resultCount(page)
  log(page.url().includes('page=1'), 'Next button advances the URL', page.url())
  log(count === '13–24 of 555 events', 'Next button loads page 2 rows', count)
  log((await page.locator('.pagination span').innerText()).includes('Page 2 of 47'), 'pagination label shows page 2')
  await page.screenshot({ path: path.join(SHOTS, 'events-pagination.png') })

  await page.goto(`${BASE}/dashboard/events/new`)
  await page.waitForLoadState('networkidle')
  log(page.url().endsWith('/login'), 'guest is redirected from the admin editor', page.url())

  const studentCtx = await browser.newContext({ viewport: { width: 1250, height: 710 } })
  const studentPage = await studentCtx.newPage()
  await login(studentPage, STUDENT)
  log(studentPage.url().endsWith('/my-events'), 'student lands on my events', studentPage.url())
  await studentPage.goto(`${BASE}/dashboard`)
  await studentPage.waitForLoadState('networkidle')
  log(studentPage.url().endsWith('/my-events'), 'student cannot open the admin dashboard', studentPage.url())

  const events = await (await fetch(`${API}/api/events?size=100`)).json()
  const openEvent = events.content.find((event) => event.capacity - (event.registeredCount || 0) > 2)
  if (!openEvent) {
    log(false, 'registration round trip', 'no event with free seats found')
  } else {
    await studentPage.goto(`${BASE}/event?id=${openEvent.id}`)
    await studentPage.waitForLoadState('networkidle')
    await studentPage.getByRole('button', { name: 'Register now' }).click()
    await studentPage.waitForTimeout(1200)
    const registered = await studentPage.locator('.success').first().innerText()
    log(/registered/i.test(registered), 'student registers for an event', registered.trim())

    await studentPage.goto(`${BASE}/my-events`)
    await studentPage.waitForLoadState('networkidle')
    await studentPage.waitForTimeout(800)
    studentPage.once('dialog', (dialog) => dialog.accept())
    await studentPage.getByRole('button', { name: 'Cancel registration' }).first().click()
    await studentPage.waitForTimeout(1200)
    log(!(await studentPage.locator('body').innerText()).includes(openEvent.title), 'student cancels the registration', openEvent.title)
  }

  const adminCtx = await browser.newContext({ viewport: { width: 1250, height: 710 } })
  const adminPage = await adminCtx.newPage()
  await login(adminPage, ADMIN)
  log(adminPage.url().endsWith('/dashboard'), 'admin lands on the dashboard', adminPage.url())
  await adminPage.waitForLoadState('networkidle')
  await adminPage.waitForTimeout(800)
  const hasCategoryFilters = await adminPage.getByRole('group', { name: 'Filter by category' }).isVisible()
  const hasStatusFilters = await adminPage.getByRole('group', { name: 'Status' }).isVisible()
  const hasSearch = await adminPage.getByLabel('Search your events').isVisible()
  log(hasCategoryFilters && hasStatusFilters && hasSearch, 'admin dashboard exposes search, category and status filters')
  const before = await resultCount(adminPage)
  await adminPage.getByLabel('Search your events').fill('zzzz-no-match')
  await adminPage.waitForTimeout(600)
  const filtered = await resultCount(adminPage)
  log(filtered === '0–0 of 0 events', 'admin search filters the table', `${before} -> ${filtered}`)
  await adminPage.getByRole('button', { name: 'Clear filters' }).click()
  await adminPage.waitForTimeout(600)
  log((await resultCount(adminPage)) === before, 'clear filters restores the table', before)
  await adminPage.screenshot({ path: path.join(SHOTS, 'admin-dashboard-filters.png') })

  const title = `Playwright QA ${Date.now()}`
  await adminPage.goto(`${BASE}/dashboard/events/new`)
  await adminPage.waitForLoadState('networkidle')
  await adminPage.locator('label:has-text("Title") input').fill(title)
  await adminPage.locator('label:has-text("Date") input').fill('2027-12-15')
  await adminPage.locator('label:has-text("Time") input').fill('10:00')
  await adminPage.locator('label:has-text("Location") input').fill('QA Lab')
  await adminPage.locator('label:has-text("Capacity") input').fill('5')
  await adminPage.getByRole('button', { name: 'Create event' }).click()
  await adminPage.waitForLoadState('networkidle')
  await adminPage.waitForTimeout(800)
  log((await adminPage.locator('body').innerText()).includes('Event created.'), 'admin creates an event', adminPage.url())
  const row = adminPage.locator('tr', { hasText: title }).first()
  log(await row.isVisible(), 'new event appears in the admin table', title)

  adminPage.once('dialog', (dialog) => dialog.accept())
  await row.getByRole('button', { name: 'Delete' }).click()
  await adminPage.waitForTimeout(1200)
  log((await adminPage.locator('body').innerText()).includes('Event deleted.'), 'admin deletes an event without registrations')
  log((await adminPage.locator('tr', { hasText: title }).count()) === 0, 'deleted event is gone from the table')

  await adminPage.setViewportSize({ width: 376, height: 504 })
  await adminPage.waitForTimeout(500)
  const adminOverflow = await adminPage.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  log(adminOverflow <= 2, 'admin dashboard fits a 376px viewport', `overflow ${adminOverflow}px`)
  await adminPage.screenshot({ path: path.join(SHOTS, 'admin-dashboard-mobile.png') })
  await page.setViewportSize({ width: 376, height: 504 })
  await page.goto(`${BASE}/events`)
  await page.waitForLoadState('networkidle')
  const publicOverflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  log(publicOverflow <= 2, 'public list fits a 376px viewport', `overflow ${publicOverflow}px`)

  console.log(`\n${failures === 0 ? 'ALL CHECKS PASSED' : failures + ' CHECK(S) FAILED'}`)
  await browser.close()
  process.exit(failures === 0 ? 0 : 1)
})().catch((error) => {
  console.error(error)
  process.exit(2)
})
