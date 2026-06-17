<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Review\StoreReviewRequest;
use App\Http\Resources\ReviewResource;
use App\Models\Product;
use App\Models\ProductReview;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ReviewController extends Controller
{
    public function index(Request $request, int $productId): AnonymousResourceCollection|JsonResponse
    {
        $product = Product::query()->active()->find($productId);
        if (! $product) {
            return response()->json(['message' => 'Produkt nicht gefunden.'], 404);
        }

        $reviews = ProductReview::query()
            ->where('product_id', $productId)
            ->where('is_approved', true)
            ->with('user')
            ->latest()
            ->paginate((int) $request->input('per_page', 10));

        return ReviewResource::collection($reviews);
    }

    public function store(StoreReviewRequest $request): JsonResponse
    {
        $existing = ProductReview::query()
            ->where('user_id', $request->user()->id)
            ->where('product_id', $request->product_id)
            ->exists();

        if ($existing) {
            return response()->json([
                'message' => 'Sie haben dieses Produkt bereits bewertet.',
            ], 422);
        }

        $review = ProductReview::query()->create([
            ...$request->validated(),
            'user_id' => $request->user()->id,
            'is_approved' => false,
        ]);

        return response()->json([
            'message' => 'Bewertung eingereicht und wartet auf Freigabe.',
            'review' => new ReviewResource($review),
        ], 201);
    }
}
