var elixir = require('laravel-elixir');

// elixir.config.js.browserify.transformers
//   .find(transformer => transformer.name === 'babelify')
//   .options.plugins = [
//     'stage-0',
//   ];

 elixir.config.js.browserify.transformers
 .find(transformer => transformer.name === 'babelify')
 .options.plugins = [
 'syntax-object-rest-spread',
 'transform-object-rest-spread'
 ];

/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Sass
 | file for our application, as well as publishing vendor resources.
 |
 */

elixir(function(mix) {
  mix.copy('node_modules/react-bootstrap-modal/lib/styles/rbm-patch.css', 'public/css/rbm-patch.css');
  mix.sass('app.scss');
  mix.browserify('halls.js');
  mix.browserify('profile.js');
});
