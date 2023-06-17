import express from 'express'
import dotenv from 'dotenv'
import chalk from 'chalk'
import apiRoutes from './routes/index.js'
import { connectDB, PORT } from './configs/index.js'

// Express application instance
const app = express();

// To load environment variables
dotenv.config();

// To parse the body in json format for POST requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use('/api', apiRoutes);

app.get('/', (req, res,) => {
    res.json('Booking service running...');
})

app.listen(PORT, () => {
    console.log(chalk.blueBright(`Server running on PORT: ${PORT}`));
})
