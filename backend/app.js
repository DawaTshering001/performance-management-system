const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/auth');
const performanceRoutes = require('./routes/performance');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/performance', performanceRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

const path = require('path');
// serve frontend static files from the frontend directory
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// For SPA routing or unknown routes (except /api), serve index.html
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});