<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $primaryImage = $this->relationLoaded('images')
            ? $this->images->firstWhere('is_primary', true) ?? $this->images->first()
            : null;

        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'sku' => $this->sku,
            'short_description' => $this->short_description,
            'price' => $this->price,
            'sale_price' => $this->sale_price,
            'effective_price' => $this->effective_price,
            'is_on_sale' => $this->is_on_sale,
            'stock' => $this->stock,
            'in_stock' => $this->stock > 0,
            'energy_class' => $this->energy_class,
            'rating_avg' => $this->rating_avg,
            'rating_count' => $this->rating_count,
            'is_featured' => $this->is_featured,
            'is_new' => $this->is_new,
            'is_promotion' => $this->is_promotion,
            'brand' => new BrandResource($this->whenLoaded('brand')),
            'category' => new CategoryResource($this->whenLoaded('category')),
            'primary_image' => $primaryImage?->path,
            'images' => $this->whenLoaded('images', fn () => $this->images->map(fn ($img) => [
                'id' => $img->id,
                'path' => $img->path,
                'alt' => $img->alt,
                'is_primary' => $img->is_primary,
            ])),
        ];
    }
}
