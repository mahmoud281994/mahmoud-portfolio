<?php

namespace App\Services;

use App\Models\ActivityLog;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class SystemHealthService
{
    public const SCHEDULER_HEARTBEAT = 'health.scheduler_heartbeat';

    public const MAIL_LAST_SENT = 'health.mail_last_sent';

    /**
     * @return list<array{key: string, name: string, healthy: bool, detail: string}>
     */
    public function checks(): array
    {
        return [
            $this->queue(),
            $this->mail(),
            $this->storage(),
            $this->scheduler(),
            $this->backups(),
        ];
    }

    public function allHealthy(): bool
    {
        return collect($this->checks())->every('healthy');
    }

    private function queue(): array
    {
        $pending = DB::table('jobs')->count();
        $failed = DB::table('failed_jobs')->where('failed_at', '>=', now()->subHour())->count();

        return $this->check('queue', 'Job Queue', $failed === 0, $failed > 0
            ? "{$failed} jobs failed in the last hour"
            : "{$pending} jobs pending");
    }

    private function mail(): array
    {
        $lastSent = Cache::get(self::MAIL_LAST_SENT);

        return $this->check('mail', 'Mail Service', filled(config('mail.default')), $lastSent
            ? 'Last sent '.Carbon::parse($lastSent)->diffForHumans()
            : 'No mail sent yet');
    }

    private function storage(): array
    {
        $total = @disk_total_space(storage_path()) ?: 0;
        $free = @disk_free_space(storage_path()) ?: 0;
        $used = $total - $free;
        $percent = $total > 0 ? (int) round($used / $total * 100) : 0;

        return $this->check('storage', 'Storage', $total > 0 && $percent < 90,
            sprintf('%d%% used (%d GB)', $percent, round($used / 1024 ** 3)));
    }

    private function scheduler(): array
    {
        $heartbeat = Cache::get(self::SCHEDULER_HEARTBEAT);
        $healthy = $heartbeat && Carbon::parse($heartbeat)->gt(now()->subMinutes(5));

        return $this->check('scheduler', 'Scheduler', (bool) $healthy, $healthy ? 'All tasks running' : 'No heartbeat in 5 minutes');
    }

    private function backups(): array
    {
        $last = ActivityLog::where('event', 'backup.completed')->latest('created_at')->value('created_at');
        $healthy = $last && Carbon::parse($last)->gt(now()->subDay());

        return $this->check('backups', 'Backups', (bool) $healthy, $last
            ? 'Last backup '.Carbon::parse($last)->diffForHumans()
            : 'No backups recorded');
    }

    private function check(string $key, string $name, bool $healthy, string $detail): array
    {
        return compact('key', 'name', 'healthy', 'detail');
    }
}
