<?php

namespace App\Http\Middleware;

use App\Enums\ActivityLevel;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user()?->only('id', 'name', 'email'),
            ],
            'environment' => app()->environment(),
            'alertsCount' => fn () => $request->user()
                ? ActivityLog::where('level', ActivityLevel::Critical)->where('created_at', '>=', now()->subDay())->count()
                : 0,
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
        ];
    }
}
