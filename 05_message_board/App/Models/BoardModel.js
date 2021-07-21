/*
** Author: August Frisk
** Course: freeCodeCamp Info-Sec & QA - Summer 2018
** Project: Anonymous Message Board
*/

"use strict";

const mongoose = require("mongoose");

module.exports = class BoardModel {
  async getAllBoards() {
    return mongoose.connection.db.listCollections().toArray();
  }
};