module.exports = {
  test: {
    client: 'pg',
    connection: {
      host: 'localhost',
      port: '5432',
      user: 'postgres',
      password: 'gomes2000',
      database: 'TripAcc',
    },
    debug: false,
    migrations: {
      directory: './src/migrations',
    },
    pool: {
      min: 0,
      max: 50,
      propagateCreateError: false,
    },
  },
};
