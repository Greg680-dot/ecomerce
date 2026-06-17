<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductDetailResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return array_merge(
            (new ProductResource($this))->toArray($request),
            [
                'description' => $this->description,
                'warranty_months' => $this->warranty_months,
                'video_url' => $this->video_url,
                'views_count' => $this->views_count,
                'sales_count' => $this->sales_count,
                'meta_title' => $this->meta_title,
                'meta_description' => $this->meta_description,
                'subcategory' => new CategoryResource($this->whenLoaded('subcategory')),
                'specifications' => $this->whenLoaded('specifications', fn () => $this->specifications
                    ->groupBy('group')
                    ->map(fn ($specs, $group) => [
                        'group' => $group,
                        'items' => $specs->map(fn ($spec) => [
                            'key' => $spec->key,
                            'value' => $spec->value,
                        ])->values(),
                    ])->values()),
                'reviews' => ReviewResource::collection($this->whenLoaded('approvedReviews')),
                'questions' => $this->whenLoaded('questions', fn () => $this->questions
                    ->where('is_public', true)
                    ->map(fn ($q) => [
                        'id' => $q->id,
                        'question' => $q->question,
                        'answer' => $q->answer,
                        'answered_at' => $q->answered_at?->toIso8601String(),
                        'user' => $q->relationLoaded('user') ? [
                            'id' => $q->user->id,
                            'name' => $q->user->name,
                        ] : null,
                    ])),
            ]
        );
    }
}
