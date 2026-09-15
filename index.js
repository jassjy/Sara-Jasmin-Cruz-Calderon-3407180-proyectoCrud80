require('dotenv').config();
const app = require('./app');

const puerto = process.env.PORT || 3000;

app.listen(puerto, () => {
    console.log(`SERVIDOR: http://localhost:${puerto}`);
    console.log(`Entorno: ${process.env.NODE_ENV || 'development'}`);
});
