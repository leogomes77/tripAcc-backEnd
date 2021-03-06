const request = require('supertest');
const jwt = require('jwt-simple');

const app = require('../../src/app');

const MAIN_ROUTE = '/v1/groups';

const mail = `${Date.now()}@ipca.pt`;
const secret = 'ipca!DWM@202122';
let user;

beforeAll(async () => {
  const res = await app.services.user.save({ name: 'Leonardo Francisco', email: mail, password: '12345' });
  user = { ...res[0] };
  user.token = jwt.encode(user, secret);
});

test('Test #1 - Listar Grupos', () => {
  return request(app).get(MAIN_ROUTE)
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
    });
});

test('Test #2 - inserir grupo', () => {
  return request(app).post(MAIN_ROUTE)
    .set('authorization', `bearer ${user.token}`)
    .send({ name: 'Maldivas', descricao: 'Ida maldivas', moeda: 'euro' })
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.name).toBe('Maldivas');
    });
});

test('Test #2.1 - inserir grupo sem nome', (done) => {
  request(app).post(MAIN_ROUTE)
    .set('authorization', `bearer ${user.token}`)
    .send({ descricao: 'Teste name', moeda: 'Euro' })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Nome é um atributo obrigatório');
      done();
    });
});

test('Test #2.2 - inserir grupo sem moeda', (done) => {
  request(app).post(MAIN_ROUTE)
    .set('authorization', `bearer ${user.token}`)
    .send({ name: 'Viana do Castelo', descricao: 'Teste name' })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('A Moeda é um atributo obrigatório');
      done();
    });
});

test('Test #3 - Remover um Grupo', () => {
  return app.db('groupp')
    .insert({ name: 'Group to delete', descricao: 'Trip to Chile', moeda: 'euro' }, ['id'])
    .then((group) => request(app).delete(`${MAIN_ROUTE}/${group[0].id}`)
      .set('authorization', `bearer ${user.token} `))
    .then((res) => {
      expect(res.status).toBe(204);
    });
});

test('Test #4 - Atualizar Grupo', () => {
  return app.db('groupp')
    .insert({
      name: 'Ferias Suica', descricao: 'Férias Suica com amigos', moeda: 'Euro',
    }, ['id'])
    .then((serv) => request(app).put(`${MAIN_ROUTE}/${serv[0].id}`)
      .set('authorization', `bearer ${user.token}`)
      .send({
        name: 'Ferias Suica Teste', descricao: 'Férias Suica com amigos Teste', moeda: 'Euro',
      }))
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.descricao).toBe('Férias Suica com amigos Teste');
    });
});

test('Test #4 - Atualizar Grupo', () => {
  return app.db('groupp')
    .insert({
      name: 'Ferias Suica', descricao: 'Férias Suica com amigos', moeda: 'Euro',
    }, ['id'])
    .then((serv) => request(app).put(`${MAIN_ROUTE}/${serv[0].id}`)
      .set('authorization', `bearer ${user.token}`)
      .send({
        name: 'Ferias Suica Teste', descricao: 'Férias Suica com amigos Teste', moeda: 'Euro',
      }))
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.descricao).toBe('Férias Suica com amigos Teste');
    });
});

test('Test #4.1 - Atualizar Grupo sem moeda', () => {
  return app.db('groupp')
    .insert({
      name: 'Ferias Suica', descricao: 'Férias Suica com amigos', moeda: 'Euro',
    }, ['id'])
    .then((serv) => request(app).put(`${MAIN_ROUTE}/${serv[0].id}`)
      .set('authorization', `bearer ${user.token}`)
      .send({
        name: 'Ferias Suica Teste', descricao: 'Férias Suica com amigos Teste',
      }))
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('A Moeda é um atributo obrigatório');
    });
});

test('Test #4.2 - Atualizar Grupo sem moeda', () => {
  return app.db('groupp')
    .insert({
      name: 'Ferias Suica', descricao: 'Férias Suica com amigos', moeda: 'Euro',
    }, ['id'])
    .then((serv) => request(app).put(`${MAIN_ROUTE}/${serv[0].id}`)
      .set('authorization', `bearer ${user.token}`)
      .send({
        descricao: 'Férias Suica com amigos Teste', moeda: 'Euro',
      }))
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Nome é um atributo obrigatório');
    });
});
