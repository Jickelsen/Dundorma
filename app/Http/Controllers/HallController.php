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

        return $request->user()->halls()->with('owner', 'players')->orderBy('id', 'desc')->get();
    }

    public function others(Request $request){

        return Hall::with('owner', 'players')->where('owner', '!=', $request->user()->id)->orderBy('id', 'asc')->get();
    }

    public function all(Request $request){
        return Hall::with('owner', 'players')->get();
    }

    public function players(Request $request)
    {
        return $request->hall()->players()->orderby('id', 'desc')->get();
    }

    public function register(Request $request)
    {
        $request->name = $request->json('name');
        $request->desc = $request->json('desc');
        $request->idcode = $request->json('idcode');
        $request->pass = $request->json('pass');
        $request->onquest = $request->json('onquest');
        $request->full = $request->json('full');
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
            'onquest' => $request->json('onquest'),
            'full' => $request->json('full'),
            'pass' => $request->json('pass'),
            'private' => $request->json('private'),
        ]);

        // Not needed thanks to the owner->halls()->create statement above
        // $hall->owner()->associate($owner);
        // $hall->save();
        $owner->joinedHall()->associate($hall);
        $owner->save();

    }

    public function update(Request $request)
    {

        $request->id = $request->json('id');
        $request->name = $request->json('name');
        $request->desc = $request->json('desc');
        $request->idcode = $request->json('idcode');
        $request->onquest = $request->json('onquest');
        $request->full = $request->json('full');
        $request->pass = $request->json('pass');
        $request->private = $request->json('private');

        $request->user()->halls()->with('owner', 'players')->where('id', '=', $request->id)->update([
        // Hall::with('owner', 'players')->where('id', '!=', $request->id)->update([
            'name' => $request->json('name'),
            'desc' => $request->json('desc'),
            'idcode' => $request->json('idcode'),
            'onquest' => $request->json('onquest'),
            'full' => $request->json('full'),
            'pass' => $request->json('pass'),
            'private' => $request->json('private'),
        ]);

    }

    public function delete(Request $request)
    {
        $request->id = $request->json('id');

        $request->user()->halls()->with('owner', 'players')->where('id', '=', $request->id)->delete();
    }

    public function join(Request $request)
    {
        $request->id = $request->json('id');
        $hall = Hall::with('owner', 'players')->where('id', '=', $request->id)->first();
        $player = $request->user();
        $player->joinedHall()->associate($hall);
        $player->save();
    }

    public function leave(Request $request)
    {
        $player = $request->user();
        $player->joinedHall()->dissociate();
        $player->save();
    }

    public function getlog(Request $request)
    { 
        DB::connection()->enableQueryLog();
        return DB::getQueryLog(); 
    }
}