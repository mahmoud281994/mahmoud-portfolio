<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['name', 'slug', 'color'])]
class Category extends Model
{
    public function websites(): HasMany
    {
        return $this->hasMany(Website::class);
    }
}
