<?php

namespace App\Enums;

enum UserRole: string
{
    case Admin = 'admin';
    case Customer = 'customer';
    case B2B = 'b2b';

    public function label(): string
    {
        return match ($this) {
            self::Admin => 'Administrator',
            self::Customer => 'Kunde (B2C)',
            self::B2B => 'Geschäftskunde (B2B)',
        };
    }
}
