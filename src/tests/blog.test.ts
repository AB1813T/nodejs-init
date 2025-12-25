import request from 'supertest';
import app from '../app';
import { describe, test, expect, beforeAll } from '@jest/globals';

describe('Blog API Integration Tests', () => {
  let accessToken: string;
  let userId: string;
  let createdBlogId: string;

  const testUser = {
    email: process.env.TEST_USER_MAIL,
    password: process.env.TEST_USER_PASS,
  };

  const newBlog = {
    title: 'Integration Test Blog',
    content: 'This is a content created by Jest integration test.',
  };

  const updatedBlog = {
    title: 'Updated Test Blog Title',
    content: 'This content has been updated by Jest.',
  };

  beforeAll(async () => {
    if (!testUser.email || !testUser.password) {
      throw new Error('TEST_USER_MAIL and TEST_USER_PASS must be set in .env');
    }
    const response = await request(app)
      .post('/api/auth/login')
      .send(testUser);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.accessToken).toBeDefined();

    accessToken = response.body.data.accessToken;
    userId = response.body.data.user.id;
  });

  describe('POST /api/blogs', () => {
    test('should create a new blog post', async () => {
      const response = await request(app)
        .post('/api/blogs')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(newBlog);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.title).toBe(newBlog.title);
      expect(response.body.data.authorId).toBe(userId);

      createdBlogId = response.body.data.id;
    });

    test('should fail without authorization token', async () => {
      const response = await request(app)
        .post('/api/blogs')
        .send(newBlog);

      expect(response.status).toBe(401);
    });

    test('should fail with invalid data', async () => {
      const response = await request(app)
        .post('/api/blogs')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ title: '' }); 

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/blogs', () => {
    test('should get all blogs for the user', async () => {
      const response = await request(app)
        .get('/api/blogs')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
      const found = response.body.data.find((b: any) => b.id === createdBlogId);
      expect(found).toBeDefined();
    });
  });

  describe('GET /api/blogs/:id', () => {
    test('should get a specific blog by ID', async () => {
      const response = await request(app)
        .get(`/api/blogs/${createdBlogId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.id).toBe(createdBlogId);
    });

    test('should return 404 for non-existent blog', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      const response = await request(app)
        .get(`/api/blogs/${fakeId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/blogs/:id', () => {
    test('should update a blog post', async () => {
      const response = await request(app)
        .put(`/api/blogs/${createdBlogId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updatedBlog);

      expect(response.status).toBe(200);
      expect(response.body.data.title).toBe(updatedBlog.title);
      expect(response.body.data.content).toBe(updatedBlog.content);
    });
  });

  describe('DELETE /api/blogs/:id', () => {
    test('should delete a blog post', async () => {
      const response = await request(app)
        .delete(`/api/blogs/${createdBlogId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    test('should confirm deletion (get should return 404)', async () => {
      const response = await request(app)
        .get(`/api/blogs/${createdBlogId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(404);
    });
  });
});