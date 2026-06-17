<?php

use App\Http\Controllers\Api\AddressController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BrandController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ComparisonController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\QuestionController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\WishlistController;
use App\Http\Controllers\Api\Admin\AnalyticsController;
use App\Http\Controllers\Api\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Api\Admin\PaymentController as AdminPaymentController;
use App\Http\Controllers\Api\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Api\Admin\PromotionController;
use App\Http\Controllers\Api\Admin\ReturnController;
use App\Http\Controllers\Api\Admin\ReviewController as AdminReviewController;
use App\Http\Controllers\Api\Admin\SettingController;
use App\Http\Controllers\Api\Admin\StockController;
use App\Http\Controllers\Api\Admin\UserController as AdminUserController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {

    // Public routes
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);

    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/search', [ProductController::class, 'search']);
    Route::get('/products/featured', [ProductController::class, 'featured']);
    Route::get('/products/new-arrivals', [ProductController::class, 'newArrivals']);
    Route::get('/products/promotions', [ProductController::class, 'promotions']);
    Route::post('/products/compare', [ProductController::class, 'compare']);
    Route::get('/products/{slug}', [ProductController::class, 'show']);

    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/categories/{slug}', [CategoryController::class, 'show']);

    Route::get('/brands', [BrandController::class, 'index']);
    Route::get('/brands/{slug}', [BrandController::class, 'show']);

    Route::get('/products/{productId}/reviews', [ReviewController::class, 'index']);
    Route::get('/products/{productId}/questions', [QuestionController::class, 'index']);

    // Authenticated customer routes
    Route::middleware(['auth:sanctum', 'active'])->group(function () {
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::put('/auth/profile', [AuthController::class, 'updateProfile']);

        Route::get('/cart', [CartController::class, 'index']);
        Route::post('/cart', [CartController::class, 'store']);
        Route::put('/cart/{cartItem}', [CartController::class, 'update']);
        Route::delete('/cart/{cartItem}', [CartController::class, 'destroy']);
        Route::delete('/cart', [CartController::class, 'clear']);

        Route::get('/wishlist', [WishlistController::class, 'index']);
        Route::post('/wishlist', [WishlistController::class, 'store']);
        Route::delete('/wishlist/{wishlist}', [WishlistController::class, 'destroy']);

        Route::get('/comparison', [ComparisonController::class, 'index']);
        Route::post('/comparison', [ComparisonController::class, 'store']);
        Route::delete('/comparison/{comparison}', [ComparisonController::class, 'destroy']);
        Route::delete('/comparison', [ComparisonController::class, 'clear']);

        Route::get('/orders', [OrderController::class, 'index']);
        Route::post('/orders', [OrderController::class, 'store']);
        Route::get('/orders/{order}', [OrderController::class, 'show']);
        Route::get('/orders/{order}/track', [OrderController::class, 'track']);
        Route::get('/orders/{order}/invoice', [OrderController::class, 'downloadInvoice']);

        Route::apiResource('addresses', AddressController::class);

        Route::post('/reviews', [ReviewController::class, 'store']);
        Route::post('/questions', [QuestionController::class, 'store']);

        Route::post('/payments/stripe', [PaymentController::class, 'stripe']);
        Route::post('/payments/paypal', [PaymentController::class, 'paypal']);
        Route::post('/payments/klarna', [PaymentController::class, 'klarna']);
        Route::post('/payments/{payment}/confirm', [PaymentController::class, 'confirm']);

        Route::get('/notifications', [NotificationController::class, 'index']);
        Route::get('/notifications/unread-count', [NotificationController::class, 'unreadCount']);
        Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
        Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);
    });

    // Admin routes
    Route::middleware(['auth:sanctum', 'active', 'admin'])->prefix('admin')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index']);

        Route::apiResource('users', AdminUserController::class);

        Route::get('/products', [AdminProductController::class, 'index']);
        Route::post('/products', [AdminProductController::class, 'store']);
        Route::get('/products/{product}', [AdminProductController::class, 'show']);
        Route::put('/products/{product}', [AdminProductController::class, 'update']);
        Route::delete('/products/{product}', [AdminProductController::class, 'destroy']);
        Route::post('/products/{product}/images', [AdminProductController::class, 'uploadImages']);
        Route::put('/products/{product}/specifications', [AdminProductController::class, 'syncSpecifications']);

        Route::apiResource('categories', AdminCategoryController::class);

        Route::get('/orders', [AdminOrderController::class, 'index']);
        Route::get('/orders/{order}', [AdminOrderController::class, 'show']);
        Route::put('/orders/{order}', [AdminOrderController::class, 'update']);
        Route::post('/orders/{order}/invoice', [AdminOrderController::class, 'generateInvoice']);

        Route::get('/payments', [AdminPaymentController::class, 'index']);
        Route::get('/payments/{payment}', [AdminPaymentController::class, 'show']);
        Route::post('/payments/{payment}/refund', [AdminPaymentController::class, 'refund']);

        Route::get('/reviews', [AdminReviewController::class, 'index']);
        Route::post('/reviews/{review}/approve', [AdminReviewController::class, 'approve']);
        Route::post('/reviews/{review}/reject', [AdminReviewController::class, 'reject']);
        Route::delete('/reviews/{review}', [AdminReviewController::class, 'destroy']);

        Route::apiResource('promotions', PromotionController::class);

        Route::get('/stock', [StockController::class, 'index']);
        Route::put('/stock/{product}', [StockController::class, 'update']);
        Route::post('/stock/bulk', [StockController::class, 'bulkUpdate']);

        Route::get('/returns', [ReturnController::class, 'index']);
        Route::get('/returns/{return}', [ReturnController::class, 'show']);
        Route::put('/returns/{return}', [ReturnController::class, 'update']);

        Route::get('/settings', [SettingController::class, 'index']);
        Route::put('/settings', [SettingController::class, 'update']);
        Route::get('/questions', [SettingController::class, 'questions']);
        Route::post('/questions/{question}/answer', [SettingController::class, 'answerQuestion']);

        Route::get('/analytics/overview', [AnalyticsController::class, 'overview']);
        Route::get('/analytics/sales', [AnalyticsController::class, 'sales']);
        Route::get('/analytics/categories', [AnalyticsController::class, 'categories']);
    });
});
