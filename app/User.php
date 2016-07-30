<?php

namespace App;

use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'nnid', 'password', 'facebook_id', 'avatar', 'hr', 'joined_hall', 'halls', 'joinedHall'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token', 'facebook_id', 'email',
    ];

    public function halls()
    {
        return $this->hasMany(Hall::class, 'owner_id');
    }

    public function joinedHall ()
    {
    	return $this->belongsTo(Hall::class, 'joined_hall');
    }
}
