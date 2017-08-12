module.exports = function (parts) {
  return parts.reduce((acc, value, i) => acc + value + (i + 1 < arguments.length ? encodeURIComponent(arguments[i + 1]) : ''), '');
 };

module.exports.getCurrentUrl = function (location) {
  return `${location.pathname}${location.search}${location.hash}`;
};
