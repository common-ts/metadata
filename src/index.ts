export enum Type {
  Date = 'date',
  Boolean = 'boolean',

  Number = 'number',
  Integer = 'integer',
  String = 'string',

  Object = 'object',
  Array = 'array',
}

export enum Format {
  Currency = 'currency',

  Phone = 'phone',
  Fax = 'fax',
}

export interface Model {
  name?: string;
  attributes: any;
  source?: string;
}

export interface Attribute {
  name?: string;
  field?: string;
  type: Type;
  format?: Format;
  key?: boolean;
  version?: boolean;
  ignored?: boolean;
  typeof?: Model;
}

export interface MetaModel {
  model: Model;
  attributeName?: string;
  keys?: string[];
  dateFields?: string[];
  integerFields?: string[];
  numberFields?: string[];
  currencyFields?: string[];
  phoneFields?: string[];
  faxFields?: string[];
  objectFields?: MetaModel[];
  arrayFields?: MetaModel[];
  version?: string;
}

export function build(model: Model): MetaModel {
  if (model && !model.source) {
    model.source = model.name;
  }
  const metadata: MetaModel = {model};
  const primaryKeys: string[] = new Array<string>();
  const dateFields = new Array<string>();
  const integerFields = new Array<string>();
  const numberFields = new Array<string>();
  const currencyFields = new Array<string>();
  const phoneFields = new Array<string>();
  const faxFields = new Array<string>();
  const objectFields = new Array<MetaModel>();
  const arrayFields = new Array<MetaModel>();
  const keys: string[] = Object.keys(model.attributes);
  for (const key of keys) {
    const attr: Attribute = model.attributes[key];
    if (attr) {
      attr.name = key;
      if (attr.version) {
        metadata.version = attr.name;
      }
      if (attr.ignored !== true) {
        if (attr.key === true) {
          primaryKeys.push(attr.name);
        }
      }

      switch (attr.type) {
        case Type.String: {
          switch (attr.format) {
            case Format.Phone:
              phoneFields.push(attr.name);
              break;
            case Format.Fax:
              faxFields.push(attr.name);
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
  if (primaryKeys.length > 0) {
    metadata.keys = primaryKeys;
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
  if (currencyFields.length > 0) {
    metadata.currencyFields = currencyFields;
  }
  if (phoneFields.length > 0) {
    metadata.phoneFields = phoneFields;
  }
  if (faxFields.length > 0) {
    metadata.faxFields = faxFields;
  }
  if (objectFields.length > 0) {
    metadata.objectFields = objectFields;
  }
  if (arrayFields.length > 0) {
    metadata.arrayFields = arrayFields;
  }
  return metadata;
}
