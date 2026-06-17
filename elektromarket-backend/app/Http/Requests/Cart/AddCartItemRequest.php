<?php

namespace App\Http\Requests\Cart;

use Illuminate\Foundation\Http\FormRequest;

class AddCartItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'quantity' => ['required', 'integer', 'min:1', 'max:99'],
        ];
    }

    public function messages(): array
    {
        return [
            'product_id.required' => 'Bitte wählen Sie ein Produkt aus.',
            'product_id.exists' => 'Das ausgewählte Produkt existiert nicht.',
            'quantity.required' => 'Die Menge ist erforderlich.',
            'quantity.min' => 'Die Mindestmenge beträgt 1.',
            'quantity.max' => 'Die maximale Menge beträgt 99.',
        ];
    }
}
