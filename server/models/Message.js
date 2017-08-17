'use strict';

module.exports = (mongoose, createSchema, update) => {
  const Message = createSchema({
    message: {
      type: String,
      required: true,
      default: '',
    },
  });

  return mongoose.model('Message', Message);
};
