<?php

namespace App\Http\Controllers;

use App\Enums\ActivityLevel;
use App\Models\ActivityLog;
use App\Services\SystemHealthService;
use Illuminate\Http\RedirectResponse;

class HealthCheckController extends Controller
{
    public function __invoke(SystemHealthService $health): RedirectResponse
    {
        $failing = collect($health->checks())->reject(fn (array $check) => $check['healthy'])->pluck('name');

        ActivityLog::record(
            'health.checked',
            $failing->isEmpty() ? 'Health check passed' : 'Health check failed',
            $failing->implode(', ') ?: 'All systems operational',
            $failing->isEmpty() ? ActivityLevel::Info : ActivityLevel::Critical,
        );

        return back()->with(
            $failing->isEmpty() ? 'success' : 'error',
            $failing->isEmpty() ? 'All systems operational.' : 'Issues detected: '.$failing->implode(', ').'.',
        );
    }
}
