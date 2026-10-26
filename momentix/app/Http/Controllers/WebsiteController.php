<?php

namespace App\Http\Controllers;

use App\Enums\WebsiteStatus;
use App\Http\Requests\WebsiteRequest;
use App\Models\ActivityLog;
use App\Models\Category;
use App\Models\Owner;
use App\Models\Product;
use App\Models\Website;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class WebsiteController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = $request->only('search', 'category', 'status');
        $websites = self::query($filters)->latest('updated_at')->paginate(15)->withQueryString();

        return Inertia::render('Websites/Index', [
            'websites' => $websites->setCollection(collect(self::present($websites->getCollection()))),
            'categories' => Category::orderBy('name')->get(['id', 'name']),
            'filters' => $filters,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Websites/Form', $this->formOptions());
    }

    public function store(WebsiteRequest $request): RedirectResponse
    {
        $website = DB::transaction(function () use ($request) {
            $website = Website::create($this->attributes($request));
            $website->products()->sync($request->validated('product_ids', []));

            return $website;
        });

        ActivityLog::record('website.created', 'New website created', $website->name);

        return redirect()->route('websites.index')->with('success', "Website {$website->name} created.");
    }

    public function edit(Website $website): Response
    {
        return Inertia::render('Websites/Form', [
            ...$this->formOptions(),
            'website' => [
                ...$website->only('id', 'name', 'domain', 'owner_id', 'category_id'),
                'status' => $website->status->value,
                'product_ids' => $website->products()->pluck('products.id'),
            ],
        ]);
    }

    public function update(WebsiteRequest $request, Website $website): RedirectResponse
    {
        $wasPublished = $website->status === WebsiteStatus::Published;

        DB::transaction(function () use ($request, $website) {
            $website->update($this->attributes($request, $website));
            $website->products()->sync($request->validated('product_ids', []));
        });

        $nowPublished = $website->status === WebsiteStatus::Published;
        ActivityLog::record(
            ! $wasPublished && $nowPublished ? 'website.published' : 'website.updated',
            ! $wasPublished && $nowPublished ? 'Website published' : 'Website updated',
            $website->name,
        );

        return redirect()->route('websites.index')->with('success', "Website {$website->name} updated.");
    }

    public function destroy(Website $website): RedirectResponse
    {
        $website->delete();
        ActivityLog::record('website.deleted', 'Website deleted', $website->name);

        return back()->with('success', "Website {$website->name} deleted.");
    }

    public function export(Request $request): StreamedResponse
    {
        $query = self::query($request->only('search', 'category', 'status'))->latest('updated_at');

        return response()->streamDownload(function () use ($query) {
            $out = fopen('php://output', 'w');
            fputcsv($out, ['Website', 'Domain', 'Owner', 'Owner Email', 'Category', 'Status', 'Products', 'Last Updated']);
            $query->chunk(200, function (Collection $websites) use ($out) {
                foreach ($websites as $website) {
                    fputcsv($out, [
                        $website->name,
                        $website->domain,
                        $website->owner->name,
                        $website->owner->email,
                        $website->category->name,
                        $website->status->label(),
                        $website->products->pluck('name')->implode(', '),
                        $website->updated_at->toDateTimeString(),
                    ]);
                }
            });
            fclose($out);
        }, 'websites-'.now()->format('Y-m-d').'.csv', ['Content-Type' => 'text/csv']);
    }

    /**
     * @param  array{search?: ?string, category?: ?string, status?: ?string}  $filters
     */
    public static function query(array $filters): Builder
    {
        return Website::query()->with(['owner:id,name,email', 'category:id,name,color', 'products:id,name'])->filter($filters);
    }

    public static function present(Collection $websites): array
    {
        return $websites->map(fn (Website $website) => [
            'id' => $website->id,
            'name' => $website->name,
            'domain' => $website->domain,
            'status' => $website->status->value,
            'owner' => $website->owner->only('name', 'email'),
            'category' => $website->category->only('name', 'color'),
            'products' => $website->products->pluck('name'),
            'updated_human' => $website->updated_at->diffForHumans(),
            'updated_at' => $website->updated_at->format('M j, Y, g:i A'),
        ])->all();
    }

    private function formOptions(): array
    {
        return [
            'owners' => Owner::orderBy('name')->get(['id', 'name', 'email']),
            'categories' => Category::orderBy('name')->get(['id', 'name']),
            'products' => Product::orderBy('name')->get(['id', 'name']),
            'statuses' => collect(WebsiteStatus::cases())->map(fn ($s) => ['value' => $s->value, 'label' => $s->label()]),
        ];
    }

    private function attributes(WebsiteRequest $request, ?Website $website = null): array
    {
        $data = collect($request->validated())->except('product_ids')->all();
        $publishing = $data['status'] === WebsiteStatus::Published->value;

        $data['published_at'] = $publishing ? ($website?->published_at ?? now()) : $website?->published_at;

        return $data;
    }
}
