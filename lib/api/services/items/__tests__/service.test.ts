import { getItems, getItem } from '@/lib/api/services/items/service';

describe('Items Service', () => {
  describe('getItems', () => {
    it('should return items without filters', async () => {
      const result = await getItems();
      expect(result).not.toBeNull();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should return items filtered by categoryId', async () => {
      // Assuming categoryId 1 exists in the database
      const result = await getItems(1);
      expect(result).not.toBeNull();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should return items filtered by subcategoryId', async () => {
      // Assuming subcategoryId 1 exists in the database
      const result = await getItems(undefined, 1);
      expect(result).not.toBeNull();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should return items filtered by language', async () => {
      const result = await getItems(undefined, undefined, 'en');
      expect(result).not.toBeNull();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should return items filtered by categoryId and language', async () => {
      // Assuming categoryId 1 exists in the database
      const result = await getItems(1, undefined, 'en');
      expect(result).not.toBeNull();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should return items filtered by subcategoryId and language', async () => {
      // Assuming subcategoryId 1 exists in the database
      const result = await getItems(undefined, 1, 'en');
      expect(result).not.toBeNull();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('getItem', () => {
    it('should return an item by id', async () => {
      // Assuming item id 1 exists in the database
      const result = await getItem(1);
      expect(result).not.toBeNull();
    });

    it('should return an item by id with language filter', async () => {
      // Assuming item id 1 exists in the database
      const result = await getItem(1, 'en');
      expect(result).not.toBeNull();
    });

    it('should return null for non-existent item', async () => {
      const result = await getItem(999999);
      expect(result).toBeNull();
    });
  });
});
