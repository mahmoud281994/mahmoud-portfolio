<?php

namespace App\Providers;

use App\Models\User;
use App\Services\SystemHealthService;
use Illuminate\Mail\Events\MessageSent;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::define('super-admin', fn (User $user) => $user->is_super_admin);

        Event::listen(MessageSent::class, fn () => Cache::forever(SystemHealthService::MAIL_LAST_SENT, now()->toIso8601String()));
    }
}
