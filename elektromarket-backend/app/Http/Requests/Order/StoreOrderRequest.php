<?php

namespace App\Http\Requests\Order;

use App\Enums\PaymentMethod;
use App\Enums\ShippingCarrier;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'shipping_address_id' => ['required', 'integer', 'exists:addresses,id'],
            'billing_address_id' => ['nullable', 'integer', 'exists:addresses,id'],
            'payment_method' => ['required', Rule::enum(PaymentMethod::class)],
            'shipping_carrier' => ['nullable', Rule::enum(ShippingCarrier::class)],
            'promotion_code' => ['nullable', 'string', 'max:50'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function messages(): array
    {
        return [
            'shipping_address_id.required' => 'Bitte wählen Sie eine Lieferadresse.',
            'shipping_address_id.exists' => 'Die Lieferadresse existiert nicht.',
            'payment_method.required' => 'Bitte wählen Sie eine Zahlungsmethode.',
        ];
    }
}
