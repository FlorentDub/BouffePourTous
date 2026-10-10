import { test, expect, type Locator } from '@playwright/test'

async function bbox(locator: Locator) {
  const box = await locator.boundingBox()
  expect(box, `element attendu visible: ${locator}`).not.toBeNull()
  return box!
}

function overlap(
  a: { x: number; y: number; width: number; height: number },
  b: { x: number; y: number; width: number; height: number }
) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  )
}

test.describe('Carte Leaflet', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/ressources', (route) =>
      route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 'e2e-1',
            name_fr: 'Frigo de test',
            name_en: 'Test fridge',
            type_fr: 'Frigo communautaire',
            type_en: 'Community fridge',
            description_fr: 'Frigo test',
            description_en: 'Test fridge',
            numero: '123',
            rue: 'rue Saint-Joseph',
            ville: 'Québec',
            latitude: 46.8139,
            longitude: -71.2082,
            horaire_fr: '24/7',
            horaire_en: '24/7',
            conditions_fr: 'Aucune',
            conditions_en: 'None',
          },
          {
            id: 'e2e-2',
            name_fr: 'Banque de test',
            name_en: 'Test bank',
            type_fr: 'Banque alimentaire',
            type_en: 'Food bank',
            description_fr: 'Banque test',
            description_en: 'Test bank',
            numero: '456',
            rue: 'rue Saint-Paul',
            ville: 'Québec',
            latitude: 46.8140,
            longitude: -71.2083,
            horaire_fr: '9h-17h',
            horaire_en: '9am-5pm',
            conditions_fr: 'Aucune',
            conditions_en: 'None',
          },
        ]),
      })
    )
    await page.goto('/')
    await expect(page.locator('.leaflet-container')).toBeVisible()
  })

  test('le bouton Ma position ne chevauche pas les controles zoom', async ({ page }) => {
    const locate = page.locator('.leaflet-control-locate')
    const zoomIn = page.locator('.leaflet-control-zoom-in')
    const zoomOut = page.locator('.leaflet-control-zoom-out')
    const container = page.locator('.leaflet-container')

    const locateBox = await bbox(locate)
    const zoomBox = await bbox(page.locator('.leaflet-control-zoom'))
    const mapBox = await bbox(container)

    expect(
      overlap(locateBox, zoomBox),
      'Le bouton Ma position chevauche les controles zoom'
    ).toBe(false)
    expect(
      overlap(locateBox, await bbox(zoomOut)),
      'Le bouton Ma position chevauche le bouton zoom-out'
    ).toBe(false)

    expect(locateBox.x).toBeGreaterThanOrEqual(mapBox.x)
    expect(locateBox.y + locateBox.height).toBeLessThanOrEqual(mapBox.y + mapBox.height)
  })

  test('le bouton Ma position reste dans la carte et cliquable', async ({ page }) => {
    const locate = page.locator('.leaflet-control-locate')
    const mapBox = await bbox(page.locator('.leaflet-container'))
    const locateBox = await bbox(locate)

    expect(locateBox.x).toBeGreaterThan(mapBox.x)
    expect(locateBox.y + locateBox.height).toBeLessThan(mapBox.y + mapBox.height)
    await expect(locate).toBeEnabled()
  })

  test('les marqueurs de ressources sont affiches', async ({ page }) => {
    await expect(page.locator('.leaflet-marker-icon').first()).toBeVisible()
  })

  test('les messages erreur ne chevauchent pas le bouton Ma position', async ({ page }) => {
    await page.route('**/api/ressources', (route) => route.fulfill({ body: '[]', contentType: 'application/json' }))
    await page.addInitScript(() => {
      navigator.geolocation.getCurrentPosition = (_success: (pos: GeolocationPosition) => void, onError: (err: GeolocationPositionError) => void) =>
        onError({ code: 1, message: 'denied' } as GeolocationPositionError)
    })
    await page.goto('/')
    const locate = page.locator('.leaflet-control-locate')
    await locate.click()
    const alert = page.locator('div.relative > p[role="alert"]')
    await expect(alert).toBeVisible()
    expect(overlap(await bbox(alert), await bbox(locate))).toBe(false)
  })
})

test.describe('Filtre par type', () => {
  test('les boutons de filtre affichent les compteurs et filtrent les marqueurs', async ({ page }) => {
    await page.route('**/api/ressources', (route) =>
      route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 'e2e-1',
            name_fr: 'Frigo de test',
            name_en: 'Test fridge',
            type_fr: 'Frigo communautaire',
            type_en: 'Community fridge',
            description_fr: 'Frigo test',
            description_en: 'Test fridge',
            numero: '123',
            rue: 'rue Saint-Joseph',
            ville: 'Québec',
            latitude: 46.8139,
            longitude: -71.2082,
            horaire_fr: '24/7',
            horaire_en: '24/7',
            conditions_fr: 'Aucune',
            conditions_en: 'None',
          },
          {
            id: 'e2e-2',
            name_fr: 'Banque de test',
            name_en: 'Test bank',
            type_fr: 'Banque alimentaire',
            type_en: 'Food bank',
            description_fr: 'Banque test',
            description_en: 'Test bank',
            numero: '456',
            rue: 'rue Saint-Paul',
            ville: 'Québec',
            latitude: 46.8140,
            longitude: -71.2083,
            horaire_fr: '9h-17h',
            horaire_en: '9am-5pm',
            conditions_fr: 'Aucune',
            conditions_en: 'None',
          },
        ]),
      })
    )
    await page.goto('/')
    await expect(page.locator('.leaflet-container')).toBeVisible()
    const markers = page.locator('.leaflet-marker-icon')
    await expect(markers).toHaveCount(2)

    const filtreBanque = page.getByRole('button', { name: /Banque alimentaire/ })
    await expect(filtreBanque).toBeVisible()
    await filtreBanque.click()
    await expect(markers).toHaveCount(1)

    const filtreTous = page.getByRole('button', { name: /^Tous/ })
    await filtreTous.click()
    await expect(markers).toHaveCount(2)
  })
})

test.describe('Mode liste', () => {
  test('le basculeur carte/liste affiche la liste des ressources', async ({ page }) => {
    await page.route('**/api/ressources', (route) =>
      route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 'e2e-1',
            name_fr: 'Frigo de test',
            name_en: 'Test fridge',
            type_fr: 'Frigo communautaire',
            type_en: 'Community fridge',
            description_fr: 'Frigo test',
            description_en: 'Test fridge',
            numero: '123',
            rue: 'rue Saint-Joseph',
            ville: 'Québec',
            latitude: 46.8139,
            longitude: -71.2082,
            horaire_fr: '24/7',
            horaire_en: '24/7',
            conditions_fr: 'Aucune',
            conditions_en: 'None',
          },
        ]),
      })
    )
    await page.goto('/')

    const switchListe = page.getByRole('button', { name: /^Liste/ })
    await expect(switchListe).toBeVisible()
    await switchListe.click()

    const item = page.getByRole('button', { name: /Frigo de test/ })
    await expect(item).toBeVisible()
    await item.click()
    await expect(page.getByText('24/7')).toBeVisible()
  })
})
