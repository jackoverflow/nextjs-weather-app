import express from 'express';
import cors from 'cors';

const app = express();

// Enable CORS for all routes
app.use(cors());

app.post('/api/register_user/', (request, response) => {
    // Registration logic here
    // Use request and response as needed
});

export default app; 