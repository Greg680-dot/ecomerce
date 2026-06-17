<?php

namespace App\Services;

use App\Models\Order;
use App\Models\ProductReview;
use App\Models\User;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Support\Collection;

class NotificationService
{
    public function notifyOrderConfirmed(User $user, Order $order): void
    {
        $user->notify(new \App\Notifications\OrderConfirmedNotification($order));
    }

    public function notifyOrderShipped(User $user, Order $order): void
    {
        $user->notify(new \App\Notifications\OrderShippedNotification($order));
    }

    public function notifyOrderDelivered(User $user, Order $order): void
    {
        $user->notify(new \App\Notifications\OrderDeliveredNotification($order));
    }

    public function notifyReviewApproved(User $user, ProductReview $review): void
    {
        $user->notify(new \App\Notifications\ReviewApprovedNotification($review));
    }

    public function getUserNotifications(User $user, int $perPage = 20): Collection
    {
        return $user->notifications()
            ->latest()
            ->paginate($perPage)
            ->through(fn (DatabaseNotification $notification) => [
                'id' => $notification->id,
                'type' => class_basename($notification->type),
                'data' => $notification->data,
                'read_at' => $notification->read_at?->toIso8601String(),
                'created_at' => $notification->created_at?->toIso8601String(),
            ])
            ->getCollection();
    }

    public function markAsRead(User $user, string $notificationId): bool
    {
        $notification = $user->notifications()->where('id', $notificationId)->first();

        if (! $notification) {
            return false;
        }

        $notification->markAsRead();

        return true;
    }

    public function markAllAsRead(User $user): int
    {
        $count = $user->unreadNotifications()->count();
        $user->unreadNotifications->markAsRead();

        return $count;
    }

    public function unreadCount(User $user): int
    {
        return $user->unreadNotifications()->count();
    }
}
