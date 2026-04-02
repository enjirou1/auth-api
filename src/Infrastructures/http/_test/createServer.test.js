import request from 'supertest';
import pool from '../../database/postgres/pool.js';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import container from '../../container.js';
import createServer from '../createServer.js';
import { afterAll, afterEach, describe, expect, it } from 'vitest';
 
describe('HTTP server', () => {
  afterAll(async () => {
    await pool.end();
  });
 
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  it('should response 404 when request unregistered route', async () => {
    // Arrange
    const app = await createServer({});

    // Action
    const response = await request(app).get('/unregisterdRoute');

    // Assert
    expect(response.status).toEqual(404);
  })

  describe('when GET /', () => {
    it('should return 200 and hello world', async () => {
      // Arrange
      const app = await createServer({});

      // Action
      const response = await request(app).get('/');

      // Assert
      expect(response.status).toEqual(200);
      expect(response.body.data).toEqual('Hello World!');
    })
  })
 
  describe('when POST /users', () => {
    it('should response 404 when request unregistered route', async () => {
      // Arrange
      const server = await createServer({});

      // Action
      const response = await request(server)
        .get('/unregistered-route')
      /* const response = await server.inject({
        method: 'GET',
        url: '/unregisteredRoute',
      }); */

      // Assert
      expect(response.status).toBe(404)
      // expect(response.statusCode).toEqual(404);
    })

    it('should response 201 and persisted user', async () => {
      // Arrange
      const requestPayload = {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      };
      const server = await createServer(container);
 
      // Action
      const response = await request(server)
        .post('/users')
        .send(requestPayload)
      /* const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      }); */
 
      // Assert
      expect(response.status).toBe(201)
      expect(response.body.status).toBe('success')
      expect(response.body.data.addedUser).toBeDefined()
      /* const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedUser).toBeDefined(); */
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {
        fullname: 'Dicoding Indonesia',
        password: 'secret',
      };
      const server = await createServer(container);

      // Action
      const response = await request(server)
        .post('/users')
        .send(requestPayload)
      /* const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      }); */

      // Assert
      expect(response.status).toBe(400)
      expect(response.body.status).toBe('fail')
      expect(response.body.message).toBe('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada')
      /* const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada'); */
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        username: 'dicoding',
        password: 'secret',
        fullname: ['Dicoding Indonesia'],
      };
      const server = await createServer(container);

      // Action
      const response = await request(server)
        .post('/users')
        .send(requestPayload)
      /* const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      }); */

      // Assert
      expect(response.status).toBe(400)
      expect(response.body.status).toBe('fail')
      expect(response.body.message).toBe('tidak dapat membuat user baru karena tipe data tidak sesuai')
      /* const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat user baru karena tipe data tidak sesuai'); */
    });

    it('should response 400 when username more than 50 character', async () => {
      // Arrange
      const requestPayload = {
        username: 'dicodingindonesiadicodingindonesiadicodingindonesiadicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      };
      const server = await createServer(container);

      // Action
      const response = await request(server)
        .post('/users')
        .send(requestPayload)
      /* const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      }); */

      // Assert
      expect(response.status).toBe(400)
      expect(response.body.status).toBe('fail')
      expect(response.body.message).toBe('tidak dapat membuat user baru karena karakter username melebihi batas limit')
      /* const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat user baru karena karakter username melebihi batas limit'); */
    });

    it('should response 400 when username contain restricted character', async () => {
      // Arrange
      const requestPayload = {
        username: 'dicoding indonesia',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      };
      const server = await createServer(container);

      // Action
      const response = await request(server)
        .post('/users')
        .send(requestPayload)
      /* const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      }); */

      // Assert
      expect(response.status).toBe(400)
      expect(response.body.status).toBe('fail')
      expect(response.body.message).toBe('tidak dapat membuat user baru karena username mengandung karakter terlarang')
      /* const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat user baru karena username mengandung karakter terlarang'); */
    });

    it('should response 400 when username unavailable', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      const requestPayload = {
        username: 'dicoding',
        fullname: 'Dicoding Indonesia',
        password: 'super_secret',
      };
      const server = await createServer(container);

      // Action
      const response = await request(server)
        .post('/users')
        .send(requestPayload)
      /* const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      }); */

      // Assert
      expect(response.status).toBe(400)
      expect(response.body.status).toBe('fail')
      expect(response.body.message).toBe('username tidak tersedia')
      /* const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('username tidak tersedia'); */
    });

    it('should handle server error correctly', async () => {
      // Arrange
      const requestPayload = {
        username: 'dicoding',
        fullname: 'Dicoding Indonesia',
        password: 'super_secret',
      };
      const server = await createServer({}); // fake container

      // Action
      const response = await request(server)
        .post('/users')
        .send(requestPayload)
      /* const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      }); */

      // Assert
      expect(response.status).toBe(500)
      expect(response.body.status).toBe('error')
      expect(response.body.message).toBe('terjadi kegagalan pada server kami')
      /* const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(500);
      expect(responseJson.status).toEqual('error');
      expect(responseJson.message).toEqual('terjadi kegagalan pada server kami'); */
    });
  });
});