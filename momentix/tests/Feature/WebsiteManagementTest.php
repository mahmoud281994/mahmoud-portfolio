<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Owner;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class WebsiteManagementTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();
    }

    public function test_guests_and_non_super_admins_are_blocked(): void
    {
        $this->get('/')->assertRedirect('/login');

        $this->actingAs(User::factory()->create())
            ->get('/')->assertForbidden();
        $this->post('/websites', [])->assertForbidden();
    }

    public function test_super_admin_sees_dashboard_and_creates_website(): void
    {
        $admin = User::factory()->create(['is_super_admin' => true]);
        $owner = Owner::create(['name' => 'Sarah Chen', 'email' => 'sarah@brightpath.co', 'status' => 'active']);
        $category = Category::create(['name' => 'Coaching', 'slug' => 'coaching']);
        $product = Product::create(['name' => 'Analytics Pro', 'slug' => 'analytics-pro']);

        $this->actingAs($admin)
            ->post('/websites', [
                'name' => 'BrightPath Coaching',
                'domain' => 'BrightPath.co',
                'owner_id' => $owner->id,
                'category_id' => $category->id,
                'status' => 'published',
                'product_ids' => [$product->id],
            ])
            ->assertRedirect('/websites');

        $this->assertDatabaseHas('websites', ['domain' => 'brightpath.co', 'status' => 'published']);
        $this->assertDatabaseHas('activity_logs', ['event' => 'website.created', 'subject' => 'BrightPath Coaching']);

        $this->get('/')->assertInertia(fn (Assert $page) => $page
            ->component('Dashboard')
            ->where('stats.total.value', 1)
            ->where('stats.published.value', 1)
            ->where('stats.activeProducts.value', 1)
            ->has('websites', 1)
            ->where('websites.0.products.0', 'Analytics Pro'));
    }
}
