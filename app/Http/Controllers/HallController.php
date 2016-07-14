<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Hall;
use App\User;

use DB;
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
        // $this->middleware('auth');
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

        // $halls = $request->user()->halls()->orderBy('id', 'desc');
        // foreach ($halls as $hall) {
        //     $players = $hall->players();


        //     User::where('hall_id', '==', $hall->id)->orderBy('id', 'asc')->get();
        //     $hall->
        //         ->union($first)
        //         echo $title;
        // }

        return $request->user()->halls()->with('owner', 'players')->orderBy('id', 'desc')->get();
    }

    public function others(Request $request){

        return Hall::with('owner', 'players')->where('owner', '!=', $request->user()->id)->orderBy('id', 'asc')->get();
    }

    public function all(Request $request){
        return Hall::with('owner', 'players')->get();
        // return DB::table('halls')->get();
        // return response('hejhopp: [1,2,3]',202);
        // var_dump($request->user()->genomes->first());
        // var_dump(Genome::all());
    }

    public function players(Request $request)
    {
        return $request->hall()->players()->orderby('id', 'desc')->get();
        // return User::where('joined_hall', '==', $request->id)->orderBy('id', 'asc')->get();
    }

    public function register(Request $request)
    {
     //    $name = $request->json('name');
     //    $genome = $request->json('genome');

        $request->name = $request->json('name');
        $request->desc = $request->json('desc');
        $request->idcode = $request->json('idcode');
        $request->pass = $request->json('pass');
        $request->private = $request->json('private');

        $owner = $request->user();

        // $this->validate($request,[
        //  'name' => 'required|string|max:255',
        //  'id' => 'required',
        // ]);


        $hall = $owner->halls()->create([
            'name' => $request->json('name'),
            'desc' => $request->json('desc'),
            'idcode' => $request->json('idcode'),
            'pass' => $request->json('pass'),
            'private' => $request->json('private'),
        ]);

        // Not needed thanks to the owner->halls()->create statement above
        // $hall->owner()->associate($owner);
        // $hall->save();
        $owner->joinedHall()->associate($hall);
        $owner->save();

    }
}