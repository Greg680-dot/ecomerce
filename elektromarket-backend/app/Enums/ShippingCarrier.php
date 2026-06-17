<?php

namespace App\Enums;

enum ShippingCarrier: string
{
    case DHL = 'dhl';
    case UPS = 'ups';
    case DPD = 'dpd';
    case Hermes = 'hermes';

    public function label(): string
    {
        return match ($this) {
            self::DHL => 'DHL',
            self::UPS => 'UPS',
            self::DPD => 'DPD',
            self::Hermes => 'Hermes',
        };
    }
}
