<?php

namespace App\Http\Controllers\Auth;

use App\User;
use Validator;
use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\ThrottlesLogins;
use Illuminate\Foundation\Auth\AuthenticatesAndRegistersUsers;
use Auth;
use Laravel\Socialite\Contracts\Factory as Socialite;

class AuthController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Registration & Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles the registration of new users, as well as the
    | authentication of existing users. By default, this controller uses
    | a simple trait to add these behaviors. Why don't you explore it?
    |
    */

    use AuthenticatesAndRegistersUsers, ThrottlesLogins;

    /**
     * Where to redirect users after login / registration.
     *
     * @var string
     */
    protected $redirectTo = '/';

    /**
     * Create a new authentication controller instance.
     *
     * @return void
     */
    public function __construct(Socialite $socialite)
    {
        $this->socialite = $socialite;
        $this->middleware($this->guestMiddleware(), ['except' => ['current', 'all', 'logout']]);
    }

    /**
     * Get a validator for an incoming registration request.
     *
     * @param  array  $data
     * @return \Illuminate\Contracts\Validation\Validator
     */
    protected function validator(array $data)
    {
        return Validator::make($data, [
            'name' => 'required|max:10|unique:users',
            'friendcode' => 'max:14',
            'nnid' => 'max:16',
            'email' => 'required|email|max:255|unique:users',
            'password' => 'required|min:6|confirmed',
        ]);
    }

    /**
     * Create a new user instance after a valid registration.
     *
     * @param  array  $data
     * @return User
     */
    protected function create(array $data)
    {
        return User::create([
            'name' => $data['name'],
            'friendcode' => $data['friendcode'],
            'nnid' => $data['nnid'],
            'email' => $data['email'],
            'password' => bcrypt($data['password']),
        ]);
    }



    public function getSocialAuth($provider=null)
    {
        if(!config("services.$provider")) abort('404'); //just to handle providers that doesn't exist

        return $this->socialite->with($provider)->redirect();
    }


    public function getSocialAuthCallback($provider=null)
    {
        // try {
        //     $user = $this->socialite->driver('facebook')->user();
        // } catch (Exception $e) {
        //     return redirect('auth/facebook');
        // }

        // $authUser = $this->findOrCreateUser($user);

        // Auth::login($authUser, true);

        // return redirect()->route('home');


        // if($user = $this->socialite->with($provider)->user()){
        //     dd($user);
        // }else{
        //     return 'something went wrong';
        // }

        if($user = $this->socialite->with($provider)->user()){
            $authUser = $this->findOrCreateUser($user);
            Auth::login($authUser, true);
            return redirect()->route('halls');
        }else{
            return 'something went wrong';
        }
    }
    /**
     * Return user if exists; create and return if doesn't
     *
     * @param $facebookUser
     * @return User
     */
    private function findOrCreateUser($facebookUser)
    {
        $authUser = User::where('facebook_id', $facebookUser->id)->first();

        if ($authUser){
            return $authUser;
        }

        return User::create([
            'name' => $facebookUser->name,
            'email' => $facebookUser->email,
            'facebook_id' => $facebookUser->id,
            'avatar' => $facebookUser->avatar
        ]);
    }

    public function all()
    {
        return User::with('halls')->get();
    }

    public function current(){
        $authUser = Auth::user();
        if (!is_null($authUser)) {
            return $authUser;
        } else {
            return response()->json(['id' => 0]);
            // return json_encode(array('id' => 0, 'whatever' => 10), JSON_FORCE_OBJECT)->get();
        }
    }

    // public function loggedin() {
    //     return Auth::check();
    // }

    protected $redirectPath = '/';

}
