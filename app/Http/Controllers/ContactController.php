<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Requests\ContactFormRequest;

class ContactController extends Controller
{
    public function create() {
        return view('contact');
    }

    public function store(ContactFormRequest $request)
    {
        \Mail::send('email.contactmail',
                    array(
                        'name' => $request->get('name'),
                        'email' => $request->get('email'),
                        'user_message' => $request->get('message')
                    ), function($message)
                    {
                        $message->from('village_moofah@hunterhubs.com');
                        $message->to('chromegadget@gmail.com', 'Village Moofah')->subject('Hunter Hubs Feedback');
                    });
        return \Redirect::route('contact')
            ->with('message', 'Thanks for leaving feedback!');

    }
}
