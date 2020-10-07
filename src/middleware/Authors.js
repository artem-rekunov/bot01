"use strict"
const fs = require('fs');
const dataAuthors = require(__dirname+'/../data/authors.json');

let _Authors = new Set()

let Authors = {

  get() { return [..._Authors] },

  set(author) {

    if (_Authors.has(author) ) { return 'Author alredy exist' }
    else {
      _Authors.add(author)
      Authors.save()
      return 'Author added!'
    }
  },

  del(author) {
    if ( !_Authors.has(author) ) { return 'Author not exist!' }
    else {
      _Authors.delete(author)
      Authors.save()
      return 'Author deleted!'
    }
  },

  length() { return _Authors.size },

  save() {
    fs.writeFileSync(__dirname+'/../data/authors.json', JSON.stringify([..._Authors]) );

    return "saved!"
  },
  sync() {

    if (dataAuthors != []) {
      dataAuthors.map( author => _Authors.add(author) )
    }

    return "sync"
  }
};

Authors.sync();

module.exports = Authors