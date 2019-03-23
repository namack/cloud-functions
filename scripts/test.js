import express from 'express';
import { generateWorkoutMarkdown } from '../dist/index';

const app = express();
const port = 9001

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next(req, res);
});

app.get('/generateWorkoutMarkdown', (req, res) => {
  return generateWorkoutMarkdown(req, res);
});

app.post('/generateWorkoutMarkdown', (req, res) => {
  console.log('incoming req.body', req.body);

  return generateWorkoutMarkdown(req, res);
});

app.get('/', (req, res) => {
  return res.send();
})

app.listen(port, () => {
  console.log('Server running on port: ', port);
});