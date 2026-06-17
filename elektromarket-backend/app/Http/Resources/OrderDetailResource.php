<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderDetailResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return array_merge(
            (new OrderResource($this))->toArray($request),
            [
                'shipping_address' => $this->shipping_address,
                'billing_address' => $this->billing_address,
                'notes' => $this->notes,
                'invoice_path' => $this->invoice_path,
                'items' => $this->whenLoaded('items', fn () => $this->items->map(fn ($item) => [
                    'id' => $item->id,
                    'product_id' => $item->product_id,
                    'product_name' => $item->product_name,
                    'product_sku' => $item->product_sku,
                    'unit_price' => $item->unit_price,
                    'quantity' => $item->quantity,
                    'total' => $item->total,
                ])),
                'tracking' => $this->whenLoaded('tracking', fn () => $this->tracking->map(fn ($t) => [
                    'id' => $t->id,
                    'status' => $t->status,
                    'location' => $t->location,
                    'description' => $t->description,
                    'tracked_at' => $t->tracked_at?->toIso8601String(),
                ])),
                'payment' => $this->whenLoaded('payment', fn () => $this->payment ? [
                    'id' => $this->payment->id,
                    'method' => $this->payment->method?->value,
                    'status' => $this->payment->status,
                    'amount' => $this->payment->amount,
                    'currency' => $this->payment->currency,
                    'transaction_id' => $this->payment->transaction_id,
                ] : null),
            ]
        );
    }
}
