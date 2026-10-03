import { test, expect } from '@playwright/test';

test.describe('NFT Marketplace - Testes E2E de Smoke e Layout', () => {
  
  test('deve carregar a página inicial com sucesso', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await expect(page).toHaveTitle(/.*Marketplace|NFT|Kurio/i);
  });

  test('deve navegar para a secção de catálogo/mercado', async ({ page }) => {
    await page.goto('http://localhost:5173');
    
    // Procura por um link ou botão de navegação para o mercado/catálogo e clica
    const marketLink = page.locator('text=Mercado').first();
    if (await marketLink.isVisible()) {
      await marketLink.click();
      await expect(page).toHaveURL(/.*mercado|catalog/i);
    }
  });

});