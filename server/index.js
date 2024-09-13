import express from 'express';
import dotenv from 'dotenv';
import { connectDb } from './DB/connection.js';


dotenv.config();


const app = express();

app.use(express.json());

const PORT = process.env.PORT || 5000;

connectDb();

app.get('/', (req, res) => {
    res.send('API is running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});