<?php

namespace App\Http\Controllers\Api\Admin;

use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateOrderRequest;
use App\Http\Resources\OrderDetailResource;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Models\OrderTracking;
use App\Services\InvoiceService;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class OrderController extends Controller
{
    public function __construct(
        protected NotificationService $notificationService,
        protected InvoiceService $invoiceService,
    ) {}

    public function index(Request $request): AnonymousResourceCollection
    {
        $orders = Order::query()
            ->with('user:id,name,email')
            ->withCount('items')
            ->when($request->status, fn ($q, $s) => $q->where('status', $s))
            ->when($request->search, fn ($q, $s) => $q->where('order_number', 'like', "%{$s}%"))
            ->when($request->payment_status, fn ($q, $s) => $q->where('payment_status', $s))
            ->latest()
            ->paginate((int) $request->input('per_page', 20));

        return OrderResource::collection($orders);
    }

    public function show(Order $order): OrderDetailResource
    {
        $order->load(['items.product', 'tracking', 'payment', 'user']);

        return new OrderDetailResource($order);
    }

    public function update(UpdateOrderRequest $request, Order $order): JsonResponse
    {
        $data = $request->validated();
        $previousStatus = $order->status;

        if (isset($data['status'])) {
            match ($data['status']) {
                OrderStatus::Shipped->value => $data['shipped_at'] = now(),
                OrderStatus::Delivered->value => $data['delivered_at'] = now(),
                default => null,
            };

            OrderTracking::query()->create([
                'order_id' => $order->id,
                'status' => is_string($data['status']) ? $data['status'] : $data['status']->value,
                'description' => 'Status aktualisiert durch Administrator',
                'tracked_at' => now(),
            ]);
        }

        $order->update($data);
        $order->load('user');

        if ($order->user && isset($data['status']) && $previousStatus !== $order->status) {
            match ($order->status) {
                OrderStatus::Confirmed => $this->notificationService->notifyOrderConfirmed($order->user, $order),
                OrderStatus::Shipped => $this->notificationService->notifyOrderShipped($order->user, $order),
                OrderStatus::Delivered => $this->notificationService->notifyOrderDelivered($order->user, $order),
                default => null,
            };
        }

        return response()->json([
            'message' => 'Bestellung erfolgreich aktualisiert.',
            'order' => new OrderDetailResource($order->fresh()->load(['items', 'tracking', 'payment'])),
        ]);
    }

    public function generateInvoice(Order $order): JsonResponse
    {
        $path = $this->invoiceService->generate($order);

        return response()->json([
            'message' => 'Rechnung erfolgreich erstellt.',
            'invoice_path' => $path,
        ]);
    }
}
