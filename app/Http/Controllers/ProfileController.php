<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Collection;

use App\Http\Requests;
// use App\Http\Controllers\Controller;
use Storage;
use Auth;
use Response;

use App\User;


class ProfileController extends Controller
{

    public function __construct()
    {
        $this->middleWare('auth');
        // $this->middleWare('teacherOrUser');
    }

    public function index(Request $request)
    {
        if(Auth::check()){
            return view('profile');
        }
        else{
            return "nanananana!!!";
        }
    }

    public function update(Request $request)
    {
        if(Auth::check()){

            $user = $request->user();
            $id = $request->user()->id;
            // return var_dump($request);
            // $request = $request->json()->all();
            // $infput_array = (array)$request;

            $this->validate($request,[
                'name' => 'required|max:10',
                'friendcode' => 'sometimes|max:14|unique:users,nnid,'.$id,
                'nnid' => 'sometimes|max:16|unique:users,nnid,'.$id,
                'email' => 'sometimes|email|max:255|unique:users,email,'.$id,
                'pass' => 'sometimes|min:6'
            ]);

            $user->name = $request->name;
            $user->friendcode = $request->friendcode;
            $user->nnid = $request->nnid;

            if($request->pass != ''){
                $user->password = bcrypt($request->pass);
            }

            if($request->email != ''){
                $user->email = $request->email;
            }
            $user->save();
        }
    }

    public function getProfile(Request $request)
    {
        if(!(Auth::check())){
            App::abort(403, 'No hacking allowed!');
        }
        $response = $request->user()->toArray();
        $response['email'] = $request->user()->email;
        // $response = array_merge($request->user()->toArray(), $request->user()->email);

        return response()->json($response);
    }
}

?>
