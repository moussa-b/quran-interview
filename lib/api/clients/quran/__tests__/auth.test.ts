import { getAccessToken, clearTokenCache } from '@/lib/api/clients/quran/auth';

describe('Quran API Auth', () => {
  beforeEach(() => {
    // Clear token cache before each test to ensure fresh token requests
    clearTokenCache();
  });

  describe('getAccessToken', () => {
    it('should return a valid access token', async () => {
      const token = await getAccessToken();
      expect(token).not.toBeNull();
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
    });

    it('should return the same token from cache on subsequent calls', async () => {
      const token1 = await getAccessToken();
      const token2 = await getAccessToken();
      expect(token1).toBe(token2);
    });
  });

  describe('clearTokenCache', () => {
    it('should clear the token cache', async () => {
      // Get a token first
      await getAccessToken();
      
      // Clear cache
      clearTokenCache();
      
      // Get a new token - should be different from cached one
      const newToken = await getAccessToken();
      expect(newToken).not.toBeNull();
      expect(typeof newToken).toBe('string');
      expect(newToken.length).toBeGreaterThan(0);
    });
  });
});
