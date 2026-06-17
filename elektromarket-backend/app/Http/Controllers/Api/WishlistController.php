<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Models\Wishlist;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $items = Wishlist::query()
            ->where('user_id', $request->user()->id)
            ->with(['product.brand', 'product.category', 'product.images'])
            ->latest()
            ->get();

        return response()->json([
            'items' => $items->map(fn (Wishlist $item) => [
                'id' => $item->id,
                'product' => new ProductResource($item->product),
                'added_at' => $item->created_at?->toIso8601String(),
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

        $item = Wishlist::query()->firstOrCreate([
            'user_id' => $request->user()->id,
            'product_id' => $request->product_id,
        ]);

        return response()->json([
            'message' => 'Produkt zur Wunschliste hinzugefügt.',
            'item' => ['id' => $item->id, 'product_id' => $item->product_id],
        ], 201);
    }

    public function destroy(Request $request, Wishlist $wishlist): JsonResponse
    {
        if ($wishlist->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Zugriff verweigert.'], 403);
        }

        $wishlist->delete();

        return response()->json(['message' => 'Produkt von der Wunschliste entfernt.']);
    }
}
