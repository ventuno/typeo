var typeo = {};
typeo.dev = true;
typeo.types = {};
typeo.typesDef = {};

function checkType (typeName, value, typeObj) {
  if (typeObj[typeName]) {
    var type = typeObj[typeName];
    return type.checkType(type.obj, value);
  } 
  return false;
}

function isOfType (type, value) {
  return typeof value === type;
}

function isInstanceOf (type, value) {
  return value instanceof type;
}

function addTypeDef (typeDef, typeDefs, types) {
  var name = typeDef.name;
  if (!typeDef.checkType) {
    if (typeDef.obj) {
      switch (typeof typeDef.obj) {
        case 'string':
          typeDef.checkType = isOfType;
          break;
        case 'function':
          typeDef.checkType = isInstanceOf;
          break;
        default:
          typeDef.checkType = function noop () { return false; };
      }
    }
  }
  types[typeDef.name] = typeDef.name;
  typeDefs[typeDef.name] = typeDef;
}

function init() {
  if (!typeo.dev) {
    return;
  }
  addTypeDef({
    name: 'string',
    obj: 'string'
  }, typeo.typesDef, typeo.types);
  addTypeDef({
    name: 'number',
    obj: 'number'
  }, typeo.typesDef, typeo.types);
  addTypeDef({
    name: 'function',
    obj: 'function'
  }, typeo.typesDef, typeo.types);
  addTypeDef({
    name: 'Date',
    obj: Date
  }, typeo.typesDef, typeo.types);
}

init();

typeo.declare = function (args, fn, context) {
  if (!typeo.dev) {
    return fn;
  }
  return function () {
    if (arguments.length === args.length) {
      for (var i = 0; i < arguments.length; i++) {
        if (!checkType(args[i].type, arguments[i], typeo.typesDef)) {
          var type = args[i].type;
          throw new Error('type mismatch (arg ' + i + '), got: ' + typeof arguments[i] + ', expected: ' + type);
        }
      }
      return fn.apply(context, arguments);
    } else {
      throw new Error('arguments length mismatch, got: ' + arguments.length + ', expected: ' + args.length);
    }
  }
}

typeo.addTypeDef = function (typeDef) {
  return addTypeDef(typeDef, typeo.typesDef, typeo.types);
};

module.exports = typeo;