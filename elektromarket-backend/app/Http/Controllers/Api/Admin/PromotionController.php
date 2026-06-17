<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StorePromotionRequest;
use App\Http\Requests\Admin\UpdatePromotionRequest;
use App\Models\Promotion;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PromotionController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $promotions = Promotion::query()
            ->withCount('products')
            ->when($request->search, fn ($q, $s) => $q->where('name', 'like', "%{$s}%")->orWhere('code', 'like', "%{$s}%"))
            ->when($request->has('is_active'), fn ($q) => $q->where('is_active', $request->boolean('is_active')))
            ->latest()
            ->paginate((int) $request->input('per_page', 20));

        return response()->json(['data' => $promotions]);
    }

    public function show(Promotion $promotion): JsonResponse
    {
        $promotion->load('products:id,name,slug');

        return response()->json(['promotion' => $promotion]);
    }

    public function store(StorePromotionRequest $request): JsonResponse
    {
        $data = $request->validated();
        $productIds = $data['product_ids'] ?? [];
        unset($data['product_ids']);

        $promotion = Promotion::query()->create($data);

        if ($productIds) {
            $promotion->products()->sync($productIds);
        }

        return response()->json([
            'message' => 'Aktion erfolgreich erstellt.',
            'promotion' => $promotion->load('products'),
        ], 201);
    }

    public function update(UpdatePromotionRequest $request, Promotion $promotion): JsonResponse
    {
        $data = $request->validated();
        $productIds = $data['product_ids'] ?? null;
        unset($data['product_ids']);

        $promotion->update($data);

        if ($productIds !== null) {
            $promotion->products()->sync($productIds);
        }

        return response()->json([
            'message' => 'Aktion erfolgreich aktualisiert.',
            'promotion' => $promotion->fresh()->load('products'),
        ]);
    }

    public function destroy(Promotion $promotion): JsonResponse
    {
        $promotion->products()->detach();
        $promotion->delete();

        return response()->json(['message' => 'Aktion erfolgreich gelöscht.']);
    }
}
