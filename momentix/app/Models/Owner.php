<?php

namespace App\Models;

use App\Enums\OwnerStatus;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['name', 'email', 'status', 'invited_at'])]
class Owner extends Model
{
    protected function casts(): array
    {
        return [
            'status' => OwnerStatus::class,
            'invited_at' => 'datetime',
        ];
    }

    public function websites(): HasMany
    {
        return $this->hasMany(Website::class);
    }
}
