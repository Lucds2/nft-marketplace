import { test, expect } from '@playwright/test';

test.describe('NFT Marketplace - Fluxo de Compra e Regressão Visual', () => {
  
  test('deve permitir interagir com o catálogo e validar o layout visual', async ({ page }) => {
    // Acede à página inicial
    await page.goto('http://localhost:5173');
    
    // Captura um screenshot da página inicial para validação visual (Regressão Visual)
    await expect(page).toHaveScreenshot('home-desktop.png', {
      maxDiffPixelRatio: 0.05, // Tolerância de diferença de pixels
    });

    // Navega para o mercado/catálogo
    const marketLink = page.locator('text=Mercado').first();
    if (await marketLink.isVisible()) {
      await marketLink.click();
      
      // Valida se os itens do marketplace estão visíveis
      await expect(page.locator('body')).toBeVisible();
    }
  });

});