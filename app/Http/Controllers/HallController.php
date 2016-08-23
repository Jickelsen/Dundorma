<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Snipe\BanBuilder\CensorWords;

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
        return Hall::with('owner', 'players')->where('owner_id', '!=', $request->user()->id)->where('idcode', '!=', "")->orderBy('id', 'asc')->get();
    }

    public function all(Request $request){
        return Hall::with('owner', 'players')->where('idcode', '!=', "")->get();
    }

    public function scheduled(Request $request){
        return Hall::with('owner', 'players')->whereDate('scheduled_for', '>=', date("Y-m-d"))->get();
    }

    public function players(Request $request)
    {
        return $request->hall()->players()->orderby('id', 'desc')->get();
    }

    public function register(Request $request)
    {
        // Hackish solution to delete own hall once user joins a new one
        // $oldHall = $request->user()->halls()->first();
        // if (!is_null($oldHall)) {
        //     $oldHall->delete();
        // }

        $request->name = $request->json('name');
        $request->desc = $request->json('desc');
        $request->idcode = $request->json('idcode');
        $request->idcode = $request->json('idcode');
        $request->scheduled_for = $request->json('scheduled_for');
        $request->pass = $request->json('pass');
        $request->onquest = $request->json('onquest');
        $request->full = $request->json('full');
        $request->private = $request->json('private');

        $owner = $request->user();

        // $this->validate($request,[
        //  'name' => 'required|string|max:255',
        //  'id' => 'required',
        // ]);

        $censor = new CensorWords;

        $scheduled_for;
        if ($request->json('scheduled_for') == "") {
            $scheduled_for = null; 
        } else {
            $scheduled_for = date("Y-m-d H:i:s", $request->json('scheduled_for')/1000);
        }

        $hall = $owner->halls()->create([
            'name' => $censor->censorString($request->json('name'), true)['clean'],
            'desc' => $censor->censorString($request->json('desc'), true)['clean'],
            'idcode' => $request->json('idcode'),
            'scheduled_for' => $scheduled_for,
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
        return $scheduled_for;
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

        $censor = new CensorWords;

        $request->user()->halls()->with('owner', 'players')->where('id', '=', $request->id)->update([
        // Hall::with('owner', 'players')->where('id', '!=', $request->id)->update([
            'name' => $censor->censorString($request->json('name'), true)['clean'],
            'desc' => $censor->censorString($request->json('desc'), true)['clean'],
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

        // Hackish solution to delete own hall once user joins a new one
        // $oldHall = $request->user()->halls()->first();
        // if (!is_null($oldHall)) {
        //     $oldHall->delete();
        // }

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
}