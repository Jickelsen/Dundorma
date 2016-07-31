<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\User;
use App\Scopes\AgeScope;

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
        'onquest' => 'boolean',
        'full' => 'boolean',
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

    protected static function boot()
    {
        parent::boot();

        static::addGlobalScope(new AgeScope);
    }
}