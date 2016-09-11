<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Events\ChatEvent;


class ChatController extends Controller
{
    public function store(Request $request) {
        // TODO store in rethink and fire when subscribing instead

        Event::fire(new ChatEvent($request));

        return 'Event Fired';
    }

    public function history(Request $request) {
        // TODO return previous messages in given chat channel from RethinkDB
    }

    public function testFire(Request $request) {
        event(new ChatEvent("hello!"));

        return 'Event Fired';
    }

    //
}
