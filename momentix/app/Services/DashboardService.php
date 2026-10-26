<?php

namespace App\Services;

use App\Enums\ActivityLevel;
use App\Enums\OwnerStatus;
use App\Enums\WebsiteStatus;
use App\Models\ActivityLog;
use App\Models\Category;
use App\Models\Owner;
use App\Models\Product;
use App\Models\Website;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Query\Builder as QueryBuilder;
use Illuminate\Support\Facades\DB;

class DashboardService
{
    public function __construct(private SystemHealthService $health) {}

    public function stats(): array
    {
        $signups = $this->windowCounts(Website::query());

        return [
            'total' => $this->metric(Website::query()),
            'published' => $this->metric(Website::where('status', WebsiteStatus::Published)),
            'draft' => $this->metric(Website::where('status', WebsiteStatus::Draft)),
            'suspended' => $this->metric(Website::where('status', WebsiteStatus::Suspended)),
            'pendingOwners' => $this->metric(Owner::where('status', OwnerStatus::Invited)),
            'activeProducts' => $this->metric(DB::table('product_website')),
            'criticalAlerts' => [
                'value' => $this->windowCounts(ActivityLog::where('level', ActivityLevel::Critical))['current'],
                'change' => $this->change(ActivityLog::where('level', ActivityLevel::Critical)),
            ],
            'growth' => [
                'change' => $this->percent($signups['current'], $signups['previous']),
                'previous' => $signups['previous'],
                'current' => $signups['current'],
            ],
        ];
    }

    public function funnel(): array
    {
        $counts = Website::query()->select('status', DB::raw('count(*) as total'))->groupBy('status')->pluck('total', 'status');
        $total = max($counts->sum(), 1);

        return collect(WebsiteStatus::cases())->map(fn (WebsiteStatus $status) => [
            'status' => $status->value,
            'label' => $status->label(),
            'count' => (int) ($counts[$status->value] ?? 0),
            'percent' => (int) round(($counts[$status->value] ?? 0) / $total * 100),
        ])->all();
    }

    public function health(): array
    {
        return $this->health->checks();
    }

    public function recentActivity(int $limit = 5): array
    {
        return ActivityLog::latest('created_at')->latest('id')->limit($limit)->get()
            ->map(fn (ActivityLog $log) => [
                'id' => $log->id,
                'event' => $log->event,
                'level' => $log->level->value,
                'description' => $log->description,
                'subject' => $log->subject,
                'time' => $log->created_at->diffForHumans(),
            ])->all();
    }

    public function governance(): array
    {
        $backups = ActivityLog::whereIn('event', ['backup.completed', 'backup.failed'])
            ->where('created_at', '>=', now()->subDays(30))
            ->select('event', DB::raw('count(*) as total'))->groupBy('event')->pluck('total', 'event');
        $backupTotal = $backups->sum();
        $successRate = $backupTotal > 0 ? (int) round(($backups['backup.completed'] ?? 0) / $backupTotal * 100) : null;

        return [
            'auditEvents' => $this->windowMetric(ActivityLog::query()),
            'failedLogins' => $this->windowMetric(ActivityLog::where('event', 'auth.login_failed')),
            'permissionChanges' => $this->windowMetric(ActivityLog::where('event', 'permission.changed')),
            'backups' => [
                'healthy' => $successRate === 100,
                'successRate' => $successRate,
            ],
        ];
    }

    public function insights(): array
    {
        $topCategory = Category::withCount('websites')->orderByDesc('websites_count')->first();
        $topProduct = Product::withCount('websites')->orderByDesc('websites_count')->first();

        $fastest = Category::all()
            ->map(fn (Category $category) => [
                'name' => $category->name,
                'change' => $this->change($category->websites()->getQuery()),
            ])
            ->sortByDesc('change')
            ->first();

        return [
            'topCategory' => $topCategory ? ['name' => $topCategory->name, 'count' => $topCategory->websites_count] : null,
            'topProduct' => $topProduct ? ['name' => $topProduct->name, 'count' => $topProduct->websites_count] : null,
            'fastestGrowth' => $fastest,
        ];
    }

    /**
     * Total count plus change in records created over the last 30 days vs the 30 days before.
     */
    private function metric(Builder|QueryBuilder $query): array
    {
        return [
            'value' => (clone $query)->count(),
            'change' => $this->change($query),
        ];
    }

    private function windowMetric(Builder $query): array
    {
        return [
            'value' => $this->windowCounts($query)['current'],
            'change' => $this->change($query),
        ];
    }

    private function change(Builder|QueryBuilder $query): int
    {
        $counts = $this->windowCounts($query);

        return $this->percent($counts['current'], $counts['previous']);
    }

    /**
     * @return array{current: int, previous: int}
     */
    private function windowCounts(Builder|QueryBuilder $query): array
    {
        $column = $query instanceof Builder ? $query->qualifyColumn('created_at') : 'created_at';

        return [
            'current' => (clone $query)->where($column, '>=', now()->subDays(30))->count(),
            'previous' => (clone $query)->whereBetween($column, [now()->subDays(60), now()->subDays(30)])->count(),
        ];
    }

    private function percent(int $current, int $previous): int
    {
        if ($previous === 0) {
            return $current > 0 ? 100 : 0;
        }

        return (int) round(($current - $previous) / $previous * 100);
    }
}
