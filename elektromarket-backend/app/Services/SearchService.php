<?php

namespace App\Services;

use App\Models\Product;
use Elastic\Elasticsearch\Client;
use Elastic\Elasticsearch\ClientBuilder;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;

class SearchService
{
    protected ?Client $client = null;

    public function search(string $query, array $filters = [], int $perPage = 20): LengthAwarePaginator
    {
        if ($this->isElasticsearchAvailable()) {
            try {
                return $this->searchWithElasticsearch($query, $filters, $perPage);
            } catch (\Throwable $e) {
                Log::warning('Elasticsearch-Suche fehlgeschlagen, Fallback auf Datenbank.', [
                    'error' => $e->getMessage(),
                ]);
            }
        }

        return $this->searchWithDatabase($query, $filters, $perPage);
    }

    public function indexProduct(Product $product): void
    {
        if (! $this->isElasticsearchAvailable()) {
            return;
        }

        try {
            $this->getClient()->index([
                'index' => $this->getIndexName(),
                'id' => (string) $product->id,
                'body' => $this->productDocument($product),
            ]);
        } catch (\Throwable $e) {
            Log::warning('Produkt konnte nicht indexiert werden.', [
                'product_id' => $product->id,
                'error' => $e->getMessage(),
            ]);
        }
    }

    public function removeProduct(int $productId): void
    {
        if (! $this->isElasticsearchAvailable()) {
            return;
        }

        try {
            $this->getClient()->delete([
                'index' => $this->getIndexName(),
                'id' => (string) $productId,
            ]);
        } catch (\Throwable $e) {
            Log::warning('Produkt konnte nicht aus dem Index entfernt werden.', [
                'product_id' => $productId,
                'error' => $e->getMessage(),
            ]);
        }
    }

    protected function isElasticsearchAvailable(): bool
    {
        return (bool) config('services.elasticsearch.enabled', false)
            && ! empty(config('services.elasticsearch.host'));
    }

    protected function getClient(): Client
    {
        if ($this->client === null) {
            $this->client = ClientBuilder::create()
                ->setHosts([config('services.elasticsearch.host')])
                ->build();
        }

        return $this->client;
    }

    protected function getIndexName(): string
    {
        return config('services.elasticsearch.index', 'elektromarket_products');
    }

    protected function searchWithElasticsearch(string $query, array $filters, int $perPage): LengthAwarePaginator
    {
        $page = max(1, (int) request('page', 1));
        $from = ($page - 1) * $perPage;

        $must = [];
        if ($query !== '') {
            $must[] = [
                'multi_match' => [
                    'query' => $query,
                    'fields' => ['name^3', 'sku^2', 'short_description', 'description', 'brand_name', 'category_name'],
                    'fuzziness' => 'AUTO',
                ],
            ];
        }

        $filter = [['term' => ['is_active' => true]]];
        if (! empty($filters['category_id'])) {
            $filter[] = ['term' => ['category_id' => (int) $filters['category_id']]];
        }
        if (! empty($filters['brand_id'])) {
            $filter[] = ['term' => ['brand_id' => (int) $filters['brand_id']]];
        }
        if (! empty($filters['min_price'])) {
            $filter[] = ['range' => ['effective_price' => ['gte' => (float) $filters['min_price']]]];
        }
        if (! empty($filters['max_price'])) {
            $filter[] = ['range' => ['effective_price' => ['lte' => (float) $filters['max_price']]]];
        }

        $response = $this->getClient()->search([
            'index' => $this->getIndexName(),
            'body' => [
                'from' => $from,
                'size' => $perPage,
                'query' => [
                    'bool' => [
                        'must' => $must ?: [['match_all' => (object) []]],
                        'filter' => $filter,
                    ],
                ],
                'sort' => [
                    ['_score' => ['order' => 'desc']],
                ],
            ],
        ]);

        $hits = $response['hits']['hits'] ?? [];
        $total = $response['hits']['total']['value'] ?? 0;
        $ids = collect($hits)->pluck('_id')->map(fn ($id) => (int) $id);

        $products = Product::query()
            ->with(['brand', 'category', 'images'])
            ->whereIn('id', $ids)
            ->get()
            ->sortBy(fn ($product) => $ids->search($product->id))
            ->values();

        return new \Illuminate\Pagination\LengthAwarePaginator(
            $products,
            $total,
            $perPage,
            $page,
            ['path' => request()->url(), 'query' => request()->query()]
        );
    }

    protected function searchWithDatabase(string $query, array $filters, int $perPage): LengthAwarePaginator
    {
        return $this->buildDatabaseQuery($query, $filters)
            ->with(['brand', 'category', 'images'])
            ->paginate($perPage);
    }

    protected function buildDatabaseQuery(string $query, array $filters): Builder
    {
        $builder = Product::query()->active();

        if ($query !== '') {
            $builder->where(function (Builder $q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                    ->orWhere('sku', 'like', "%{$query}%")
                    ->orWhere('short_description', 'like', "%{$query}%")
                    ->orWhere('description', 'like', "%{$query}%")
                    ->orWhereHas('brand', fn (Builder $b) => $b->where('name', 'like', "%{$query}%"))
                    ->orWhereHas('category', fn (Builder $c) => $c->where('name', 'like', "%{$query}%"));
            });
        }

        if (! empty($filters['category_id'])) {
            $builder->where('category_id', $filters['category_id']);
        }

        if (! empty($filters['brand_id'])) {
            $builder->where('brand_id', $filters['brand_id']);
        }

        if (! empty($filters['min_price'])) {
            $builder->whereRaw('COALESCE(sale_price, price) >= ?', [(float) $filters['min_price']]);
        }

        if (! empty($filters['max_price'])) {
            $builder->whereRaw('COALESCE(sale_price, price) <= ?', [(float) $filters['max_price']]);
        }

        if (! empty($filters['energy_class'])) {
            $builder->where('energy_class', $filters['energy_class']);
        }

        if (! empty($filters['in_stock'])) {
            $builder->inStock();
        }

        $sort = $filters['sort'] ?? 'relevance';
        match ($sort) {
            'price_asc' => $builder->orderByRaw('COALESCE(sale_price, price) ASC'),
            'price_desc' => $builder->orderByRaw('COALESCE(sale_price, price) DESC'),
            'newest' => $builder->orderByDesc('created_at'),
            'rating' => $builder->orderByDesc('rating_avg'),
            default => $builder->orderByDesc('is_featured')->orderByDesc('sales_count'),
        };

        return $builder;
    }

    protected function productDocument(Product $product): array
    {
        $product->loadMissing(['brand', 'category']);

        return [
            'id' => $product->id,
            'name' => $product->name,
            'slug' => $product->slug,
            'sku' => $product->sku,
            'short_description' => $product->short_description,
            'description' => strip_tags($product->description),
            'price' => (float) $product->price,
            'sale_price' => $product->sale_price ? (float) $product->sale_price : null,
            'effective_price' => (float) $product->effective_price,
            'brand_id' => $product->brand_id,
            'brand_name' => $product->brand?->name,
            'category_id' => $product->category_id,
            'category_name' => $product->category?->name,
            'energy_class' => $product->energy_class,
            'is_active' => $product->is_active,
            'is_featured' => $product->is_featured,
            'rating_avg' => (float) $product->rating_avg,
        ];
    }

    public function suggest(string $query, int $limit = 5): Collection
    {
        return Product::query()
            ->active()
            ->where('name', 'like', "%{$query}%")
            ->limit($limit)
            ->pluck('name');
    }
}
