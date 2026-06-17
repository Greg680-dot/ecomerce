<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateStockRequest;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StockController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $products = Product::query()
            ->with(['brand:id,name', 'category:id,name'])
            ->when($request->search, fn ($q, $s) => $q->where('name', 'like', "%{$s}%")->orWhere('sku', 'like', "%{$s}%"))
            ->when($request->boolean('low_stock'), fn ($q) => $q->where('stock', '<', 10))
            ->when($request->boolean('out_of_stock'), fn ($q) => $q->where('stock', 0))
            ->orderBy('stock')
            ->paginate((int) $request->input('per_page', 20));

        return response()->json([
            'data' => $products->map(fn (Product $p) => [
                'id' => $p->id,
                'name' => $p->name,
                'sku' => $p->sku,
                'stock' => $p->stock,
                'brand' => $p->brand?->name,
                'category' => $p->category?->name,
                'is_active' => $p->is_active,
            ]),
            'meta' => [
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'total' => $products->total(),
            ],
        ]);
    }

    public function update(UpdateStockRequest $request, Product $product): JsonResponse
    {
        $product->update(['stock' => $request->stock]);

        return response()->json([
            'message' => 'Lagerbestand erfolgreich aktualisiert.',
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'sku' => $product->sku,
                'stock' => $product->stock,
            ],
        ]);
    }

    public function bulkUpdate(Request $request): JsonResponse
    {
        $request->validate([
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'integer', 'exists:products,id'],
            'items.*.stock' => ['required', 'integer', 'min:0'],
        ], [
            'items.required' => 'Bitte geben Sie mindestens ein Produkt an.',
        ]);

        $updated = 0;
        foreach ($request->items as $item) {
            Product::query()->where('id', $item['product_id'])->update(['stock' => $item['stock']]);
            $updated++;
        }

        return response()->json([
            'message' => "Lagerbestand für {$updated} Produkte aktualisiert.",
            'updated' => $updated,
        ]);
    }
}
