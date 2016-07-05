<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Hall;
// use App\Response;
// use Illuminate\Contracts\Routing\ResponseFactory;

class HallController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function owned(Request $request)
    {
        // return response($request->user()->id, 202);
        // return Response::json($request->user()->genomes;, 200, [], JSON_NUMERIC_CHECK);
        return $request->user()->halls()->orderBy('id', 'desc')->get();
    }

    public function others(Request $request){
        return Halls::where('user_id', '!=', $request->user()->id)->orderBy('id', 'asc')->get();
    }

    public function all(Request $request){
        // return response('hejhopp: [1,2,3]',202);
        // var_dump($request->user()->genomes->first());
        // var_dump(Genome::all());
    }

    public function players(Request $request)
    {
        return Halls::where('id', '!=', $request->id)->orderBy('id', 'asc')->get();
    }

    public function create(Request $request)
    {
     //    $name = $request->json('name');
     //    $genome = $request->json('genome');

        $request->name = $request->json('name');
        $request->desc = $request->json('desc');
        $request->id = $request->json('id');
        $request->pass = $request->json('pass');
        $request->players = $request->json('players');
        $request->private = $request->json('private');

    	// $this->validate($request,[
    	// 	'name' => 'required|string|max:255',
    	// 	'id' => 'required',
    	// ]);


    	$request->user()->halls()->create([
    		'name' => $request->json('name'),
            'dec' => $request->json('desc'),
            'id' => $request->json('id'),
            'pass' => $request->json('pass'),
            'players' => $request->json('players'),
            'private' => $request->json('private'),
    	]);
    }
}