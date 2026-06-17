<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Cart\AddCartItemRequest;
use App\Http\Requests\Cart\UpdateCartItemRequest;
use App\Http\Resources\ProductResource;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $items = CartItem::query()
            ->where('user_id', $request->user()->id)
            ->with(['product.brand', 'product.category', 'product.images'])
            ->get();

        $subtotal = $items->sum(fn (CartItem $item) => $item->subtotal);

        return response()->json([
            'items' => $items->map(fn (CartItem $item) => [
                'id' => $item->id,
                'quantity' => $item->quantity,
                'subtotal' => $item->subtotal,
                'product' => new ProductResource($item->product),
            ]),
            'subtotal' => round($subtotal, 2),
            'items_count' => $items->sum('quantity'),
        ]);
    }

    public function store(AddCartItemRequest $request): JsonResponse
    {
        $product = Product::query()->active()->findOrFail($request->product_id);

        if ($product->stock < $request->quantity) {
            return response()->json([
                'message' => 'Nicht genügend Lagerbestand verfügbar.',
            ], 422);
        }

        $item = CartItem::query()->updateOrCreate(
            ['user_id' => $request->user()->id, 'product_id' => $product->id],
            ['quantity' => $request->quantity, 'session_id' => null]
        );

        return response()->json([
            'message' => 'Produkt zum Warenkorb hinzugefügt.',
            'item' => [
                'id' => $item->id,
                'quantity' => $item->quantity,
                'product_id' => $item->product_id,
            ],
        ], 201);
    }

    public function update(UpdateCartItemRequest $request, CartItem $cartItem): JsonResponse
    {
        if ($cartItem->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Zugriff verweigert.'], 403);
        }

        if ($cartItem->product->stock < $request->quantity) {
            return response()->json([
                'message' => 'Nicht genügend Lagerbestand verfügbar.',
            ], 422);
        }

        $cartItem->update(['quantity' => $request->quantity]);

        return response()->json([
            'message' => 'Warenkorb aktualisiert.',
            'item' => [
                'id' => $cartItem->id,
                'quantity' => $cartItem->quantity,
            ],
        ]);
    }

    public function destroy(Request $request, CartItem $cartItem): JsonResponse
    {
        if ($cartItem->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Zugriff verweigert.'], 403);
        }

        $cartItem->delete();

        return response()->json(['message' => 'Artikel aus dem Warenkorb entfernt.']);
    }

    public function clear(Request $request): JsonResponse
    {
        CartItem::query()->where('user_id', $request->user()->id)->delete();

        return response()->json(['message' => 'Warenkorb geleert.']);
    }
}
