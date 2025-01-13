import cors from 'cors';

const acceptedOrigins = ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'];

export const corsMiddleware = cors({
    origin: (origin, callback) => {
        if (!origin || acceptedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204, 
});