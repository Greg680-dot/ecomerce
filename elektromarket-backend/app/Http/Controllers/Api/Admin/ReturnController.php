<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateReturnRequest;
use App\Models\ReturnModel;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReturnController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $returns = ReturnModel::query()
            ->with(['order:id,order_number,total', 'user:id,name,email', 'items.orderItem'])
            ->when($request->status, fn ($q, $s) => $q->where('status', $s))
            ->when($request->search, fn ($q, $s) => $q->where('return_number', 'like', "%{$s}%"))
            ->latest()
            ->paginate((int) $request->input('per_page', 20));

        return response()->json(['data' => $returns]);
    }

    public function show(ReturnModel $return): JsonResponse
    {
        $return->load(['order.items', 'user', 'items.orderItem']);

        return response()->json(['return' => $return]);
    }

    public function update(UpdateReturnRequest $request, ReturnModel $return): JsonResponse
    {
        $data = $request->validated();

        if (isset($data['status']) && in_array($data['status'], ['refunded', 'rejected'])) {
            $data['resolved_at'] = now();
        }

        $return->update($data);

        return response()->json([
            'message' => 'Retoure erfolgreich aktualisiert.',
            'return' => $return->fresh()->load(['order', 'user', 'items']),
        ]);
    }
}
