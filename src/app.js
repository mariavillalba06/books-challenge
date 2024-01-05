const express = require('express');
const mainRouter = require('./routes/main');
const methodOverride = require('method-override');
const session = require('express-session');
const userLogged = require('./middlewares/userMiddleware');
const cookieParse = require('cookie-parser');
const rememberMiddleware = require('./middlewares/rememberMiddleware');
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(methodOverride('_method'));

app.use(session({secret:'Secreto',resave: false,
saveUninitialized: false}));
app.use(userLogged);
app.use(cookieParse());
app.use(rememberMiddleware);
app.set('view engine', 'ejs');
app.set('views', 'src/views');

app.use('/', mainRouter);

app.listen(3000, () => {
  console.log('listening in http://localhost:3000');
});
