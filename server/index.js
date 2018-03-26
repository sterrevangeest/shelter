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
  .delete('/:id', remove)
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
        res.statusCode = 200 //200 OK
        /* Use the following to support just HTML:  */
        //res.render('detail.ejs', Object.assign({}, result, helpers))

        res.format({
          json: () => res.json(result),
          html: () => res.render('detail.ejs', Object.assign({}, result, helpers))
        })

      } else if (db.removed(id)) {
        var result = {
            errors: [{
              id: 410,
              title: 'Gone'
            }],
          }
        res.statusCode = 410 //410 Gone
        res.write('410 Gone \n')
        res.end()

      }




      else {
        console.log('404 Not Found')
        var result = {
            errors: [{
              id: 404,
              title: 'Not Found'
            }],
        //data: db.get(id) //db.get
        }
        //set status to 404
        res.statusCode = 404
        /* Use the following to support just HTML:  */
        //res.render('error.ejs', Object.assign({}, result, helpers))
        res.format({
          json: () => res.json(result),
          html: () => res.render('error.ejs', Object.assign({}, result, helpers))
        })
      }

    } catch (err) {
    console.log('400 Bad Request')

    var result = {
      errors: [{
        id: 400,
        title: 'Bad Request'
        }],
      }
    //set status to 404
    res.statusCode = 400
    //res.setHeader('Content-Type', 'text/html')
    res.write('400 Bad Request \n')
    res.write( id + ' is not a valid identifier \n')
    res.end()
    }

  }

/// !!!! vanaf hier was ik nog een beetje aan t kloten, dus weet niet helemaal of alles precies klopt enzo :)
  function remove(req, res) {
    var id = req.params.id //store requested id in var id
    var result = {
        errors: [],
        data: db.all() //db.get
    }

    try {

      if (db.has(id)) {
        db.remove(id)
        console.log('204 No Content, ' + id + ' has been deleted')
        res.statusCode = 204 //204 No Content
        res.write('204 No Content \n')
        res.write('204 No Content, ' + id + ' has been deleted')
      } else {
        console.log(id + " was already deleted")
        //res.statusCode = 204
      }
    } catch (err) {
      console.log(id + " doesn't exists")
    }



  }
