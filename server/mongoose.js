'use strict';

const fs = require('fs');
const Mongoose = require('mongoose').Mongoose;
const mongooseFindOrCreate = require('mongoose-findorcreate');
const path = require('path');

const mongoose = new Mongoose();
mongoose.Promise = Promise;


for (const modelFileName of fs.readdirSync(path.join(__dirname, 'models'))) {
  const modelFilePath = path.join(__dirname, 'models', modelFileName);
  if (/^[^.]*\.js$/.test(modelFileName)
	    && fs.statSync(modelFilePath).isFile()) {

    // I want to set the default schema to have emitIndexErrors
    // enabled and I can’t figure out how else to it.
    let usedCreateSchema = false;
    const createSchema = (definition, options) => {
      usedCreateSchema = true;

      // Correct required String entries to permit empty string by
      // default.
      Object.keys(definition).forEach(fieldName => {
        const fieldDefinition = definition[fieldName];
        if (fieldDefinition.required === true
            && fieldDefinition.type === String) {
          // Mongoose doesn’t do required correctly for strings, we
          // have to use this hack to have required accept '' as a
          // string value: https://stackoverflow.com/a/44336895
          fieldDefinition.required = function () {
            // This function runs with this as the model instance. So
            // we need to know fieldName. To get proper “required”
            // behavior, use typeof check. We turn off required when
            // the current value is a string but turn it on when it is
            // not a string type. This will accept strings and deny a
            // missing field, undefined, and null. I.e., it’ll do the
            // equivalent of NOT NULL.
            return typeof this[fieldName] !== 'string';
          };
        }

        // Correct behavior of “optional” fields. If in the schema,
        // they must be at least set to null. Though this’ll probably
        // break everything, heh heh.
        if (!fieldDefinition.required) {
          fieldDefinition.required = function () {
            // Like for the string hack. Require it if it is undefined
            // (permits null which is what we want here—explicitness).
            return this[fieldName] === undefined;
          };
        }

        // Likewise, fix match to actually work properly especially
        // when we have required=true and match set to require a
        // non-empty string. I.e., this is how Mongoose *should* work…
        // Do this by appending our own manual validate step which
        // only runs when the string is empty.
        if (fieldDefinition.match) {
          const match = [].concat(fieldDefinition.match);
          const matcher = match[0];
          const validate = fieldDefinition.validate = [].concat(fieldDefinition.validate || []);
          validate.push(function (value) {
            return value === null || matcher.test(value);
          });
        }
      });

      const schema = new mongoose.Schema(definition, Object.assign({
        emitIndexErrors: true,
      }, options));
      schema.plugin(mongooseFindOrCreate);
      return schema;
    };

    const update = updater => {
      scheduledUpdates.push(() => updater(model));
    };
    update.update = update;
    update.dropIndex = indexSpec => update(model => model.collection.dropIndex(indexSpec).catch(ex => {
      if (ex.codeName === 'IndexNotFound') {
        return null;
      }
      return Promise.reject(ex);
    }));

    const model = require(`./models/${modelFileName}`)(mongoose, createSchema, update);

    if (!model || !model.modelName) {
      throw new Error(`Model ${modelFileName} (${modelFilePath}) did not return a model.`);
    }

    if (!usedCreateSchema) {
      throw new Error(`Model ${modelFileName} (${modelFilePath}) did not use the passed in createSchema function.`);
    }
  }
}

module.exports = mongoose;
