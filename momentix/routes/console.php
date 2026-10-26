<?php

use App\Services\SystemHealthService;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::call(fn () => Cache::forever(SystemHealthService::SCHEDULER_HEARTBEAT, now()->toIso8601String()))
    ->everyMinute()
    ->name('scheduler-heartbeat');
