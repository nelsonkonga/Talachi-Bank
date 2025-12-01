import express, { Application, Request, Response } from 'express';
import session from 'express-session';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from './routes/auth.routes';
import dashboardRoutes from './routes/dashboard.routes';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'default-secret-change-this',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: parseInt(process.env.SESSION_MAX_AGE || '3600000'),
  },
}));

app.use(express.static(path.join(__dirname, 'views')));

app.use('/', authRoutes);
app.use('/', dashboardRoutes);

app.get('/', (req: Request, res: Response) => {
  if (req.session.token) {
    res.redirect('/dashboard');
  } else {
    res.redirect('/login');
  }
});

app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 API endpoint: ${process.env.API_BASE_URL}`);
});
