import { getRecitations, getDefaultRecitationId, clearRecitationCache } from '@/lib/api/clients/quran/recitations';

describe('Quran API Recitations', () => {
  beforeEach(() => {
    clearRecitationCache();
  });

  it('should return recitations in English', async () => {
    const recitations = await getRecitations('en');
    expect(Array.isArray(recitations)).toBe(true);
    expect(recitations.length).toBeGreaterThan(0);

    const first = recitations[0];
    expect(first).toHaveProperty('id');
    expect(first).toHaveProperty('reciter_name');
    expect(first).toHaveProperty('style');
    expect(first).toHaveProperty('translated_name');
  });

  it('should cache recitations per language', async () => {
    const firstCall = await getRecitations('en');
    const secondCall = await getRecitations('en');
    expect(firstCall).toBe(secondCall);
  });

  it('should clear the recitation cache', async () => {
    const firstCall = await getRecitations('en');
    clearRecitationCache();
    const secondCall = await getRecitations('en');
    expect(firstCall).not.toBe(secondCall);
  });

  it('should support different languages', async () => {
    const english = await getRecitations('en');
    const arabic = await getRecitations('ar');

    expect(Array.isArray(english)).toBe(true);
    expect(Array.isArray(arabic)).toBe(true);
    expect(english.length).toBeGreaterThan(0);
    expect(arabic.length).toBeGreaterThan(0);
  });

  it('should return the first recitation id from cache when available', async () => {
    const cachedRecitations = await getRecitations('en'); // prime cache

    const defaultId = await getDefaultRecitationId('en');

    expect(defaultId).toBe(cachedRecitations[0].id);
  });

  it('should populate the cache when requesting default id with empty cache', async () => {
    clearRecitationCache();

    const defaultId = await getDefaultRecitationId('en');

    const recitationsFromCache = await getRecitations('en');
    expect(recitationsFromCache[0].id).toBe(defaultId);
  });
});


