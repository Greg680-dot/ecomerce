<?php

namespace App\Http\Requests\Review;

use Illuminate\Foundation\Http\FormRequest;

class StoreReviewRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'title' => ['nullable', 'string', 'max:255'],
            'comment' => ['required', 'string', 'min:10', 'max:2000'],
        ];
    }

    public function messages(): array
    {
        return [
            'product_id.required' => 'Bitte wählen Sie ein Produkt aus.',
            'rating.required' => 'Bitte geben Sie eine Bewertung ab.',
            'rating.min' => 'Die Mindestbewertung ist 1 Stern.',
            'rating.max' => 'Die Höchstbewertung ist 5 Sterne.',
            'comment.required' => 'Bitte schreiben Sie einen Kommentar.',
            'comment.min' => 'Der Kommentar muss mindestens 10 Zeichen lang sein.',
        ];
    }
}
