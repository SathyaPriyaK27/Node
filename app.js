require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./utils/database');
const authRoutes = require('./routes/user');

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/',(req,res)=>{
    res.send('server running on this port')
})

app.use('/api', authRoutes);

sequelize.sync()
    .then(() => {
        app.listen(5000, () => {
            console.log('Server is running on port 3001');
        });
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });
