<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreCategoryRequest;
use App\Http\Requests\Admin\UpdateCategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class CategoryController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $categories = Category::query()
            ->with(['children', 'parent'])
            ->withCount('products')
            ->when($request->search, fn ($q, $s) => $q->where('name', 'like', "%{$s}%"))
            ->orderBy('sort_order')
            ->paginate((int) $request->input('per_page', 50));

        return CategoryResource::collection($categories);
    }

    public function show(Category $category): CategoryResource
    {
        $category->load(['children', 'parent'])->loadCount('products');

        return new CategoryResource($category);
    }

    public function store(StoreCategoryRequest $request): JsonResponse
    {
        $category = Category::query()->create($request->validated());

        return response()->json([
            'message' => 'Kategorie erfolgreich erstellt.',
            'category' => new CategoryResource($category),
        ], 201);
    }

    public function update(UpdateCategoryRequest $request, Category $category): JsonResponse
    {
        if ($request->parent_id == $category->id) {
            return response()->json(['message' => 'Eine Kategorie kann nicht ihr eigenes Elternelement sein.'], 422);
        }

        $category->update($request->validated());

        return response()->json([
            'message' => 'Kategorie erfolgreich aktualisiert.',
            'category' => new CategoryResource($category->fresh()->load(['children', 'parent'])),
        ]);
    }

    public function destroy(Category $category): JsonResponse
    {
        if ($category->products()->exists()) {
            return response()->json([
                'message' => 'Kategorie kann nicht gelöscht werden, da Produkte zugeordnet sind.',
            ], 422);
        }

        $category->delete();

        return response()->json(['message' => 'Kategorie erfolgreich gelöscht.']);
    }
}
