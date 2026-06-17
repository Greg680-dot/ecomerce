<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class AnswerQuestionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'answer' => ['required', 'string', 'min:10', 'max:2000'],
            'is_public' => ['nullable', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'answer.required' => 'Die Antwort ist erforderlich.',
            'answer.min' => 'Die Antwort muss mindestens 10 Zeichen lang sein.',
        ];
    }
}
