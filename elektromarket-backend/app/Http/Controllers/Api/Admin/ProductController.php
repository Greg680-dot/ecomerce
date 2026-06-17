<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreProductRequest;
use App\Http\Requests\Admin\UpdateProductRequest;
use App\Http\Resources\ProductDetailResource;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductSpecification;
use App\Services\ImageUploadService;
use App\Services\SearchService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ProductController extends Controller
{
    public function __construct(
        protected SearchService $searchService,
        protected ImageUploadService $imageUploadService,
    ) {}

    public function index(Request $request): AnonymousResourceCollection
    {
        $products = Product::query()
            ->withTrashed()
            ->with(['brand', 'category', 'images'])
            ->when($request->search, fn ($q, $s) => $q->where('name', 'like', "%{$s}%")->orWhere('sku', 'like', "%{$s}%"))
            ->when($request->has('is_active'), fn ($q) => $q->where('is_active', $request->boolean('is_active')))
            ->when($request->category_id, fn ($q, $id) => $q->where('category_id', $id))
            ->when($request->brand_id, fn ($q, $id) => $q->where('brand_id', $id))
            ->latest()
            ->paginate((int) $request->input('per_page', 20));

        return ProductResource::collection($products);
    }

    public function show(Product $product): ProductDetailResource
    {
        $product->load(['brand', 'category', 'subcategory', 'images', 'specifications']);

        return new ProductDetailResource($product);
    }

    public function store(StoreProductRequest $request): JsonResponse
    {
        $product = Product::query()->create($request->validated());
        $this->searchService->indexProduct($product);

        return response()->json([
            'message' => 'Produkt erfolgreich erstellt.',
            'product' => new ProductDetailResource($product->load(['brand', 'category', 'images'])),
        ], 201);
    }

    public function update(UpdateProductRequest $request, Product $product): JsonResponse
    {
        $product->update($request->validated());
        $this->searchService->indexProduct($product->fresh());

        return response()->json([
            'message' => 'Produkt erfolgreich aktualisiert.',
            'product' => new ProductDetailResource($product->fresh()->load(['brand', 'category', 'images', 'specifications'])),
        ]);
    }

    public function destroy(Product $product): JsonResponse
    {
        $product->delete();
        $this->searchService->removeProduct($product->id);

        return response()->json(['message' => 'Produkt erfolgreich gelöscht.']);
    }

    public function uploadImages(Request $request, Product $product): JsonResponse
    {
        $request->validate([
            'images' => ['required', 'array', 'min:1'],
            'images.*' => ['image', 'max:5120'],
        ], [
            'images.required' => 'Bitte wählen Sie mindestens ein Bild aus.',
            'images.*.image' => 'Die Datei muss ein Bild sein.',
            'images.*.max' => 'Das Bild darf maximal 5 MB groß sein.',
        ]);

        $uploaded = [];
        foreach ($request->file('images') as $index => $file) {
            $path = $this->imageUploadService->upload($file, 'products');
            $image = ProductImage::query()->create([
                'product_id' => $product->id,
                'path' => $path,
                'alt' => $product->name,
                'is_primary' => $product->images()->count() === 0 && $index === 0,
                'sort_order' => $product->images()->count() + $index,
            ]);
            $uploaded[] = $image;
        }

        return response()->json([
            'message' => 'Bilder erfolgreich hochgeladen.',
            'images' => $uploaded,
        ]);
    }

    public function syncSpecifications(Request $request, Product $product): JsonResponse
    {
        $request->validate([
            'specifications' => ['required', 'array'],
            'specifications.*.group' => ['nullable', 'string', 'max:100'],
            'specifications.*.key' => ['required', 'string', 'max:255'],
            'specifications.*.value' => ['required', 'string', 'max:500'],
        ]);

        $product->specifications()->delete();

        foreach ($request->specifications as $index => $spec) {
            ProductSpecification::query()->create([
                'product_id' => $product->id,
                'group' => $spec['group'] ?? 'general',
                'key' => $spec['key'],
                'value' => $spec['value'],
                'sort_order' => $index,
            ]);
        }

        return response()->json([
            'message' => 'Spezifikationen erfolgreich aktualisiert.',
            'specifications' => $product->fresh()->specifications,
        ]);
    }
}
