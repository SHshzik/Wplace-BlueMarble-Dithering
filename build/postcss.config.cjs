module.exports = {
  plugins: [
    require('postcss-modules')({
      generateScopedName: '[hash:base64:5]'
    }),
    require('cssnano')({
      preset: 'default'
    })
  ]
};
