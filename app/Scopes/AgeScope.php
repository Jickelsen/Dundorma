<?php

namespace App\Scopes;

use Illuminate\Database\Eloquent\Scope;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Carbon\Carbon;

class AgeScope implements Scope
{
    /**
     * Apply the scope to a given Eloquent query builder.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $builder
     * @param  \Illuminate\Database\Eloquent\Model  $model
     * @return void
     */


    public function apply(Builder $builder, Model $model)
    {
        $MAX_AGE_HOURS = 48;
        return $builder->where('updated_at', '>', Carbon::now()->subHours($MAX_AGE_HOURS));
    }
}