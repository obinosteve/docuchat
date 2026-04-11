const express = require('express');
const morgan  = require('morgan');
const cors    = require('cors');
const helmet  = require('helmet');
const logger  = require('./services/logger.service');

const app = express();

app.use(helmet());
app.use(cors());

app.use(morgan('dev', {
  stream: { write: msg => logger.info(msg.trim()) }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', require('./routes/index.router'));

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  logger.error(err.message, { stack: err.stack });
  res.status(err.status || 500).json({ message: err.message });
});

module.exports = app;