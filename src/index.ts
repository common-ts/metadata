export enum Type {
  ObjectId = 'ObjectId',
  Date = 'date',
  Boolean = 'boolean',

  Number = 'number',
  Integer = 'integer',
  String = 'string',
  Text = 'text',

  Object = 'object',
  Array = 'array',
  Primitives =  'primitives',
  Binary = 'binary'
}

export enum Format {
  Currency = 'currency',
  Percentage = 'percentage',

  Email = 'email',
  Url = 'url',
  Phone = 'phone',
  Fax = 'fax',

  IPv4 = 'ipv4',
  IPv6 = 'ipv6',
}

export interface Model {
  name?: string;
  attributes: any;
  source?: string;
  model?: any;
  schema?: any;
}

export interface Attribute {
  name?: string;
  field?: string;
  type: Type;
  format?: Format;
  required?: boolean;
  defaultValue?: any;
  key?: boolean;
  unique?: boolean;
  noinsert?: boolean;
  noupdate?: boolean;
  nopatch?: boolean;
  version?: boolean;
  length?: number;
  min?: number;
  max?: number;
  gt?: number;
  lt?: number;
  precision?: number;
  scale?: number;
  exp?: RegExp|string;
  code?: string;
  noformat?: boolean;
  ignored?: boolean;
  jsonField?: string;
  link?: string;
  typeof?: Model;
}

export interface MetaModel {
  model: Model;
  attributeName?: string;
  keys?: string[];
  attributes?: Attribute[];
  selectableAttributes?: Attribute[];
  insertableAttributes?: Attribute[];
  updatableAttributes?: Attribute[];
  patchableAttributes?: Attribute[];
  updatableMap?: Map<string, Attribute>;
  patchableMap?: Map<string, Attribute>;
  requiredFields?: string[];
  maxLengthAttributes?: Attribute[];
  minLengthAttributes?: Attribute[];
  maxAttributes?: Attribute[];
  minAttributes?: Attribute[];
  regExpAttributes?: Attribute[];
  booleans?: string[];
  dates?: string[];
  integers?: string[];
  numbers?: string[];
  percentages?: string[];
  currencies?: string[];
  emails?: string[];
  urls?: string[];
  phones?: string[];
  faxes?: string[];
  ipv4s?: string[];
  ipv6s?: string[];
  objects?: MetaModel[];
  arrays?: MetaModel[];
  map?: Map<string, string>;
  version?: string;
}

export function build(model: Model): MetaModel {
  if (model && !model.source) {
    model.source = model.name;
  }
  const metadata: MetaModel = {
    model,
    attributes: model.attributes
  };
  const primaryKeys: string[] = new Array<string>();
  const attributes: Attribute[] = new Array<Attribute>();
  const selectableAttributes: Attribute[] = new Array<Attribute>();
  const insertableAttributes: Attribute[] = new Array<Attribute>();
  const updatableAttributes: Attribute[] = new Array<Attribute>();
  const updatableMap = new Map<string, Attribute>();
  const patchableAttributes: Attribute[] = new Array<Attribute>();
  const patchableMap = new Map<string, Attribute>();
  const maxLengthAttributes: Attribute[] = new Array<Attribute>();
  const minLengthAttributes: Attribute[] = new Array<Attribute>();
  const maxAttributes: Attribute[] = new Array<Attribute>();
  const minAttributes: Attribute[] = new Array<Attribute>();
  const regExpAttributes: Attribute[] = new Array<Attribute>();
  const requiredFields = new Array<string>();
  const boolFields = new Array<string>();
  const dateFields = new Array<string>();
  const integerFields = new Array<string>();
  const numberFields = new Array<string>();
  const currencyFields = new Array<string>();
  const percentageFields = new Array<string>();
  const emailFields = new Array<string>();
  const urlFields = new Array<string>();
  const phoneFields = new Array<string>();
  const faxFields = new Array<string>();
  const ipv4Fields = new Array<string>();
  const ipv6Fields = new Array<string>();
  const objectFields = new Array<MetaModel>();
  const arrayFields = new Array<MetaModel>();
  const map = new Map<string, string>();
  const keys: string[] = Object.keys(model.attributes);
  for (const key of keys) {
    const attr: Attribute = model.attributes[key];
    if (attr) {
      attr.name = key;
      const mapField = (attr.field ? attr.field.toLowerCase() : key.toLowerCase());
      attributes.push(attr);
      if (mapField !== key) {
        map[mapField] = key;
      }
      if (attr.version) {
        metadata.version = attr.name;
      }
      if (attr.ignored !== true) {
        if (attr.key === true) {
          primaryKeys.push(attr.name);
          selectableAttributes.push(attr);
        } else {
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
            /*
            case FormatType.Percentage:
              percentageFields.push(attr.name);
              break;
            */
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
            const x = build(attr.typeof);
            x.attributeName = key;
            objectFields.push(x);
          }
          break;
        }
        case Type.Array: {
          if (attr.typeof) {
            const y = build(attr.typeof);
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
    metadata.keys = primaryKeys;
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
    metadata.booleans = boolFields;
  }
  if (dateFields.length > 0) {
    metadata.dates = dateFields;
  }
  if (integerFields.length > 0) {
    metadata.integers = integerFields;
  }
  if (numberFields.length > 0) {
    metadata.numbers = numberFields;
  }
  if (percentageFields.length > 0) {
    metadata.percentages = percentageFields;
  }
  if (currencyFields.length > 0) {
    metadata.currencies = currencyFields;
  }
  if (emailFields.length > 0) {
    metadata.emails = emailFields;
  }
  if (urlFields.length > 0) {
    metadata.urls = urlFields;
  }
  if (phoneFields.length > 0) {
    metadata.phones = phoneFields;
  }
  if (faxFields.length > 0) {
    metadata.faxes = faxFields;
  }
  if (ipv4Fields.length > 0) {
    metadata.ipv4s = ipv4Fields;
  }
  if (ipv6Fields.length > 0) {
    metadata.ipv6s = ipv6Fields;
  }
  if (objectFields.length > 0) {
    metadata.objects = objectFields;
  }
  if (arrayFields.length > 0) {
    metadata.arrays = arrayFields;
  }
  return metadata;
}
