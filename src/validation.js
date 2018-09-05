// @flow

import _ from 'lodash';
import Ajv from 'ajv';

import jsonSchemaDraft04 from 'ajv/lib/refs/json-schema-draft-04.json';
import alexaSmartHomeMessageSchema from './alexa_smart_home_message_schema.json';

function jsonSchemaValidationImpl(response: Object): void {
  if (['Alexa.Video', 'Alexa.Discovery', 'Alexa'].includes(_.get(response, 'event.header.namespace'))) {
    // TODO - merge/update Alexa jsonschema when available for Video Skill
    return;
  }

  const ajv = new Ajv({ schemaId: 'auto' });
  ajv.addMetaSchema(jsonSchemaDraft04);

  const valid = ajv.validate(alexaSmartHomeMessageSchema, response);

  if (!valid) {
    console.warn('Invalid JSON response:', JSON.stringify(ajv.errors));
    throw new Error('Invalid JSON response');
  }
}

export function jsonSchemaValidation(response: Object): void {
  console.time('json-validation');
  jsonSchemaValidationImpl(response);
  console.timeEnd('json-validation');
}
