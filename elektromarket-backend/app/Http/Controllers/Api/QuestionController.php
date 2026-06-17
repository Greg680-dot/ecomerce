<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Question\StoreQuestionRequest;
use App\Models\Product;
use App\Models\ProductQuestion;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class QuestionController extends Controller
{
    public function index(Request $request, int $productId): JsonResponse
    {
        $product = Product::query()->active()->find($productId);
        if (! $product) {
            return response()->json(['message' => 'Produkt nicht gefunden.'], 404);
        }

        $questions = ProductQuestion::query()
            ->where('product_id', $productId)
            ->where('is_public', true)
            ->with('user:id,name')
            ->latest()
            ->paginate((int) $request->input('per_page', 10));

        return response()->json([
            'data' => $questions->map(fn (ProductQuestion $q) => [
                'id' => $q->id,
                'question' => $q->question,
                'answer' => $q->answer,
                'answered_at' => $q->answered_at?->toIso8601String(),
                'user' => ['id' => $q->user->id, 'name' => $q->user->name],
            ]),
            'meta' => [
                'current_page' => $questions->currentPage(),
                'last_page' => $questions->lastPage(),
                'total' => $questions->total(),
            ],
        ]);
    }

    public function store(StoreQuestionRequest $request): JsonResponse
    {
        $question = ProductQuestion::query()->create([
            ...$request->validated(),
            'user_id' => $request->user()->id,
        ]);

        return response()->json([
            'message' => 'Frage erfolgreich eingereicht.',
            'question' => [
                'id' => $question->id,
                'question' => $question->question,
                'created_at' => $question->created_at?->toIso8601String(),
            ],
        ], 201);
    }
}
