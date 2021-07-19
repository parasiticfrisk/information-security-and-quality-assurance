/* 
** Author: August Frisk
** Course: freeCodeCamp Info-Sec & QA - Summer 2018
** Project: Personal Library
*/

"use strict";

const mongoose = require("mongoose");

const DB_URI = process.env.DB;

module.exports = class DB {
  connect() {
    return mongoose
      .connect(DB_URI, { useNewUrlParser: true })
      .catch(error => console.log(error.message));
  }
};
