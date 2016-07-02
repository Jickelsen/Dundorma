@extends('layouts.app')

@section('content')
  <body>
  <div class="container">
    <div class="content">
      <div class="title">Laravel 5</div>
      You are logged in!
      <div>
        <h4>Your name is {{ Auth::user()->name }} </h4>
        <h4>Your name is {{ Auth::user()->email }} </h4>
      </div>
    </div>
  </div>
  </body>
  @endsection
