<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'brand_id' => ['required', 'exists:brands,id'],
            'category_id' => ['required', 'exists:categories,id'],
            'subcategory_id' => ['nullable', 'exists:categories,id'],
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'unique:products,slug'],
            'sku' => ['required', 'string', 'max:100', 'unique:products,sku'],
            'short_description' => ['nullable', 'string', 'max:500'],
            'description' => ['required', 'string'],
            'price' => ['required', 'numeric', 'min:0'],
            'sale_price' => ['nullable', 'numeric', 'min:0', 'lt:price'],
            'stock' => ['required', 'integer', 'min:0'],
            'warranty_months' => ['nullable', 'integer', 'min:0'],
            'energy_class' => ['nullable', 'string', 'max:5'],
            'video_url' => ['nullable', 'url'],
            'is_active' => ['nullable', 'boolean'],
            'is_featured' => ['nullable', 'boolean'],
            'is_new' => ['nullable', 'boolean'],
            'is_promotion' => ['nullable', 'boolean'],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'brand_id.required' => 'Bitte wählen Sie eine Marke.',
            'category_id.required' => 'Bitte wählen Sie eine Kategorie.',
            'name.required' => 'Der Produktname ist erforderlich.',
            'slug.unique' => 'Dieser Slug ist bereits vergeben.',
            'sku.unique' => 'Diese SKU ist bereits vergeben.',
            'price.required' => 'Der Preis ist erforderlich.',
            'sale_price.lt' => 'Der Aktionspreis muss niedriger als der reguläre Preis sein.',
        ];
    }
}
