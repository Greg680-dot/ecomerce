<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Payment\CreatePaymentIntentRequest;
use App\Models\Order;
use App\Models\Payment;
use App\Services\PaymentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function __construct(protected PaymentService $paymentService) {}

    public function stripe(CreatePaymentIntentRequest $request): JsonResponse
    {
        $order = $this->getUserOrder($request, $request->order_id);

        try {
            $result = $this->paymentService->createStripeIntent($order);

            return response()->json([
                'message' => 'Stripe-Zahlungsabsicht erstellt.',
                ...$result,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Stripe-Zahlung konnte nicht initialisiert werden.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function paypal(CreatePaymentIntentRequest $request): JsonResponse
    {
        $order = $this->getUserOrder($request, $request->order_id);

        try {
            $result = $this->paymentService->createPayPalIntent($order);

            return response()->json([
                'message' => 'PayPal-Zahlungsabsicht erstellt.',
                ...$result,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'PayPal-Zahlung konnte nicht initialisiert werden.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function klarna(CreatePaymentIntentRequest $request): JsonResponse
    {
        $order = $this->getUserOrder($request, $request->order_id);

        try {
            $result = $this->paymentService->createKlarnaIntent($order);

            return response()->json([
                'message' => 'Klarna-Zahlungsabsicht erstellt.',
                ...$result,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Klarna-Zahlung konnte nicht initialisiert werden.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function confirm(Request $request, Payment $payment): JsonResponse
    {
        if ($payment->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Zugriff verweigert.'], 403);
        }

        $request->validate([
            'transaction_id' => ['required', 'string'],
        ]);

        $payment = $this->paymentService->confirmPayment($payment, $request->transaction_id);

        return response()->json([
            'message' => 'Zahlung bestätigt.',
            'payment' => [
                'id' => $payment->id,
                'status' => $payment->status,
                'transaction_id' => $payment->transaction_id,
            ],
        ]);
    }

    protected function getUserOrder(Request $request, int $orderId): Order
    {
        $order = Order::query()
            ->where('user_id', $request->user()->id)
            ->with('items')
            ->findOrFail($orderId);

        if ($order->payment_status === 'paid') {
            abort(response()->json(['message' => 'Diese Bestellung wurde bereits bezahlt.'], 422));
        }

        return $order;
    }
}
