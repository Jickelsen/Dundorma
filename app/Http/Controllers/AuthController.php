<?php namespace App\Http\Controllers;
use App\User;
use Auth;
use Laravel\Socialite\Contracts\Factory as Socialite;

class AuthController extends Controller
{

    public function __construct(Socialite $socialite){
        $this->socialite = $socialite;
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
            return redirect()->route('home');
            //           dd($user);
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

    protected $redirectPath = '/home';
 }