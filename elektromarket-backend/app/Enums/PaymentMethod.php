<?php

namespace App\Enums;

enum PaymentMethod: string
{
    case Stripe = 'stripe';
    case PayPal = 'paypal';
    case Klarna = 'klarna';
    case Card = 'card';
    case BankTransfer = 'bank_transfer';

    public function label(): string
    {
        return match ($this) {
            self::Stripe => 'Stripe',
            self::PayPal => 'PayPal',
            self::Klarna => 'Klarna',
            self::Card => 'Kreditkarte',
            self::BankTransfer => 'Banküberweisung',
        };
    }
}
