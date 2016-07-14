<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\User;

class Hall extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
    	'name', 'desc', 'idcode', 'pass'
    ];

    protected $casts = [
        'private' => 'boolean'
    ];

    public function owner()
    {
    	return $this->belongsTo(User::class, 'owner_id');
    }

    public function players()
    {

        return $this->hasMany(User::class, 'joined_hall');
    }
}