import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const isPostgres = !!process.env.DB_HOST;

// Use PostgreSQL in production (when DB_HOST is set), otherwise fall back to SQLite
// for local development and testing without requiring a Postgres instance.
export const sequelize = isPostgres
    ? new Sequelize(
        process.env.DB_NAME || 'coastwise',
        process.env.DB_USER || 'postgres',
        process.env.DB_PASS || 'password',
        {
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT || '5432'),
            dialect: 'postgres',
            logging: false,
        }
    )
    : new Sequelize({
        dialect: 'sqlite',
        storage: path.join(__dirname, '../../database.sqlite'),
        logging: false,
    });
