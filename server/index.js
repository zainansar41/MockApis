import express from 'express';
import dotenv from 'dotenv';
import { connectDb } from './DB/connection.js';
import cors from 'cors';

import router from './routes/index.js';



cors();


dotenv.config();


const app = express();

app.use(express.json());

const PORT = process.env.PORT || 5000;

connectDb();


app.use('/', router);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});