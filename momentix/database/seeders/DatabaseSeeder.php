<?php

namespace Database\Seeders;

use App\Enums\ActivityLevel;
use App\Enums\OwnerStatus;
use App\Enums\WebsiteStatus;
use App\Models\ActivityLog;
use App\Models\Category;
use App\Models\Owner;
use App\Models\Product;
use App\Models\User;
use App\Models\Website;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $faker = fake();
        $faker->seed(2024);

        $admin = User::factory()->create([
            'name' => 'Super Admin',
            'email' => 'admin@momentix.com',
            'is_super_admin' => true,
        ]);

        $categories = collect([
            ['Business Services', 'violet'],
            ['Coaching & Education', 'sky'],
            ['Creative Agency', 'amber'],
            ['Health & Wellness', 'pink'],
            ['E-commerce', 'emerald'],
            ['Restaurants & Food', 'orange'],
        ])->map(fn ($c) => Category::create(['name' => $c[0], 'slug' => Str::slug($c[0]), 'color' => $c[1]]));

        $products = collect(['Analytics Pro', 'SEO Tools', 'Website Builder', 'Forms', 'Appointments', 'Payments', 'Growth Lab'])
            ->map(fn ($name) => Product::create(['name' => $name, 'slug' => Str::slug($name)]));

        $named = [
            ['BrightPath Coaching', 'brightpath.co', 'Sarah Chen', 'sarah@brightpath.co', 'Coaching & Education', WebsiteStatus::Published, ['Analytics Pro', 'SEO Tools', 'Forms']],
            ['Momentum Studio', 'momentumstudio.com', 'James Lee', 'james@momentumstudio.com', 'Creative Agency', WebsiteStatus::Draft, ['Website Builder', 'Forms']],
            ['GreenLeaf Wellness', 'greenleafwellness.com', 'Maria Patel', 'maria@greenleafwellness.com', 'Health & Wellness', WebsiteStatus::Suspended, ['Appointments', 'Payments', 'Analytics Pro', 'Forms']],
        ];

        // 48 websites: 32 published, 11 draft, 5 suspended.
        $statuses = [
            ...array_fill(0, 31, WebsiteStatus::Published),
            ...array_fill(0, 10, WebsiteStatus::Draft),
            ...array_fill(0, 4, WebsiteStatus::Suspended),
        ];
        shuffle($statuses);

        $rows = collect($named);
        foreach ($statuses as $status) {
            $company = $faker->unique()->company();
            $rows->push([
                $company,
                Str::slug($company).'.com',
                $faker->name(),
                $faker->unique()->safeEmail(),
                $categories->random()->name,
                $status,
                $products->random(rand(0, 2))->pluck('name')->all(),
            ]);
        }

        $rows->reverse()->values()->each(function ($row, $i) use ($categories, $products) {
            $created = now()->subDays(90 - (int) ($i * 1.8))->subMinutes(rand(0, 600));
            if ($i >= 45) {
                $created = now()->subHours(48 - $i);
            }

            $owner = Owner::create([
                'name' => $row[2],
                'email' => $row[3],
                'status' => OwnerStatus::Active,
                'invited_at' => $created,
                'created_at' => $created,
                'updated_at' => $created,
            ]);

            $website = Website::create([
                'name' => $row[0],
                'domain' => $row[1],
                'owner_id' => $owner->id,
                'category_id' => $categories->firstWhere('name', $row[4])->id,
                'status' => $row[5],
                'published_at' => $row[5] === WebsiteStatus::Published ? $created : null,
            ]);
            $updated = $i >= 45 ? now()->subMinutes([180, 60, 12][$i - 45]) : $created->copy()->addDays(rand(0, 3));
            $website->forceFill(['created_at' => $created, 'updated_at' => $updated])->saveQuietly();

            foreach ($products->whereIn('name', $row[6]) as $product) {
                $website->products()->attach($product->id, ['created_at' => $created, 'updated_at' => $created]);
            }
        });

        foreach (range(1, 7) as $i) {
            $invited = now()->subDays(rand(1, 40));
            Owner::create([
                'name' => $faker->name(),
                'email' => $faker->unique()->safeEmail(),
                'status' => OwnerStatus::Invited,
                'invited_at' => $invited,
                'created_at' => $invited,
                'updated_at' => $invited,
            ]);
        }

        $this->seedActivity($admin, $faker);
    }

    private function seedActivity(User $admin, $faker): void
    {
        $logs = [];
        $push = function (string $event, string $description, ?string $subject, $at, ActivityLevel $level = ActivityLevel::Info) use (&$logs, $admin) {
            $logs[] = [
                'user_id' => $admin->id,
                'event' => $event,
                'level' => $level->value,
                'description' => $description,
                'subject' => $subject,
                'ip_address' => '127.0.0.1',
                'created_at' => $at,
            ];
        };

        foreach (range(1, 60) as $day) {
            $push('backup.completed', 'Backup completed', 'Nightly backup', now()->subDays($day)->setTime(2, 0));
            foreach (range(1, rand(4, 12)) as $n) {
                $push('settings.viewed', 'Settings reviewed', null, now()->subDays($day)->subMinutes(rand(0, 1400)));
            }
        }
        foreach (range(1, 14) as $n) {
            $push('auth.login_failed', 'Failed login attempt', $faker->safeEmail(), now()->subDays(rand(0, 29)), ActivityLevel::Warning);
        }
        foreach (range(1, 18) as $n) {
            $push('auth.login_failed', 'Failed login attempt', $faker->safeEmail(), now()->subDays(rand(31, 59)), ActivityLevel::Warning);
        }
        foreach (range(1, 6) as $n) {
            $push('permission.changed', 'Permission changed', $faker->safeEmail(), now()->subDays(rand(1, 29)));
        }
        foreach (range(1, 4) as $n) {
            $push('permission.changed', 'Permission changed', $faker->safeEmail(), now()->subDays(rand(31, 59)));
        }
        $push('security.alert', 'Suspicious API usage', 'api.momentix.com', now()->subDays(9), ActivityLevel::Critical);
        $push('security.alert', 'Certificate expiring soon', 'greenleafwellness.com', now()->subDays(17), ActivityLevel::Critical);
        foreach (range(1, 4) as $n) {
            $push('security.alert', 'Security alert', null, now()->subDays(rand(31, 59)), ActivityLevel::Critical);
        }

        $push('backup.completed', 'Backup completed', 'Nightly backup', now()->subHours(6));
        $push('auth.login', 'Login from new device', 'admin@momentix.com', now()->subHours(4));
        $push('module.activated', 'Module activated', 'Analytics Pro → Growth Lab', now()->subHours(3));
        $push('website.published', 'Website published', 'Momentum Studio', now()->subHour());
        $push('owner.invited', 'Owner invited', 'sarah@brightpath.co', now()->subMinutes(28));
        $push('website.created', 'New website created', 'BrightPath Coaching', now()->subMinutes(12));

        foreach (array_chunk($logs, 200) as $chunk) {
            ActivityLog::insert($chunk);
        }
    }
}
