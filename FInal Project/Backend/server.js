import express from 'express'
import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import courseRoutes from './routes/courseRoutes.js'
import enrollmentRoutes from './routes/enrollmentRoutes.js'

const app = express()
connectDB()

app.use(express.json())

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  next();
});

app.use('/', authRoutes)
app.use('/courses', courseRoutes)
app.use('/enrollment', enrollmentRoutes)

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
