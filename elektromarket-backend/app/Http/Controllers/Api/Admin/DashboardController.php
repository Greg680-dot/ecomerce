<?php

namespace App\Http\Controllers\Api\Admin;

use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Payment;
use App\Models\Product;
use App\Models\ProductReview;
use App\Models\ReturnModel;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        $today = now()->startOfDay();
        $monthStart = now()->startOfMonth();

        return response()->json([
            'stats' => [
                'total_users' => User::query()->count(),
                'total_products' => Product::query()->count(),
                'active_products' => Product::query()->where('is_active', true)->count(),
                'low_stock_products' => Product::query()->where('stock', '<', 10)->count(),
                'total_orders' => Order::query()->count(),
                'pending_orders' => Order::query()->where('status', OrderStatus::Pending)->count(),
                'orders_today' => Order::query()->where('created_at', '>=', $today)->count(),
                'revenue_today' => (float) Order::query()->where('created_at', '>=', $today)->where('payment_status', 'paid')->sum('total'),
                'revenue_month' => (float) Order::query()->where('created_at', '>=', $monthStart)->where('payment_status', 'paid')->sum('total'),
                'pending_reviews' => ProductReview::query()->where('is_approved', false)->count(),
                'pending_returns' => ReturnModel::query()->where('status', 'requested')->count(),
                'pending_payments' => Payment::query()->where('status', 'pending')->count(),
            ],
            'recent_orders' => Order::query()
                ->with('user:id,name,email')
                ->latest()
                ->limit(5)
                ->get()
                ->map(fn (Order $o) => [
                    'id' => $o->id,
                    'order_number' => $o->order_number,
                    'total' => $o->total,
                    'status' => $o->status?->value,
                    'user' => $o->user?->only(['id', 'name', 'email']),
                    'created_at' => $o->created_at?->toIso8601String(),
                ]),
        ]);
    }
}
