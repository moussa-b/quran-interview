import { getTopics, getTopicById, getTopicBySlug } from '@/lib/api/services/topics/service';

describe('Topics Service', () => {
  describe('getTopics', () => {
    it('should return topics without language filter', async () => {
      const result = await getTopics();
      expect(result).not.toBeNull();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should return topics filtered by language', async () => {
      const result = await getTopics('en');
      expect(result).not.toBeNull();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('getTopicById', () => {
    it('should return a topic by id', async () => {
      // Assuming topic id 1 exists in the database
      const result = await getTopicById(1);
      expect(result).not.toBeNull();
    });

    it('should return a topic by id with language filter', async () => {
      // Assuming topic id 1 exists in the database
      const result = await getTopicById(1, 'en');
      expect(result).not.toBeNull();
    });

    it('should return null for non-existent topic', async () => {
      const result = await getTopicById(999999);
      expect(result).toBeNull();
    });
  });

  describe('getTopicBySlug', () => {
    it('should return a topic by slug', async () => {
      // Assuming a topic with slug exists in the database
      // You may need to adjust the slug based on your actual data
      const topics = await getTopics();
      if (topics.length > 0) {
        const slug = topics[0].slug;
        const result = await getTopicBySlug(slug);
        expect(result).not.toBeNull();
      }
    });

    it('should return a topic by slug with language filter', async () => {
      // Assuming a topic with slug exists in the database
      const topics = await getTopics();
      if (topics.length > 0) {
        const slug = topics[0].slug;
        const result = await getTopicBySlug(slug, 'en');
        expect(result).not.toBeNull();
      }
    });

    it('should return null for non-existent slug', async () => {
      const result = await getTopicBySlug('non-existent-slug-12345');
      expect(result).toBeNull();
    });
  });
});
