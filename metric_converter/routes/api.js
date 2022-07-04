/* 
** Author: August Frisk
** Course: freeCodeCamp Info-Sec & QA - Summer 2018
** Project: Metric/Imperial Converter
*/

'use strict';

const expect         = require( 'chai' ).expect;
const ConvertHandler = require( '../controllers/convertHandler.js' );

module.exports = app => {
  
  const convertHandler = new ConvertHandler( );
  
  app.get( '/api/convert', ( req,res ) => {

    const input      = req.query.input;
    const initNum    = convertHandler.getNum( input );
    const initUnit   = convertHandler.getUnit( input );
    // Validates inputs or send back response with error.
    if ( !initNum && !initUnit )  return res.send( 'invalid number and unit' );
    else if ( !initNum )          return res.send( 'invalid number' );
    else if ( !initUnit )         return res.send( 'invalid unit' );
    // After all inputs are verified, proceeds.
    const returnNum  = convertHandler.convert( initNum, initUnit );
    const returnUnit = convertHandler.getReturnUnit( initUnit );
    const toString   = convertHandler.getString( initNum, initUnit, returnNum, returnUnit );    
    // Finally, returns json object with the values and a string.
    res.json( toString );

  } );
    
};
