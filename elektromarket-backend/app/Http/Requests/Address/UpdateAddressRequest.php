<?php

namespace App\Http\Requests\Address;

class UpdateAddressRequest extends StoreAddressRequest
{
    public function rules(): array
    {
        $rules = parent::rules();
        $rules['first_name'] = ['sometimes', 'required', 'string', 'max:100'];
        $rules['last_name'] = ['sometimes', 'required', 'string', 'max:100'];
        $rules['street'] = ['sometimes', 'required', 'string', 'max:255'];
        $rules['street_number'] = ['sometimes', 'required', 'string', 'max:20'];
        $rules['postal_code'] = ['sometimes', 'required', 'string', 'max:10'];
        $rules['city'] = ['sometimes', 'required', 'string', 'max:100'];

        return $rules;
    }
}
