<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

// Route::get('/', function () {
//     return view('welcome');
// });
Route::get('/', function () {
    return view('halls');
});

Route::auth();

// Route::get('/home', 'HomeController@index');

Route::get('home', array('as' => 'home', 'uses' => function(){
    return view('home');
}));

//Social Login
Route::get('/login/{provider?}',[
    'uses' => 'Auth\AuthController@getSocialAuth',
    'as'   => 'auth.getSocialAuth'
]);

Route::get('/login/callback/{provider?}',[
    'uses' => 'Auth\AuthController@getSocialAuthCallback',
    'as'   => 'auth.getSocialAuthCallback'
]);

Route::get('json/players/current', 'Auth\AuthController@current');
// Route::get('json/players/loggedin', 'Auth\AuthController@loggedin');

//ajax
Route::get('json/halls/all', 'HallController@all');
Route::get('json/halls/others', 'HallController@others');
Route::get('json/halls/owned', 'HallController@owned');
Route::post('json/halls/create', 'HallController@register');
Route::post('json/halls/update', 'HallController@update');
Route::post('json/halls/delete', 'HallController@delete');
Route::post('json/halls/join', 'HallController@join');
Route::get('json/halls/leave', 'HallController@leave');

Route::get('{path?}', function () {
    return view('halls');
})->where('path', '.*');