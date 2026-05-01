require('dotenv').config();
const express = require('express');
const cors = require('cors');

const apiRoutes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

app.get('/', (req, res) => res.json({ message: 'API running!' }));
app.use('/api', apiRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
