<?php

namespace App\Services;

use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use App\Models\Order;
use App\Models\Payment;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Stripe\PaymentIntent;
use Stripe\Stripe;

class PaymentService
{
    public function createStripeIntent(Order $order): array
    {
        Stripe::setApiKey(config('services.stripe.secret'));

        $intent = PaymentIntent::create([
            'amount' => (int) round((float) $order->total * 100),
            'currency' => 'eur',
            'metadata' => [
                'order_id' => $order->id,
                'order_number' => $order->order_number,
            ],
            'automatic_payment_methods' => ['enabled' => true],
        ]);

        $payment = $this->createPaymentRecord($order, PaymentMethod::Stripe, $intent->id, [
            'client_secret' => $intent->client_secret,
            'intent_id' => $intent->id,
        ]);

        return [
            'payment_id' => $payment->id,
            'client_secret' => $intent->client_secret,
            'intent_id' => $intent->id,
        ];
    }

    public function createPayPalIntent(Order $order): array
    {
        $accessToken = $this->getPayPalAccessToken();
        $baseUrl = config('services.paypal.mode') === 'live'
            ? 'https://api-m.paypal.com'
            : 'https://api-m.sandbox.paypal.com';

        $response = Http::withToken($accessToken)
            ->post("{$baseUrl}/v2/checkout/orders", [
                'intent' => 'CAPTURE',
                'purchase_units' => [[
                    'reference_id' => $order->order_number,
                    'amount' => [
                        'currency_code' => 'EUR',
                        'value' => number_format((float) $order->total, 2, '.', ''),
                    ],
                ]],
                'application_context' => [
                    'return_url' => config('app.frontend_url').'/checkout/paypal/success',
                    'cancel_url' => config('app.frontend_url').'/checkout/paypal/cancel',
                ],
            ]);

        if (! $response->successful()) {
            throw new \RuntimeException('PayPal-Zahlungsabsicht konnte nicht erstellt werden.');
        }

        $data = $response->json();
        $approveLink = collect($data['links'] ?? [])->firstWhere('rel', 'approve')['href'] ?? null;

        $payment = $this->createPaymentRecord($order, PaymentMethod::PayPal, $data['id'] ?? null, $data);

        return [
            'payment_id' => $payment->id,
            'order_id' => $data['id'] ?? null,
            'approve_url' => $approveLink,
        ];
    }

    public function createKlarnaIntent(Order $order): array
    {
        $baseUrl = config('services.klarna.mode') === 'live'
            ? 'https://api.klarna.com'
            : 'https://api.playground.klarna.com';

        $response = Http::withBasicAuth(
            config('services.klarna.username'),
            config('services.klarna.password')
        )->post("{$baseUrl}/payments/v1/sessions", [
            'purchase_country' => 'DE',
            'purchase_currency' => 'EUR',
            'locale' => 'de-DE',
            'order_amount' => (int) round((float) $order->total * 100),
            'order_lines' => $order->items->map(fn ($item) => [
                'name' => $item->product_name,
                'quantity' => $item->quantity,
                'unit_price' => (int) round((float) $item->unit_price * 100),
                'total_amount' => (int) round((float) $item->total * 100),
            ])->values()->all(),
        ]);

        if (! $response->successful()) {
            throw new \RuntimeException('Klarna-Zahlungsabsicht konnte nicht erstellt werden.');
        }

        $data = $response->json();

        $payment = $this->createPaymentRecord($order, PaymentMethod::Klarna, $data['session_id'] ?? null, $data);

        return [
            'payment_id' => $payment->id,
            'session_id' => $data['session_id'] ?? null,
            'client_token' => $data['client_token'] ?? null,
        ];
    }

    public function confirmPayment(Payment $payment, string $transactionId): Payment
    {
        $payment->update([
            'status' => 'completed',
            'transaction_id' => $transactionId,
        ]);

        $order = $payment->order;
        $order->update([
            'payment_status' => 'paid',
            'status' => OrderStatus::Confirmed,
            'paid_at' => now(),
        ]);

        return $payment->fresh();
    }

    public function refund(Payment $payment, ?float $amount = null): Payment
    {
        if ($payment->method === PaymentMethod::Stripe && $payment->transaction_id) {
            Stripe::setApiKey(config('services.stripe.secret'));
            \Stripe\Refund::create([
                'payment_intent' => $payment->transaction_id,
                'amount' => $amount ? (int) round($amount * 100) : null,
            ]);
        }

        $payment->update(['status' => 'refunded']);

        return $payment->fresh();
    }

    protected function createPaymentRecord(Order $order, PaymentMethod $method, ?string $transactionId, array $metadata): Payment
    {
        return Payment::query()->create([
            'order_id' => $order->id,
            'user_id' => $order->user_id,
            'method' => $method,
            'status' => 'pending',
            'amount' => $order->total,
            'currency' => 'EUR',
            'transaction_id' => $transactionId,
            'metadata' => $metadata,
        ]);
    }

    protected function getPayPalAccessToken(): string
    {
        $baseUrl = config('services.paypal.mode') === 'live'
            ? 'https://api-m.paypal.com'
            : 'https://api-m.sandbox.paypal.com';

        $response = Http::asForm()
            ->withBasicAuth(config('services.paypal.client_id'), config('services.paypal.client_secret'))
            ->post("{$baseUrl}/v1/oauth2/token", ['grant_type' => 'client_credentials']);

        if (! $response->successful()) {
            Log::error('PayPal-Authentifizierung fehlgeschlagen.', ['response' => $response->body()]);
            throw new \RuntimeException('PayPal-Authentifizierung fehlgeschlagen.');
        }

        return $response->json('access_token');
    }
}
