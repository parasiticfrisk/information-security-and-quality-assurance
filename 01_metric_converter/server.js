'use strict';

const express     = require( 'express' );
const cors        = require( 'cors' );
const helmet      = require( 'helmet' );
const dotEnv      = require( 'dotenv' ).config( );

const apiRoutes         = require( './routes/api.js' );
const fccTestingRoutes  = require( './routes/fcctesting.js' );
const runner            = require( './test-runner' );

const app  = express( );
const PORT = process.env.PORT || 3000;

app.use( '/static', express.static( 'public' ) );
app.use( cors( { origin: '*' } ) );               //For FCC testing purposes only

app.use( express.urlencoded( { extended: true } ) );

app.use(
  helmet( {
    noSniff   : true,
    xssFilter : true
  } )
);

app.get( '/', ( req,res ) => {
  res.sendFile( process.cwd( ) + '/views/index.html' );
} );

//For FCC testing purposes
fccTestingRoutes( app );

//Routing for API 
apiRoutes( app );  
    
//404 Not Found Middleware
app.use( ( req,res,next ) => {
  res.status( 404 )
    .type( 'text' )
    .send( 'Not Found' );
} );

//Start our server and tests!
app.listen( PORT, ( ) => {
  console.log( "Listening on port " + PORT );
  if( process.env.NODE_ENV === 'test' ) {
    console.log( 'Running Tests...' );
    setTimeout( ( ) => {
      try {
        runner.run( );
      } catch( error ) {
        console.log( 'Tests are not valid:' );
        console.log( error );
      }
    }, 1500 );
  }
} );

module.exports = app; //for testing
