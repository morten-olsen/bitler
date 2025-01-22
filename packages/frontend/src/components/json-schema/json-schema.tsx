import React from 'react';
import { JSONSchema4Type } from 'json-schema';
import YAML from 'yaml';
import { Editor } from '../editor/editor';

type JsonSchemaProps = {
  schema: JSONSchema4Type;
};

const JsonSchema = ({ schema }: JsonSchemaProps) => {
  return <Editor value={YAML.stringify(schema)} />;
};

export { JsonSchema };
