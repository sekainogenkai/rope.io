'use strict';

module.exports = (mongoose, createSchema, update) => {
  const MenuPageMessage = createSchema({
    message: {
      type: String,
      required: true,
      default: '',
    },
  });

  return mongoose.model('MenuPageMessage', MenuPageMessage);
};
