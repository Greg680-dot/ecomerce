<?php

namespace App\Enums;

enum OrderStatus: string
{
    case Pending = 'pending';
    case Confirmed = 'confirmed';
    case Processing = 'processing';
    case Shipped = 'shipped';
    case Delivered = 'delivered';
    case Cancelled = 'cancelled';
    case Returned = 'returned';

    public function label(): string
    {
        return match ($this) {
            self::Pending => 'Ausstehend',
            self::Confirmed => 'Bestätigt',
            self::Processing => 'In Bearbeitung',
            self::Shipped => 'Versendet',
            self::Delivered => 'Zugestellt',
            self::Cancelled => 'Storniert',
            self::Returned => 'Retourniert',
        };
    }
}
