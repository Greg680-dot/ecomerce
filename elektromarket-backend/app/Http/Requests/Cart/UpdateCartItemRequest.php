<?php

namespace App\Http\Requests\Cart;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCartItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'quantity' => ['required', 'integer', 'min:1', 'max:99'],
        ];
    }

    public function messages(): array
    {
        return [
            'quantity.required' => 'Die Menge ist erforderlich.',
            'quantity.min' => 'Die Mindestmenge beträgt 1.',
            'quantity.max' => 'Die maximale Menge beträgt 99.',
        ];
    }
}
