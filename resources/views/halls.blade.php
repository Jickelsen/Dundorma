@extends('layouts.app')

@section('content')

<div v-el:main-container style="height: calc(100% - 80px)">
    <div class="container">
        <div id="halls">
        </div>
    </div>
</div>


{{-- libs for the app --}}
<script type="text/javascript" src="js/halls.js"></script>


@endsection