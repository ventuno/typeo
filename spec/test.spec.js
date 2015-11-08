var typeo = require('../index');

describe('Testing basic types', function() {
  var concat = typeo.declare([
  {
    type: typeo.types.string,
  },
  {
    type: typeo.types.number,
  },
  {
    type: typeo.types.number,
  }],
  function (a, b, c) {
    return a + b + c;
  });

  it('Should run the function successfully', function() {
    expect(concat('1', 2, 3)).toBe('123');
  });

  it('Should throw an exception if types mismatch', function() {
    expect(function () {concat(1, 2, 3);}).toThrow('type mismatch (arg 0), got: number, expected: string');
  });

  it('Should throw an exception if arguments length mismatch', function() {
    expect(function () {concat(1, 2);}).toThrow('arguments length mismatch, got: 2, expected: 3');
  });
});

describe('Testing custom types', function() {
  function CustomClass () {
  }

  CustomClass.prototype.customClassMethod = function () {
    return true;
  }

  typeo.addTypeDef({
    name: 'CustomClass',
    obj: CustomClass
  });

  var useCustomClass = typeo.declare([
    {
      type: typeo.types.CustomClass,
    }],
    function (a) {
      return a.customClassMethod();
    });

  var useCustomClass1 = typeo.declare([
    {
      type: typeo.types.CustomClass,
    }],
    function (a) {
      return a.customClassMethod();
    });


  var customClassInstance = new CustomClass();

  it('Should run the function successfully', function() {
    expect(useCustomClass(customClassInstance)).toBe(true);
  });

  it('Should throw an exception if types mismatch', function() {
    expect(function () {useCustomClass(1);}).toThrow('type mismatch (arg 0), got: number, expected: CustomClass');
  });
});