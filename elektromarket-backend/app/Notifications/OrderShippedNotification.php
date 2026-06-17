<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OrderShippedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Order $order) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject("Bestellung {$this->order->order_number} versendet")
            ->greeting('Hallo '.$notifiable->name.',')
            ->line("Ihre Bestellung {$this->order->order_number} wurde versendet.")
            ->line('Sendungsnummer: '.($this->order->tracking_number ?? 'wird nachgereicht'))
            ->action('Sendung verfolgen', config('app.frontend_url').'/orders/'.$this->order->id.'/track');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'order_id' => $this->order->id,
            'order_number' => $this->order->order_number,
            'message' => "Ihre Bestellung {$this->order->order_number} wurde versendet.",
            'tracking_number' => $this->order->tracking_number,
        ];
    }
}
