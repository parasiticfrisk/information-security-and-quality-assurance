/*
*
*
*       FILL IN EACH UNIT TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]----
*       (if additional are added, keep them at the very end!)
*/

var chai = require('chai');
var assert = chai.assert;
var ConvertHandler = require('../controllers/convertHandler.js');

var convertHandler = new ConvertHandler();

suite('Unit Tests', function(){
  
  suite('Function convertHandler.getNum(input)', function() {
    
    test('Whole number input', function(done) {
      var input = '32L';
      assert.equal(convertHandler.getNum(input),32);
      done();
    });
    
    test('Decimal Input', function(done) {
      const input = '2.5mi';
      assert.equal(convertHandler.getNum(input), 2.5);      
      done();
    });
    
    test('Fractional Input', function(done) {
      const input = '2/5gal';
      assert.equal(convertHandler.getNum(input), 0.4);
      done();
    });
    
    test('Fractional Input w/ Decimal', function(done) {
      const input = '3.5/12km';
      assert.equal(convertHandler.getNum(input), 0.29167);
      done();
    });
    
    test('Invalid Input (double fraction)', function(done) {
      const input = '5/7/13kg';
      assert.isNaN(convertHandler.getNum(input));      
      done();
    });
    
    test('No Numerical Input', function(done) {
      const input = 'l';
      assert.equal(convertHandler.getNum(input), 1);      
      done();
    }); 
    
  });
  
  suite('Function convertHandler.getUnit(input)', function() {
    
    test('For Each Valid Unit Inputs', function(done) {
      var input = ['gal','l','mi','km','lbs','kg','GAL','L','MI','KM','LBS','KG'];
      input.forEach(function(ele) {
        if (ele === 'l' || ele === 'L') {
          assert.equal(convertHandler.getUnit(ele), 'L');
        } else {
          assert.equal(convertHandler.getUnit(ele), ele.toLowerCase());
        }        
      });
      done();
    });
    
    test('Unknown Unit Input', function(done) {
      const input = '25ms';
      assert.equal(convertHandler.getUnit(input), 'ms');
      done();
    });  
    
  });
  
  suite('Function convertHandler.getReturnUnit(initUnit)', function() {
    
    test('For Each Valid Unit Inputs', function(done) {
      var input = ['gal','L','mi','km','lbs','kg'];
      var expect = ['L','gal','km','mi','kg','lbs'];
      input.forEach(function(ele, i) {
        assert.equal(convertHandler.getReturnUnit(ele), expect[i]);
      });
      done();
    });
    
  });  
  
  suite('Function convertHandler.spellOutUnit(unit)', function() {
    
    test('For Each Valid Unit Inputs', function(done) {
      const input = ['gal','L','mi','km','lbs','kg'];
      const expect = ['gallons','liters','miles','kilometers','pounds','kilograms'];
      input.forEach(function(ele, i) {
        assert.equal(convertHandler.spellOutUnit(ele), expect[i]);
      });
      done();
    });
    
  });
  
  suite('Function convertHandler.convert(num, unit)', function() {
    
    test('Gal to L', function(done) {
      var input = [5, 'gal'];
      var expected = 18.9271;
      assert.approximately(convertHandler.convert(input[0],input[1]),expected,0.1); //0.1 tolerance
      done();
    });
    
    test('L to Gal', function(done) {
      const input = [7, 'L'];
      const expected = 1.84921;
      assert.approximately(convertHandler.convert(input[0],input[1]),expected,0.1); //0.1 tolerance
      done();
    });
    
    test('Mi to Km', function(done) {
      const input = [10, 'mi'];
      const expected = 16.0934;
      assert.approximately(convertHandler.convert(input[0],input[1]),expected,0.1); //0.1 tolerance
      done();      
    });
    
    test('Km to Mi', function(done) {
      const input = [15, 'km'];
      const expected = 9.32059;
      assert.approximately(convertHandler.convert(input[0],input[1]),expected,0.1); //0.1 tolerance
      done();      
    });
    
    test('Lbs to Kg', function(done) {
      const input = [8, 'lbs'];
      const expected = 3.62874;
      assert.approximately(convertHandler.convert(input[0],input[1]),expected,0.1); //0.1 tolerance
      done();      
    });
    
    test('Kg to Lbs', function(done) {
      const input = [25, 'kg'];
      const expected = 55.11561;
      assert.approximately(convertHandler.convert(input[0],input[1]),expected,0.1); //0.1 tolerance
      done();      
    });
    
  });

});