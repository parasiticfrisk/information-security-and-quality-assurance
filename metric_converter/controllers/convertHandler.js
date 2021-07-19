/*
 *
 *
 *       Complete the handler logic below
 *
 *
 */

function ConvertHandler() {
  
  this.getNum = function(input) {
    const re = /[a-zA-Z]/;
    let num = input;

    //  If input contains letter split at that letter and assign num to 
    //  the left side of the split array
    if (re.test(input)) {
      num = input.split(input.match(re)[0])[0];
    }

    // Check if input has a single / 
    // then convert fraction to a decimal
    if (num.match(/\//g) && num.match(/\//g).length === 1) {
      const nums = num.split('/');
      if (nums[0] && nums[1]) {
        num = num.split('/').reduce((a, b) => a / b);
      }
    }

    // If num is not a number return NaN else parse and return num
    if (isNaN(num)) {
      // return Number(num);
      return num;
    } else {
      return num ? parseFloat(Number(num).toFixed(5)) : 1;
    }
  };

  this.getUnit = function(input) {    
    const unit = input.match(/[a-zA-Z]+/);

    if (unit) {
      if (unit[0] === 'l' || unit[0] === 'L') return 'L';
      return unit[0].toLowerCase();
    } else {
      return null;
    }
  };

  this.getReturnUnit = function(initUnit) {    

    if (initUnit === 'gal') return 'L';
    if (initUnit === 'L') return 'gal';
    if (initUnit === 'lbs') return 'kg';
    if (initUnit === 'kg') return 'lbs';
    if (initUnit === 'mi') return 'km';
    if (initUnit === 'km') return 'mi';

    return undefined;
  };

  this.spellOutUnit = function(unit) {    

    if (unit === 'gal') return 'gallons';
    if (unit === 'L') return 'liters';
    if (unit === 'lbs') return 'pounds';
    if (unit === 'kg') return 'kilograms';
    if (unit === 'mi') return 'miles';
    if (unit === 'km') return 'kilometers';

    return undefined;
  };

  this.convert = function(initNum, initUnit) {
    const galToL = 3.78541;
    const lbsToKg = 0.453592;
    const miToKm = 1.60934;

    if (initUnit === 'gal') return parseFloat((initNum * galToL).toFixed(5));
    if (initUnit === 'L') return parseFloat((initNum / galToL).toFixed(5));
    if (initUnit === 'lbs') return parseFloat((initNum * lbsToKg).toFixed(5));
    if (initUnit === 'kg') return parseFloat((initNum / lbsToKg).toFixed(5));
    if (initUnit === 'mi') return parseFloat((initNum * miToKm).toFixed(5));
    if (initUnit === 'km') return parseFloat((initNum / miToKm).toFixed(5));

    return undefined;
  };

  this.getString = function(initNum, initUnit, returnNum, returnUnit) {
    if (isNaN(initNum) && returnUnit === undefined) {
      return 'invalid number and unit';
    } else if (isNaN(initNum)) {
      return 'invalid number';
    } else if (returnUnit === undefined) {
      return 'invalid unit';
    } else {
      return `${initNum} ${initUnit} convert to ${returnNum} ${returnUnit}`;
    }    
    
  };
}

module.exports = ConvertHandler;