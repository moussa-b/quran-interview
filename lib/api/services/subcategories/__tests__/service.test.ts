import { getSubcategories, getSubcategory } from '@/lib/api/services/subcategories/service';

describe('Subcategories Service', () => {
  describe('getSubcategories', () => {
    it('should return subcategories without filters', async () => {
      const result = await getSubcategories();
      expect(result).not.toBeNull();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should return subcategories filtered by categoryId', async () => {
      // Assuming categoryId 1 exists in the database
      const result = await getSubcategories(1);
      expect(result).not.toBeNull();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should return subcategories filtered by language', async () => {
      const result = await getSubcategories(undefined, 'en');
      expect(result).not.toBeNull();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should return subcategories filtered by categoryId and language', async () => {
      // Assuming categoryId 1 exists in the database
      const result = await getSubcategories(1, 'en');
      expect(result).not.toBeNull();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('getSubcategory', () => {
    it('should return a subcategory by id', async () => {
      // Assuming subcategory id 1 exists in the database
      const result = await getSubcategory(1);
      expect(result).not.toBeNull();
    });

    it('should return a subcategory by id with language filter', async () => {
      // Assuming subcategory id 1 exists in the database
      const result = await getSubcategory(1, 'en');
      expect(result).not.toBeNull();
    });

    it('should return null for non-existent subcategory', async () => {
      const result = await getSubcategory(999999);
      expect(result).toBeNull();
    });
  });
});
