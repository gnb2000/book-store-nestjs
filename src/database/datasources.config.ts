import { DataSource } from "typeorm";

const mysqlDataSource = new DataSource({
    type: 'mysql',
    username: 'root',
    password: '',
    host: 'localhost',
    port: 3306,
    database: 'bookstore',
    entities: ['src/**/**/*.entity{.ts,.js}'],
    migrations: ['src/database/migrations/*{.ts,.js}'],
  });

export default mysqlDataSource;