/* eslint-disable @typescript-eslint/no-explicit-any */

export type SchemaDefinition = ObjectSchema | NumberSchema | StringSchema | ArraySchema | BooleanSchema | NullSchema;

interface ObjectSchema extends CommonKeys {
	type: 'object';
	maxProperties?: number;
	minProperties?: number;
	properties: {
		[key: string]: SchemaDefinition;
	};
	required?: string[];
	patternProperties?: {
		[key: string]: SchemaDefinition;
	};
	default?: object;
	additionalProperties?: boolean;
	dependencies?: {
		[key: string]: string[] | SchemaDefinition;
	};
	propertyNames?: SchemaDefinition;
}

interface BooleanSchema {
	type: 'boolean';
	default?: boolean;
}

interface NullSchema {
	type: 'null';
}

interface NumberSchema extends CommonKeys {
	type: 'number' | 'integer';
	maximum?: number;
	minimum?: number;
	exclusiveMaximum?: boolean;
	exclusiveMinimum?: boolean;
	multipleOf?: any;
	default?: number;
	unique?: boolean;
}

interface StringSchema extends CommonKeys {
	type: 'string';
	maxLength?: number;
	minLength?: number;
	pattern?: any;
	format?: string;
	formatMaximum?: string;
	formatMinimum?: string;
	formatExclusiveMaximum?: boolean;
	formatExclusiveMinimum?: boolean;
	default?: string;
	unique?: boolean;
}

interface ArraySchema extends CommonKeys {
	type: 'array';
	maxItems?: number;
	minItems?: number;
	uniqueItems?: boolean;
	items?: object | object[];
	additionalItems?: boolean | object;
	contains?: SchemaDefinition;
	default?: any[];
}

interface CommonKeys {
	enum?: any[];
	const?: any;
	not?: SchemaDefinition;
}

//TODO: read again the documentation and re revaluate