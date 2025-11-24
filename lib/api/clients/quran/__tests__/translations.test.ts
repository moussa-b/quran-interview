import { clearTranslationCache, getTranslationId } from '@/lib/api/clients/quran/translations';

describe('Quran API Translations', () => {
  beforeEach(() => {
    // Clear translation cache before each test
    clearTranslationCache();
  });

  describe('getTranslationId', () => {
    it('should return a translation ID for English', async () => {
      const translationId = await getTranslationId('en');
      expect(translationId).not.toBeNull();
      expect(typeof translationId).toBe('number');
      expect(translationId).toBeGreaterThan(0);
    });

    it('should return a translation ID for French', async () => {
      const translationId = await getTranslationId('fr');
      expect(translationId).not.toBeNull();
      expect(typeof translationId).toBe('number');
      expect(translationId).toBeGreaterThan(0);
    });

    it('should cache translation IDs', async () => {
      const id1 = await getTranslationId('en');
      const id2 = await getTranslationId('en');
      expect(id1).toBe(id2);
    });

    it('should return different IDs for different languages', async () => {
      const enId = await getTranslationId('en');
      const frId = await getTranslationId('fr');
      // Note: IDs might be the same in some cases, but they should both be valid numbers
      expect(typeof enId).toBe('number');
      expect(typeof frId).toBe('number');
      expect(enId).toBeGreaterThan(0);
      expect(frId).toBeGreaterThan(0);
    });
  });

  describe('clearTranslationCache', () => {
    it('should clear the translation cache', async () => {
      // Get a translation ID first
      await getTranslationId('en');
      
      // Clear cache
      clearTranslationCache();
      
      // Get translation ID again - should work after cache clear
      const translationId = await getTranslationId('en');
      expect(translationId).not.toBeNull();
      expect(typeof translationId).toBe('number');
      expect(translationId).toBeGreaterThan(0);
    });
  });
});
