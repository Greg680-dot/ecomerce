<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AnalyticsController extends Controller
{
    public function overview(Request $request): JsonResponse
    {
        $days = (int) $request->input('days', 30);
        $from = now()->subDays($days)->startOfDay();

        $revenueByDay = Order::query()
            ->where('payment_status', 'paid')
            ->where('created_at', '>=', $from)
            ->selectRaw('DATE(created_at) as date, SUM(total) as revenue, COUNT(*) as orders')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $topProducts = DB::table('order_items')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('orders.payment_status', 'paid')
            ->where('orders.created_at', '>=', $from)
            ->selectRaw('products.id, products.name, SUM(order_items.quantity) as total_sold, SUM(order_items.total) as revenue')
            ->groupBy('products.id', 'products.name')
            ->orderByDesc('total_sold')
            ->limit(10)
            ->get();

        return response()->json([
            'period_days' => $days,
            'revenue_by_day' => $revenueByDay,
            'top_products' => $topProducts,
            'summary' => [
                'new_users' => User::query()->where('created_at', '>=', $from)->count(),
                'new_orders' => Order::query()->where('created_at', '>=', $from)->count(),
                'total_revenue' => (float) Order::query()->where('payment_status', 'paid')->where('created_at', '>=', $from)->sum('total'),
                'avg_order_value' => (float) Order::query()->where('payment_status', 'paid')->where('created_at', '>=', $from)->avg('total'),
                'active_products' => Product::query()->where('is_active', true)->count(),
            ],
        ]);
    }

    public function sales(Request $request): JsonResponse
    {
        $year = (int) $request->input('year', now()->year);

        $monthly = Order::query()
            ->where('payment_status', 'paid')
            ->whereYear('created_at', $year)
            ->selectRaw('MONTH(created_at) as month, SUM(total) as revenue, COUNT(*) as orders')
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        return response()->json([
            'year' => $year,
            'monthly' => $monthly,
        ]);
    }

    public function categories(): JsonResponse
    {
        $data = DB::table('order_items')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->join('categories', 'products.category_id', '=', 'categories.id')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('orders.payment_status', 'paid')
            ->selectRaw('categories.id, categories.name, SUM(order_items.quantity) as total_sold, SUM(order_items.total) as revenue')
            ->groupBy('categories.id', 'categories.name')
            ->orderByDesc('revenue')
            ->get();

        return response()->json(['categories' => $data]);
    }
}
