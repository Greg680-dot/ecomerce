<?php

namespace App\Notifications;

use App\Models\ProductReview;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ReviewApprovedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public ProductReview $review) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Ihre Produktbewertung wurde veröffentlicht')
            ->greeting('Hallo '.$notifiable->name.',')
            ->line('Ihre Bewertung wurde freigegeben und ist jetzt sichtbar.')
            ->action('Produkt ansehen', config('app.frontend_url').'/products/'.$this->review->product_id);
    }

    public function toArray(object $notifiable): array
    {
        return [
            'review_id' => $this->review->id,
            'product_id' => $this->review->product_id,
            'message' => 'Ihre Produktbewertung wurde veröffentlicht.',
        ];
    }
}
