/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var ConvertHandler = require('../controllers/convertHandler.js');

module.exports = function (app) {
  
  var convertHandler = new ConvertHandler();

  app.route('/api/convert')
    .get(function (req, res){
      var input = req.query.input;      
      var initNum = convertHandler.getNum(input);            
      var initUnit = convertHandler.getUnit(input);
      var returnNum = convertHandler.convert(initNum, initUnit);
      var returnUnit = convertHandler.getReturnUnit(initUnit);
      const initFullUnit = convertHandler.spellOutUnit(initUnit);
      const returnFullUnit = convertHandler.spellOutUnit(returnUnit);
      var toString = convertHandler.getString(initNum, initFullUnit, returnNum, returnFullUnit);      
      
      res.json({initNum, initUnit, returnNum, returnUnit, string: toString});    
    });
    
};
