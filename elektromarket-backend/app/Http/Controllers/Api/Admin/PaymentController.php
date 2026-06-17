<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Services\PaymentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function __construct(protected PaymentService $paymentService) {}

    public function index(Request $request): JsonResponse
    {
        $payments = Payment::query()
            ->with(['order:id,order_number,total', 'user:id,name,email'])
            ->when($request->status, fn ($q, $s) => $q->where('status', $s))
            ->when($request->method, fn ($q, $m) => $q->where('method', $m))
            ->latest()
            ->paginate((int) $request->input('per_page', 20));

        return response()->json([
            'data' => $payments->map(fn (Payment $p) => [
                'id' => $p->id,
                'method' => $p->method?->value,
                'status' => $p->status,
                'amount' => $p->amount,
                'currency' => $p->currency,
                'transaction_id' => $p->transaction_id,
                'order' => $p->order?->only(['id', 'order_number', 'total']),
                'user' => $p->user?->only(['id', 'name', 'email']),
                'created_at' => $p->created_at?->toIso8601String(),
            ]),
            'meta' => [
                'current_page' => $payments->currentPage(),
                'last_page' => $payments->lastPage(),
                'total' => $payments->total(),
            ],
        ]);
    }

    public function show(Payment $payment): JsonResponse
    {
        $payment->load(['order.items', 'user']);

        return response()->json([
            'payment' => [
                'id' => $payment->id,
                'method' => $payment->method?->value,
                'status' => $payment->status,
                'amount' => $payment->amount,
                'currency' => $payment->currency,
                'transaction_id' => $payment->transaction_id,
                'metadata' => $payment->metadata,
                'order' => $payment->order,
                'user' => $payment->user?->only(['id', 'name', 'email']),
                'created_at' => $payment->created_at?->toIso8601String(),
            ],
        ]);
    }

    public function refund(Request $request, Payment $payment): JsonResponse
    {
        if ($payment->status !== 'completed') {
            return response()->json(['message' => 'Nur abgeschlossene Zahlungen können erstattet werden.'], 422);
        }

        $request->validate([
            'amount' => ['nullable', 'numeric', 'min:0.01', 'max:'.$payment->amount],
        ]);

        try {
            $refunded = $this->paymentService->refund($payment, $request->amount);
            $payment->order?->update(['payment_status' => 'refunded']);

            return response()->json([
                'message' => 'Erstattung erfolgreich verarbeitet.',
                'payment' => ['id' => $refunded->id, 'status' => $refunded->status],
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Erstattung fehlgeschlagen.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
