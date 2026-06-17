<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSettingsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'settings' => ['required', 'array'],
            'settings.*.key' => ['required', 'string', 'max:100'],
            'settings.*.value' => ['nullable'],
            'settings.*.group' => ['nullable', 'string', 'max:50'],
            'settings.*.type' => ['nullable', 'string', 'in:string,boolean,integer,float,json'],
        ];
    }

    public function messages(): array
    {
        return [
            'settings.required' => 'Einstellungen sind erforderlich.',
            'settings.*.key.required' => 'Der Einstellungsschlüssel ist erforderlich.',
        ];
    }
}
