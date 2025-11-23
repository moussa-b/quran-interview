import { getChapters, getChapter, getVerse, getVersesByRange } from '@/lib/api/clients/quran/client';

describe('Quran API Client', () => {
  describe('getChapters', () => {
    it('should return chapters without language parameter', async () => {
      const result = await getChapters();
      expect(result).not.toBeNull();
      expect(result.chapters).not.toBeNull();
      expect(Array.isArray(result.chapters)).toBe(true);
    });

    it('should return chapters with language parameter', async () => {
      const result = await getChapters('en');
      expect(result).not.toBeNull();
      expect(result.chapters).not.toBeNull();
      expect(Array.isArray(result.chapters)).toBe(true);
    });
  });

  describe('getChapter', () => {
    it('should return a chapter by id', async () => {
      const result = await getChapter(1);
      expect(result).not.toBeNull();
      expect(result.chapter).not.toBeNull();
    });

    it('should return a chapter by id with language parameter', async () => {
      const result = await getChapter(1, 'en');
      expect(result).not.toBeNull();
      expect(result.chapter).not.toBeNull();
    });

    it('should return a valid chapter for id 2 (Al-Baqarah)', async () => {
      const result = await getChapter(2);
      expect(result).not.toBeNull();
      expect(result.chapter).not.toBeNull();
    });
  });

  describe('getVerse', () => {
    it('should return a verse by chapter and verse number', async () => {
      const result = await getVerse(1, 1);
      expect(result).not.toBeNull();
      expect(result.verse).not.toBeNull();
    });

    it('should return a verse with language parameter', async () => {
      const result = await getVerse(1, 1, 'en');
      expect(result).not.toBeNull();
      expect(result.verse).not.toBeNull();
    });

    it('should return a verse with translations', async () => {
      const result = await getVerse(1, 1, 'en', true);
      expect(result).not.toBeNull();
      expect(result.verse).not.toBeNull();
    });

    it('should return verse 2:255 (Ayat al-Kursi)', async () => {
      const result = await getVerse(2, 255);
      expect(result).not.toBeNull();
      expect(result.verse).not.toBeNull();
    });
  });

  describe('getVersesByRange', () => {
    it('should return a single verse when start and end are the same', async () => {
      const result = await getVersesByRange(1, 1, 1);
      expect(result).not.toBeNull();
      expect(result.verses).not.toBeNull();
      expect(Array.isArray(result.verses)).toBe(true);
      expect(result.verses.length).toBe(1);
    });

    it('should return multiple verses in a range', async () => {
      const result = await getVersesByRange(1, 1, 5);
      expect(result).not.toBeNull();
      expect(result.verses).not.toBeNull();
      expect(Array.isArray(result.verses)).toBe(true);
      expect(result.verses.length).toBe(5);
    });

    it('should return verses with language parameter', async () => {
      const result = await getVersesByRange(1, 1, 3, 'en');
      expect(result).not.toBeNull();
      expect(result.verses).not.toBeNull();
      expect(Array.isArray(result.verses)).toBe(true);
    });

    it('should return verses with translations', async () => {
      const result = await getVersesByRange(1, 1, 3, 'en', true);
      expect(result).not.toBeNull();
      expect(result.verses).not.toBeNull();
      expect(Array.isArray(result.verses)).toBe(true);
    });
  });
});
