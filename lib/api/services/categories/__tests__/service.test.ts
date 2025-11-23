import { getCategories, getCategory } from '@/lib/api/services/categories/service';

describe('Categories Service', () => {
  describe('getCategories', () => {
    it('should return categories without filters', async () => {
      const result = await getCategories();
      expect(result).not.toBeNull();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should return categories filtered by topicId', async () => {
      // Assuming topicId 1 exists in the database
      const result = await getCategories(1);
      expect(result).not.toBeNull();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should return categories filtered by language', async () => {
      const result = await getCategories(undefined, 'en');
      expect(result).not.toBeNull();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should return categories filtered by topicId and language', async () => {
      // Assuming topicId 1 exists in the database
      const result = await getCategories(1, 'en');
      expect(result).not.toBeNull();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('getCategory', () => {
    it('should return a category by id', async () => {
      // Assuming category id 1 exists in the database
      const result = await getCategory(1);
      expect(result).not.toBeNull();
    });

    it('should return a category by id with language filter', async () => {
      // Assuming category id 1 exists in the database
      const result = await getCategory(1, 'en');
      expect(result).not.toBeNull();
    });

    it('should return null for non-existent category', async () => {
      const result = await getCategory(999999);
      expect(result).toBeNull();
    });
  });
});
