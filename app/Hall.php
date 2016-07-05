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
    	'name', 'desc', 'idcode', 'pass', 
    ];

    protected $casts = [
        'players' => 'array',
        'private' => 'boolean'
    ];

    public function creator()
    {
    	return $this->belongsTo(User::class);
    }

    public function players()
    {

        return $this->hasMany(User::class);
    }
}