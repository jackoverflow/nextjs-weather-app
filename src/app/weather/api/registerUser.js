import express from 'express';
import cors from 'cors';

const app = express();

// Enable CORS for all routes
app.use(cors());

app.post('/api/register_user/', (req, res) => {
    // Basic registration response to avoid unused variable errors
    res.status(200).json({ message: 'Registration endpoint - implementation needed' });
});

export default app; 