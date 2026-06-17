<?php

namespace App\Http\Controllers\Api;

use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Order\StoreOrderRequest;
use App\Http\Resources\OrderDetailResource;
use App\Http\Resources\OrderResource;
use App\Models\Address;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderTracking;
use App\Models\Promotion;
use App\Services\InvoiceService;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    public function __construct(
        protected InvoiceService $invoiceService,
        protected NotificationService $notificationService,
    ) {}

    public function index(Request $request): AnonymousResourceCollection
    {
        $orders = Order::query()
            ->where('user_id', $request->user()->id)
            ->withCount('items')
            ->latest()
            ->paginate((int) $request->input('per_page', 10));

        return OrderResource::collection($orders);
    }

    public function show(Request $request, Order $order): OrderDetailResource|JsonResponse
    {
        if ($order->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Zugriff verweigert.'], 403);
        }

        $order->load(['items', 'tracking', 'payment']);

        return new OrderDetailResource($order);
    }

    public function store(StoreOrderRequest $request): JsonResponse
    {
        $user = $request->user();
        $cartItems = CartItem::query()
            ->where('user_id', $user->id)
            ->with('product')
            ->get();

        if ($cartItems->isEmpty()) {
            return response()->json(['message' => 'Ihr Warenkorb ist leer.'], 422);
        }

        foreach ($cartItems as $item) {
            if (! $item->product->is_active || $item->product->stock < $item->quantity) {
                return response()->json([
                    'message' => "Produkt \"{$item->product->name}\" ist nicht verfügbar oder nicht auf Lager.",
                ], 422);
            }
        }

        $shippingAddress = Address::query()
            ->where('user_id', $user->id)
            ->findOrFail($request->shipping_address_id);

        $billingAddress = $request->billing_address_id
            ? Address::query()->where('user_id', $user->id)->findOrFail($request->billing_address_id)
            : $shippingAddress;

        $subtotal = $cartItems->sum(fn (CartItem $item) => (float) $item->product->effective_price * $item->quantity);
        $discount = 0.0;

        if ($request->promotion_code) {
            $promotion = Promotion::query()->where('code', $request->promotion_code)->first();
            if (! $promotion) {
                return response()->json(['message' => 'Ungültiger Aktionscode.'], 422);
            }
            $discount = $promotion->calculateDiscount($subtotal);
            if ($discount <= 0) {
                return response()->json(['message' => 'Der Aktionscode ist nicht gültig oder nicht anwendbar.'], 422);
            }
        }

        $taxRate = (float) config('app.tax_rate', 19);
        $taxableAmount = $subtotal - $discount;
        $tax = round($taxableAmount * ($taxRate / 100), 2);
        $shippingCost = (float) config('app.default_shipping_cost', 4.99);
        $total = round($taxableAmount + $tax + $shippingCost, 2);

        $order = DB::transaction(function () use ($user, $cartItems, $shippingAddress, $billingAddress, $request, $subtotal, $tax, $shippingCost, $discount, $total) {
            $order = Order::query()->create([
                'order_number' => 'EM-'.strtoupper(Str::random(8)),
                'user_id' => $user->id,
                'status' => OrderStatus::Pending,
                'subtotal' => $subtotal,
                'tax' => $tax,
                'shipping_cost' => $shippingCost,
                'discount' => $discount,
                'total' => $total,
                'payment_method' => $request->payment_method,
                'payment_status' => 'pending',
                'shipping_carrier' => $request->shipping_carrier,
                'shipping_address' => $shippingAddress->toSnapshot(),
                'billing_address' => $billingAddress->toSnapshot(),
                'notes' => $request->notes,
            ]);

            foreach ($cartItems as $item) {
                $unitPrice = (float) $item->product->effective_price;
                OrderItem::query()->create([
                    'order_id' => $order->id,
                    'product_id' => $item->product_id,
                    'product_name' => $item->product->name,
                    'product_sku' => $item->product->sku,
                    'unit_price' => $unitPrice,
                    'quantity' => $item->quantity,
                    'total' => round($unitPrice * $item->quantity, 2),
                ]);

                $item->product->decrement('stock', $item->quantity);
                $item->product->increment('sales_count', $item->quantity);
            }

            OrderTracking::query()->create([
                'order_id' => $order->id,
                'status' => OrderStatus::Pending->value,
                'description' => 'Bestellung eingegangen',
                'tracked_at' => now(),
            ]);

            CartItem::query()->where('user_id', $user->id)->delete();

            if ($request->promotion_code) {
                Promotion::query()->where('code', $request->promotion_code)->increment('used_count');
            }

            return $order;
        });

        $order->load(['items', 'tracking']);

        return response()->json([
            'message' => 'Bestellung erfolgreich aufgegeben.',
            'order' => new OrderDetailResource($order),
        ], 201);
    }

    public function track(Request $request, Order $order): JsonResponse
    {
        if ($order->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Zugriff verweigert.'], 403);
        }

        $order->load('tracking');

        return response()->json([
            'order_number' => $order->order_number,
            'status' => $order->status?->value,
            'status_label' => $order->status?->label(),
            'tracking_number' => $order->tracking_number,
            'shipping_carrier' => $order->shipping_carrier?->value,
            'tracking' => $order->tracking->map(fn ($t) => [
                'status' => $t->status,
                'location' => $t->location,
                'description' => $t->description,
                'tracked_at' => $t->tracked_at?->toIso8601String(),
            ]),
        ]);
    }

    public function downloadInvoice(Request $request, Order $order)
    {
        if ($order->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Zugriff verweigert.'], 403);
        }

        return $this->invoiceService->download($order);
    }
}
