<?php

namespace App\Http\Controllers;

use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class SectionController extends Controller
{
    public const SECTIONS = [
        'owners' => 'Owners',
        'invitations' => 'Invitations',
        'categories' => 'Categories',
        'capabilities' => 'Capabilities',
        'products' => 'Products & Modules',
        'themes' => 'Themes & Templates',
        'analytics' => 'Platform Analytics',
        'activity' => 'Activity Feed',
        'audit-logs' => 'Audit Logs',
        'system-health' => 'System Health',
        'backups' => 'Backups & Recovery',
        'settings' => 'Platform Settings',
    ];

    public function __invoke(string $section): Response
    {
        return Inertia::render('Section', [
            'title' => self::SECTIONS[$section] ?? Str::headline($section),
        ]);
    }
}
