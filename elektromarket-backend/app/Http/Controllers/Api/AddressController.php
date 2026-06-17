<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Address\StoreAddressRequest;
use App\Http\Requests\Address\UpdateAddressRequest;
use App\Http\Resources\AddressResource;
use App\Models\Address;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AddressController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $addresses = Address::query()
            ->where('user_id', $request->user()->id)
            ->orderByDesc('is_default')
            ->latest()
            ->get();

        return AddressResource::collection($addresses);
    }

    public function store(StoreAddressRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['user_id'] = $request->user()->id;
        $data['country'] = $data['country'] ?? 'DE';

        if (! empty($data['is_default'])) {
            Address::query()->where('user_id', $request->user()->id)->update(['is_default' => false]);
        }

        $address = Address::query()->create($data);

        return response()->json([
            'message' => 'Adresse erfolgreich gespeichert.',
            'address' => new AddressResource($address),
        ], 201);
    }

    public function show(Request $request, Address $address): AddressResource|JsonResponse
    {
        if ($address->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Zugriff verweigert.'], 403);
        }

        return new AddressResource($address);
    }

    public function update(UpdateAddressRequest $request, Address $address): JsonResponse
    {
        if ($address->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Zugriff verweigert.'], 403);
        }

        $data = $request->validated();

        if (! empty($data['is_default'])) {
            Address::query()->where('user_id', $request->user()->id)->update(['is_default' => false]);
        }

        $address->update($data);

        return response()->json([
            'message' => 'Adresse erfolgreich aktualisiert.',
            'address' => new AddressResource($address->fresh()),
        ]);
    }

    public function destroy(Request $request, Address $address): JsonResponse
    {
        if ($address->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Zugriff verweigert.'], 403);
        }

        $address->delete();

        return response()->json(['message' => 'Adresse erfolgreich gelöscht.']);
    }
}
