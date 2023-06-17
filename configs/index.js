import pg from "pg"
import dotenv from 'dotenv'
import chalk from "chalk"

dotenv.config();

export const db = new pg.Pool({
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    ssl: false,
});

export const connectDB = async () => {
    try {
        const connection = await db.connect();
        console.log(chalk.yellowBright('PostgreSQL DB Connected :D'));
        return connection;
    } catch (err) {
        if (err instanceof Error) console.error(chalk.redBright(err.message));
    }
};

export const PORT = process.env.PORT || 5000;
