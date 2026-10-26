<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

#[Fillable(['name', 'slug'])]
class Product extends Model
{
    public function websites(): BelongsToMany
    {
        return $this->belongsToMany(Website::class)->withTimestamps();
    }
}
