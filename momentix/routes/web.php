<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HealthCheckController;
use App\Http\Controllers\SectionController;
use App\Http\Controllers\WebsiteController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    Route::get('login', [LoginController::class, 'create'])->name('login');
    Route::post('login', [LoginController::class, 'store'])->middleware('throttle:5,1');
});

Route::middleware(['auth', 'can:super-admin'])->group(function () {
    Route::get('/', DashboardController::class)->name('dashboard');
    Route::post('health-check', HealthCheckController::class)->name('health-check');

    Route::get('websites/export', [WebsiteController::class, 'export'])->name('websites.export');
    Route::resource('websites', WebsiteController::class)->except('show');

    Route::get('{section}', SectionController::class)
        ->whereIn('section', array_keys(SectionController::SECTIONS))
        ->name('section');
});

Route::post('logout', [LoginController::class, 'destroy'])->middleware('auth')->name('logout');
