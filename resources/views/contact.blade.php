@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row">
        <div class="col-md-8 col-md-offset-2">
            <div class="panel panel-default">
                <div class="panel-heading">Leave Feedback for Hunter Hubs</div>
                    <div class="panel-body">
                        <p id="form-message">Hi, my name is Jacob and I made this site to to give something back to the Monster Hunter series and its great community. Use the form below to leave feedback regarding the site, or contact <a href="http://www.twitter.com/jickelsen">@jickelsen on Twitter</a>.</p>
                        <ul>
                            @foreach($errors->all() as $error)
                                <li>{{ $error }}</li>
                            @endforeach
                        </ul>

                        {!! Form::open(array('route' => 'contact_store', 'class' => 'form')) !!}

                        <div class="form-group">
                            {!! Form::label('Your Name') !!}
                            {!! Form::text('name', null, 
                                array('required', 
                                    'class'=>'form-control', 
                                    'placeholder'=>'Your name')) !!}
                        </div>

                        <div class="form-group">
                            {!! Form::label('Your E-mail Address') !!}
                            {!! Form::text('email', null, 
                                array('required', 
                                    'class'=>'form-control', 
                                    'placeholder'=>'Your e-mail address')) !!}
                        </div>

                        <div class="form-group">
                            {!! Form::label('Your Message') !!}
                            {!! Form::textarea('message', null, 
                                array('required', 
                                    'class'=>'form-control', 
                                    'placeholder'=>'Your message')) !!}
                        </div>

                        <div class="form-group">
                            {!! Form::submit('Leave Feedback!', 
                            array('class'=>'btn btn-primary')) !!}
                        </div>
                        {!! Form::close() !!}
                    </div>
                </div>
            </div>
        </div>
    </div>
    @endsection