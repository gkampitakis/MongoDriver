import { Db, ObjectId } from 'mongodb';
import kareem from 'kareem';

type FieldType = 'string' | 'number' | 'object' | typeof ObjectId;

type HooksType = 'save' | 'delete' | 'update' | 'remove' | 'create' | 'delete';

interface SchemaModel {
  [key: string]: {
    type: FieldType | { type: FieldType; ref: Schema }[]; //TODO: this will need further investigation //BUG: this should have a model reference
    required?: boolean;
    default?: any;
    unique?: boolean;
  };
}

export class Schema {
  private _schema: SchemaModel;
  private hooks: any;

  public constructor(schema: SchemaModel) {
    this._schema = schema;
    this.hooks = new kareem();
  }

  public post(hook: HooksType, callback: Function) {

    this.hooks.post(hook, callback);

  }

  public pre(hook: HooksType, callback: Function) {

    this.hooks.pre(hook, callback);

  }

  /** @internal */// eslint-disable-next-line @typescript-eslint/no-empty-function
  public executePreHooks(hook: HooksType, context: any, callback: Function = () => { }) {
    if (this.hooks._pres.get(hook).length <= 0) return;
    this.hooks.execPre(hook, context, [context], callback);
  }


  /** @internal */// eslint-disable-next-line @typescript-eslint/no-empty-function
  public executePostHooks(hook: HooksType, context: any, callback: Function = () => { }) {
    if (this.hooks._posts.get(hook).length <= 0) return;
    this.hooks.execPost(hook, context, [context], callback);
  }

  /** @internal */
  public isValid(document: any, ignoreRequired = false) {
    const schema = this._schema;

    for (const field in schema) {
      if (schema[field].required && !ignoreRequired && !document[field] && !schema[field].default)
        throw new Error(`${field} field is required`);

      if (schema[field].default && !document[field]) document[field] = schema[field].default;

      if (document[field] && schema[field].type !== typeof document[field]) {
        throw new Error(`${field} must be type of ${schema[field].type}`);
      }
    }
  }

  /** @internal */
  public sanitizeData(document: any) {
    const schema = this._schema,
      sanitizedDoc: any = {};

    for (const field in schema) {
      if (document[field]) {
        sanitizedDoc[field] = document[field];
      }
    }

    if (document._id) sanitizedDoc._id = document._id;

    return sanitizedDoc;
  }

  /** @internal */
  public async setupCollection(collectionName: string, db: Db) {
    const collection = await db.createCollection(collectionName);

    const schema = this._schema;

    for (const field in schema) {
      if (schema[field].unique) {
        const index: any = {};
        index[field] = 1;

        collection.createIndex(index, { unique: true });
      }
    }
  }
}

/**
 *  ------------ BACKLOG ------------
 *  //TODO: Paths
 *  //TODO: Hooks
 *  // event emitters
 *  //Populate and schema reference to another Model
 */
