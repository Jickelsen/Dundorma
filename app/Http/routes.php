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

Route::get('/', function () {
    return view('welcome');
});

Route::auth();

// Route::get('/home', 'HomeController@index');

Route::get('home', array('as' => 'home', 'uses' => function(){
    return view('home');
}));

//Social Login
Route::get('/login/{provider?}',[
    'uses' => 'AuthController@getSocialAuth',
    'as'   => 'auth.getSocialAuth'
]);

Route::get('/login/callback/{provider?}',[
    'uses' => 'AuthController@getSocialAuthCallback',
    'as'   => 'auth.getSocialAuthCallback'
]);
