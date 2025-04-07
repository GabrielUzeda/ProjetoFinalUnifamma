const express = require('express');
const cors = require('cors');
const app = express();
const routes = require('./routes');

app.use(cors({
    origin: true,
    credentials: true
}));


app.use(express.json());
app.use('/api', routes);

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});