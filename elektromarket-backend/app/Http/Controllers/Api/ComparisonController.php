<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Models\ProductComparison;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ComparisonController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $items = ProductComparison::query()
            ->where('user_id', $request->user()->id)
            ->with(['product.brand', 'product.category', 'product.images', 'product.specifications'])
            ->latest()
            ->limit(4)
            ->get();

        return response()->json([
            'items' => $items->map(fn (ProductComparison $item) => [
                'id' => $item->id,
                'product' => new ProductResource($item->product),
            ]),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'product_id' => ['required', 'integer', 'exists:products,id'],
        ], [
            'product_id.required' => 'Bitte wählen Sie ein Produkt aus.',
        ]);

        Product::query()->active()->findOrFail($request->product_id);

        $count = ProductComparison::query()->where('user_id', $request->user()->id)->count();
        if ($count >= 4) {
            return response()->json([
                'message' => 'Maximal 4 Produkte können verglichen werden.',
            ], 422);
        }

        $item = ProductComparison::query()->firstOrCreate([
            'user_id' => $request->user()->id,
            'product_id' => $request->product_id,
        ]);

        return response()->json([
            'message' => 'Produkt zum Vergleich hinzugefügt.',
            'item' => ['id' => $item->id, 'product_id' => $item->product_id],
        ], 201);
    }

    public function destroy(Request $request, ProductComparison $comparison): JsonResponse
    {
        if ($comparison->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Zugriff verweigert.'], 403);
        }

        $comparison->delete();

        return response()->json(['message' => 'Produkt aus dem Vergleich entfernt.']);
    }

    public function clear(Request $request): JsonResponse
    {
        ProductComparison::query()->where('user_id', $request->user()->id)->delete();

        return response()->json(['message' => 'Vergleichsliste geleert.']);
    }
}
