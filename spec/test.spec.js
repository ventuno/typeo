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

describe('Testing optional arguments', function() {
  var concat = typeo.declare([
  {
    type: typeo.types.string,
  },
  {
    type: typeo.types.number,
  },
  {
    type: typeo.types.number,
    optional: true
  }],
  function (a, b, c) {
    if (c !== undefined && c !== null) {
      return a + b + c;
    }
    return a + b;
  });

  it('Should run the function successfully', function() {
    expect(concat('1', 2, 3)).toBe('123');
  });

  it('Should still run the function if the last argument is not passed', function() {
    expect(concat('1', 2)).toBe('12');
  });

  it('The optional argument is correctly tested against its type', function() {
    expect(function () {concat('1', 2, '3')}).toThrow('type mismatch (arg 2), got: string, expected: number');
  });

  it('An exception should still be thrown if there are more arguments than declared', function() {
    expect(function () {concat('1', 2, '3', 4)}).toThrow('arguments length mismatch, got: 4, expected: 3');
  });
});

describe('Testing "any" type', function() {
  var concat = typeo.declare([
  {
    type: typeo.types.string,
  },
  {
    type: typeo.types.any,
  }],
  function (a, b) {
    return a + b;
  });

  it('Should run the function successfully', function() {
    expect(concat('1', 2)).toBe('12');
  });

  it('Should still run the function if the last argument is not passed', function() {
    expect(concat('1', 'hello')).toBe('1hello');
  });

  it('If null is passed and type is any, it should fail.', function() {
    expect(function () {concat('1', null);}).toThrow('type mismatch (arg 1), got: object, expected: any');
  });
});