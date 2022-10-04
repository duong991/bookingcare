import express from 'express';
import configViewEngine from './config/viewEngine'
import initWebRoutes from './routes/web';
import connectDB from './config/connectDB'
require('dotenv').config();
let app = express();
// config app
app.use(express.urlencoded({extended: true}));
app.use(express.json());

connectDB();

configViewEngine(app);
initWebRoutes(app);

let port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('listening on port localhost:' + port);
});

