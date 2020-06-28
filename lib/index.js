"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Type;
(function (Type) {
  Type["ObjectId"] = "ObjectId";
  Type["Date"] = "date";
  Type["Boolean"] = "boolean";
  Type["Number"] = "number";
  Type["Integer"] = "integer";
  Type["String"] = "string";
  Type["Object"] = "object";
  Type["Array"] = "array";
  Type["Primitives"] = "primitives";
  Type["Binary"] = "binary";
})(Type = exports.Type || (exports.Type = {}));
var Format;
(function (Format) {
  Format["Currency"] = "currency";
  Format["Percentage"] = "percentage";
  Format["Email"] = "email";
  Format["Url"] = "url";
  Format["Phone"] = "phone";
  Format["Fax"] = "fax";
  Format["IPv4"] = "ipv4";
  Format["IPv6"] = "ipv6";
})(Format = exports.Format || (exports.Format = {}));
function build(model) {
  if (model && !model.source) {
    model.source = model.name;
  }
  var metadata = {
    model: model,
    attributes: model.attributes
  };
  var primaryKeys = new Array();
  var attributes = new Array();
  var selectableAttributes = new Array();
  var insertableAttributes = new Array();
  var updatableAttributes = new Array();
  var updatableMap = new Map();
  var patchableAttributes = new Array();
  var patchableMap = new Map();
  var maxLengthAttributes = new Array();
  var minLengthAttributes = new Array();
  var maxAttributes = new Array();
  var minAttributes = new Array();
  var regExpAttributes = new Array();
  var requiredFields = new Array();
  var boolFields = new Array();
  var dateFields = new Array();
  var integerFields = new Array();
  var numberFields = new Array();
  var currencyFields = new Array();
  var percentageFields = new Array();
  var emailFields = new Array();
  var urlFields = new Array();
  var phoneFields = new Array();
  var faxFields = new Array();
  var ipv4Fields = new Array();
  var ipv6Fields = new Array();
  var objectFields = new Array();
  var arrayFields = new Array();
  var map = new Map();
  var keys = Object.keys(model.attributes);
  for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
    var key = keys_1[_i];
    var attr = model.attributes[key];
    if (attr) {
      attr.name = key;
      var mapField = (attr.field ? attr.field.toLowerCase() : key.toLowerCase());
      attributes.push(attr);
      if (mapField !== key) {
        map[mapField] = key;
      }
      if (attr.version) {
        metadata.version = attr.name;
      }
      if (attr.ignored !== true) {
        if (attr.primaryKey === true) {
          primaryKeys.push(attr);
          selectableAttributes.push(attr);
        }
        else {
          selectableAttributes.push(attr);
          if (!attr.noupdate) {
            updatableAttributes.push(attr);
            updatableMap[attr.name] = attr;
          }
          if (!attr.nopatch) {
            patchableAttributes.push(attr);
            patchableMap[attr.name] = attr;
          }
        }
        if (!attr.noinsert) {
          insertableAttributes.push(attr);
        }
        if (attr.required) {
          requiredFields.push(attr.name);
        }
        if (attr.length && attr.length > 0) {
          maxLengthAttributes.push(attr);
        }
        if (attr.type === Type.Number || attr.type === Type.Integer) {
          if (attr.min) {
            minAttributes.push(attr);
          }
          if (attr.max) {
            maxAttributes.push(attr);
          }
        }
        if (attr.min && attr.min > 0 && attr.type === Type.String) {
          minLengthAttributes.push(attr);
        }
        if (attr.exp) {
          if (typeof attr.exp === 'string') {
            attr.exp = new RegExp(attr.exp);
          }
          regExpAttributes.push(attr);
        }
      }
      switch (attr.type) {
        case Type.String: {
          switch (attr.format) {
            case Format.Email:
              emailFields.push(attr.name);
              break;
            case Format.Url:
              urlFields.push(attr.name);
              break;
            case Format.Phone:
              phoneFields.push(attr.name);
              break;
            case Format.Fax:
              faxFields.push(attr.name);
              break;
            case Format.IPv4:
              ipv4Fields.push(attr.name);
              break;
            case Format.IPv6:
              ipv6Fields.push(attr.name);
              break;
            default:
              break;
          }
          break;
        }
        case Type.Number: {
          switch (attr.format) {
            case Format.Currency:
              currencyFields.push(attr.name);
              break;
            default:
              numberFields.push(attr.name);
              break;
          }
          break;
        }
        case Type.Integer: {
          integerFields.push(attr.name);
          break;
        }
        case Type.Date: {
          dateFields.push(attr.name);
          break;
        }
        case Type.Boolean: {
          boolFields.push(attr.name);
          break;
        }
        case Type.Object: {
          if (attr.typeof) {
            var x = build(attr.typeof);
            x.attributeName = key;
            objectFields.push(x);
          }
          break;
        }
        case Type.Array: {
          if (attr.typeof) {
            var y = build(attr.typeof);
            y.attributeName = key;
            arrayFields.push(y);
          }
          break;
        }
        default:
          break;
      }
    }
  }
  metadata.map = map;
  if (primaryKeys.length > 0) {
    metadata.primaryKeys = primaryKeys;
  }
  metadata.attributes = attributes;
  metadata.selectableAttributes = selectableAttributes;
  metadata.insertableAttributes = insertableAttributes;
  metadata.updatableAttributes = updatableAttributes;
  metadata.updatableMap = updatableMap;
  metadata.patchableAttributes = patchableAttributes;
  metadata.patchableMap = patchableMap;
  if (requiredFields.length > 0) {
    metadata.requiredFields = requiredFields;
  }
  if (maxLengthAttributes.length > 0) {
    metadata.maxLengthAttributes = maxLengthAttributes;
  }
  if (minLengthAttributes.length > 0) {
    metadata.minLengthAttributes = minLengthAttributes;
  }
  if (maxAttributes.length > 0) {
    metadata.maxAttributes = maxAttributes;
  }
  if (minAttributes.length > 0) {
    metadata.minAttributes = minAttributes;
  }
  if (regExpAttributes.length > 0) {
    metadata.regExpAttributes = regExpAttributes;
  }
  if (boolFields.length > 0) {
    metadata.boolFields = boolFields;
  }
  if (dateFields.length > 0) {
    metadata.dateFields = dateFields;
  }
  if (integerFields.length > 0) {
    metadata.integerFields = integerFields;
  }
  if (numberFields.length > 0) {
    metadata.numberFields = numberFields;
  }
  if (percentageFields.length > 0) {
    metadata.percentageFields = percentageFields;
  }
  if (currencyFields.length > 0) {
    metadata.currencyFields = currencyFields;
  }
  if (emailFields.length > 0) {
    metadata.emailFields = emailFields;
  }
  if (urlFields.length > 0) {
    metadata.urlFields = urlFields;
  }
  if (phoneFields.length > 0) {
    metadata.phoneFields = phoneFields;
  }
  if (faxFields.length > 0) {
    metadata.faxFields = faxFields;
  }
  if (ipv4Fields.length > 0) {
    metadata.ipv4Fields = ipv4Fields;
  }
  if (ipv6Fields.length > 0) {
    metadata.ipv6Fields = ipv6Fields;
  }
  if (objectFields.length > 0) {
    metadata.objectFields = objectFields;
  }
  if (arrayFields.length > 0) {
    metadata.arrayFields = arrayFields;
  }
  return metadata;
}
exports.build = build;
