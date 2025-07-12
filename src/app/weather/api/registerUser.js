import express from 'express';
import cors from 'cors';

const app = express();

// Enable CORS for all routes
app.use(cors());

app.post('/api/register_user/', (req, res) => {
    // Registration logic here
    // Implement your registration logic using req and res
});

export default app; 