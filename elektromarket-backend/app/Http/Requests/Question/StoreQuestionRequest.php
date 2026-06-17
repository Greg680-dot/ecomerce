<?php

namespace App\Http\Requests\Question;

use Illuminate\Foundation\Http\FormRequest;

class StoreQuestionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'question' => ['required', 'string', 'min:10', 'max:1000'],
        ];
    }

    public function messages(): array
    {
        return [
            'product_id.required' => 'Bitte wählen Sie ein Produkt aus.',
            'question.required' => 'Bitte stellen Sie eine Frage.',
            'question.min' => 'Die Frage muss mindestens 10 Zeichen lang sein.',
        ];
    }
}
