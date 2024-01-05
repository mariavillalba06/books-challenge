const bcryptjs = require('bcryptjs');
const db = require('../database/models');
const Op = db.Sequelize.Op;
const {validationResult} = require('express-validator');

const mainController = {
  home: (req, res) => {
    db.Book.findAll({
      include: [{ association: 'authors' }]
    })
      .then((books) => {
        res.render('home', { books });
      })
      .catch((error) => console.log(error));
  },
  bookDetail: (req, res) => {
      db.Book.findOne({
        where:{
          id:req.params.id
        },
        include: [{ association: 'authors' }]
      })
        .then((book)=>{
          res.render('bookDetail', {book});
        })
        .catch((error) => console.log(error));
  },
  bookSearch: (req, res) => {
    res.render('search', { books: [] });
  },
  bookSearchResult: (req, res) => {
    db.Book.findAll({
      where:{
        title:{[Op.like]:`%${req.body.title}%`}
      },
      include: [{ association: 'authors' }]
    })
      .then((books) => {
        res.render('search', { books });
      })
      .catch((error) => console.log(error));
  },
  deleteBook: (req, res) => {
    const bookId = req.params.id;
    db.BooksAuthors.destroy({
      where:{
        BookId:bookId
      }
    });
    db.Book.destroy({
      where: {
        id: bookId,
      },
    });
    res.redirect('/');
  },
  authors: (req, res) => {
    db.Author.findAll()
      .then((authors) => {
        res.render('authors', { authors });
      })
      .catch((error) => console.log(error));
  },
  authorBooks: (req, res) => {
    db.Author.findOne({
      where:{
        id:req.params.id
      },
      include: [{ association: 'books' }]
    })
      .then((author)=>{
        res.render('authorBooks', {author});
      })
      .catch((error) => console.log(error));
  },
  register: (req, res) => {
    res.render('register');
  },
  processRegister: (req, res) => {
    db.User.create({
      Name: req.body.name,
      Email: req.body.email,
      Country: req.body.country,
      Pass: bcryptjs.hashSync(req.body.password, 10),
      CategoryId: req.body.category
    })
      .then(() => {
        res.redirect('/');
      })
      .catch((error) => console.log(error));
  },
  login: (req, res) => {
    res.render('login');
  },
  processLogin: (req, res) => {
    let errors = validationResult(req);
    if (errors.isEmpty()){
      db.User.findOne({
        where:{
          email:req.body.email,
        }
      })
      .then(usuarioALoguearse=>{
        if(usuarioALoguearse != undefined){
          const password = bcryptjs.compareSync( req.body.password, usuarioALoguearse.Pass);
          if (password) {
            delete usuarioALoguearse.Pass;
            req.session.usuarioLogueado = usuarioALoguearse;

            if(req.body.remember !=undefined){
              res.cookie('recordame',usuarioALoguearse.email,{maxAge:60000});
            }
            return res.redirect('/');
          }
          else{
            return res.render('login',{errors: [{
              msg:'Credenciales invalidas'
            }]})
          }
        }
        else{
          return res.render('login',{errors:[{
            msg:'Correo no registrado'
        }]})
        }
      })
    }
    else{
      res.render('login',{errors:errors.array(),old:req.body});
    }
  },
  logout:(req, res) => {
    req.session.destroy();
    return res.redirect('/users/login');
  },
  edit: (req, res) => {
    db.Book.findByPk(req.params.id)
      .then((book)=>{
        res.render('editBook', {book});
      })
      .catch((error) => console.log(error));
  },
  processEdit: (req, res) => {
    db.Book.update({
      title: req.body.title,
      cover: req.body.cover,
      description: req.body.description,
    },
    {
      where:{
        id:req.params.id
      }
    })
      .then(() => {
        res.redirect('/');
      })
      .catch((error) => console.log(error));
  }
};

module.exports = mainController;
