<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Services\DashboardService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request, DashboardService $dashboard): Response
    {
        $filters = $request->only('search', 'category', 'status');

        return Inertia::render('Dashboard', [
            'stats' => fn () => $dashboard->stats(),
            'funnel' => fn () => $dashboard->funnel(),
            'health' => fn () => $dashboard->health(),
            'activity' => fn () => $dashboard->recentActivity(),
            'governance' => fn () => $dashboard->governance(),
            'insights' => fn () => $dashboard->insights(),
            'websites' => fn () => WebsiteController::present(
                WebsiteController::query($filters)->latest('updated_at')->limit(5)->get()
            ),
            'categories' => fn () => Category::orderBy('name')->get(['id', 'name']),
            'filters' => $filters,
        ]);
    }
}
