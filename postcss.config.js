// postcss.config.js
const postcssColorMod = require('postcss-color-mod-function');
module.exports = {
    syntax: 'postcss-scss',
    plugins: [
      require("autoprefixer"), // example of plugin you might use
      postcssColorMod(/* pluginOptions */)
    ]
  };

