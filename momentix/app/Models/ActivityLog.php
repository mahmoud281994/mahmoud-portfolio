<?php

namespace App\Models;

use App\Enums\ActivityLevel;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['user_id', 'event', 'level', 'description', 'subject', 'ip_address', 'created_at'])]
class ActivityLog extends Model
{
    public const UPDATED_AT = null;

    protected function casts(): array
    {
        return [
            'level' => ActivityLevel::class,
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public static function record(string $event, string $description, ?string $subject = null, ActivityLevel $level = ActivityLevel::Info): self
    {
        return static::create([
            'user_id' => auth()->id(),
            'event' => $event,
            'level' => $level,
            'description' => $description,
            'subject' => $subject,
            'ip_address' => request()->ip(),
        ]);
    }
}
