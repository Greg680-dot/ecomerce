<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductDetailResource;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Services\SearchService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ProductController extends Controller
{
    public function __construct(protected SearchService $searchService) {}

    public function index(Request $request): AnonymousResourceCollection
    {
        $filters = $request->only(['category_id', 'brand_id', 'min_price', 'max_price', 'energy_class', 'in_stock', 'sort']);
        $query = $request->input('q', '');

        if ($query || ! empty(array_filter($filters))) {
            $products = $this->searchService->search($query, $filters, (int) $request->input('per_page', 20));

            return ProductResource::collection($products);
        }

        $products = Product::query()
            ->active()
            ->with(['brand', 'category', 'images'])
            ->when($request->category_id, fn ($q) => $q->where('category_id', $request->category_id))
            ->when($request->brand_id, fn ($q) => $q->where('brand_id', $request->brand_id))
            ->orderByDesc('created_at')
            ->paginate((int) $request->input('per_page', 20));

        return ProductResource::collection($products);
    }

    public function show(string $slug): ProductDetailResource|JsonResponse
    {
        $product = Product::query()
            ->active()
            ->where('slug', $slug)
            ->with(['brand', 'category', 'subcategory', 'images', 'specifications', 'approvedReviews.user', 'questions.user'])
            ->first();

        if (! $product) {
            return response()->json(['message' => 'Produkt nicht gefunden.'], 404);
        }

        $product->increment('views_count');

        return new ProductDetailResource($product);
    }

    public function search(Request $request): AnonymousResourceCollection
    {
        $filters = $request->only(['category_id', 'brand_id', 'min_price', 'max_price', 'energy_class', 'in_stock', 'sort']);
        $products = $this->searchService->search(
            $request->input('q', ''),
            $filters,
            (int) $request->input('per_page', 20)
        );

        return ProductResource::collection($products);
    }

    public function featured(Request $request): AnonymousResourceCollection
    {
        $products = Product::query()
            ->active()
            ->featured()
            ->with(['brand', 'category', 'images'])
            ->orderByDesc('sales_count')
            ->paginate((int) $request->input('per_page', 12));

        return ProductResource::collection($products);
    }

    public function newArrivals(Request $request): AnonymousResourceCollection
    {
        $products = Product::query()
            ->active()
            ->newArrivals()
            ->with(['brand', 'category', 'images'])
            ->orderByDesc('created_at')
            ->paginate((int) $request->input('per_page', 12));

        return ProductResource::collection($products);
    }

    public function promotions(Request $request): AnonymousResourceCollection
    {
        $products = Product::query()
            ->active()
            ->onPromotion()
            ->with(['brand', 'category', 'images'])
            ->orderByDesc('created_at')
            ->paginate((int) $request->input('per_page', 12));

        return ProductResource::collection($products);
    }

    public function compare(Request $request): JsonResponse
    {
        $request->validate([
            'ids' => ['required', 'array', 'min:2', 'max:4'],
            'ids.*' => ['integer', 'exists:products,id'],
        ], [
            'ids.required' => 'Bitte wählen Sie mindestens 2 Produkte zum Vergleich.',
            'ids.min' => 'Mindestens 2 Produkte erforderlich.',
            'ids.max' => 'Maximal 4 Produkte können verglichen werden.',
        ]);

        $products = Product::query()
            ->active()
            ->whereIn('id', $request->ids)
            ->with(['brand', 'category', 'images', 'specifications'])
            ->get();

        return response()->json([
            'products' => ProductDetailResource::collection($products),
        ]);
    }
}
