'use strict'

var express = require('express')
var db = require('../db')
var helpers = require('./helpers')

module.exports = express()
  .set('view engine', 'ejs')
  .set('views', 'view')
  .use(express.static('static'))
  .use('/image', express.static('db/image'))
  // TODO: Serve the images in `db/image` on `/image`.
  .get('/', all)
  .get('/:id', details)
  //.use(notFound404)
  /* TODO: Other HTTP methods. */
  // .post('/', add)
  // .get('/:id', get)
  // .put('/:id', set)
  // .patch('/:id', change)
  // .delete('/:id', remove)
  .listen(1902)

function all(req, res) {
  var result = {errors: [], data: db.all()}
  /* Use the following to support just HTML:  */
  //res.render('list.ejs', Object.assign({}, result, helpers))

  /* Support both a request for JSON and a request for HTML  */
  res.format({
    json: () => res.json(result),
    html: () => res.render('list.ejs', Object.assign({}, result, helpers))
  })
}

function details(req, res) {
  var id = req.params.id //store requested id in var id
  console.log(id)
  //console.log(result)

  try {
      if (db.has(id)){
        var result = {
            errors: [],
            data: db.get(id) //db.get
        }
        /* Use the following to support just HTML:  */
        res.render('detail.ejs', Object.assign({}, result, helpers))

      } else {
        console.log('404 Not Found')
        var result = {
            errors: [{
              id: 404,
              title: 'Not Found'
            }],
        //data: db.get(id) //db.get
        }
        //set status to 404
        res.status(404)
        /* Use the following to support just HTML:  */
        res.render('error.ejs', Object.assign({}, result, helpers))
      }
    } catch (err) {
    console.log('400 Bad Request')

    var result = {
      errors: [{
        id: 400,
        title: 'Bad Request'
        }],
      }
    res.status(400)
    res.write('400 Bad Request \n')
    res.write( id + ' is not a valid identifier')
    res.end()
    //return
    }

  }
