<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\ReviewResource;
use App\Models\Product;
use App\Models\ProductReview;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ReviewController extends Controller
{
    public function __construct(protected NotificationService $notificationService) {}

    public function index(Request $request): AnonymousResourceCollection
    {
        $reviews = ProductReview::query()
            ->with(['user', 'product:id,name,slug'])
            ->when($request->has('is_approved'), fn ($q) => $q->where('is_approved', $request->boolean('is_approved')))
            ->when($request->product_id, fn ($q, $id) => $q->where('product_id', $id))
            ->latest()
            ->paginate((int) $request->input('per_page', 20));

        return ReviewResource::collection($reviews);
    }

    public function approve(ProductReview $review): JsonResponse
    {
        $review->update(['is_approved' => true]);
        $this->updateProductRating($review->product_id);

        if ($review->user) {
            $this->notificationService->notifyReviewApproved($review->user, $review);
        }

        return response()->json([
            'message' => 'Bewertung freigegeben.',
            'review' => new ReviewResource($review->fresh()->load('user')),
        ]);
    }

    public function reject(ProductReview $review): JsonResponse
    {
        $productId = $review->product_id;
        $review->delete();
        $this->updateProductRating($productId);

        return response()->json(['message' => 'Bewertung abgelehnt und gelöscht.']);
    }

    public function destroy(ProductReview $review): JsonResponse
    {
        $productId = $review->product_id;
        $review->delete();
        $this->updateProductRating($productId);

        return response()->json(['message' => 'Bewertung gelöscht.']);
    }

    protected function updateProductRating(int $productId): void
    {
        $stats = ProductReview::query()
            ->where('product_id', $productId)
            ->where('is_approved', true)
            ->selectRaw('AVG(rating) as avg_rating, COUNT(*) as count')
            ->first();

        Product::query()->where('id', $productId)->update([
            'rating_avg' => round((float) ($stats->avg_rating ?? 0), 2),
            'rating_count' => (int) ($stats->count ?? 0),
        ]);
    }
}
