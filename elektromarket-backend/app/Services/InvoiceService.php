<?php

namespace App\Services;

use App\Models\Order;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;

class InvoiceService
{
    public function generate(Order $order): string
    {
        $order->load(['items', 'user']);

        $pdf = Pdf::loadView('invoices.order', [
            'order' => $order,
            'company' => [
                'name' => config('app.company_name', 'ElektroMarket Germany GmbH'),
                'address' => config('app.company_address', 'Musterstraße 1, 10115 Berlin'),
                'vat' => config('app.company_vat', 'DE123456789'),
                'email' => config('app.company_email', 'rechnung@elektromarket.de'),
            ],
        ]);

        $filename = "invoices/{$order->order_number}.pdf";
        Storage::disk('local')->put($filename, $pdf->output());

        $order->update(['invoice_path' => $filename]);

        return $filename;
    }

    public function download(Order $order): \Symfony\Component\HttpFoundation\Response
    {
        if (! $order->invoice_path || ! Storage::disk('local')->exists($order->invoice_path)) {
            $this->generate($order);
            $order->refresh();
        }

        return Storage::disk('local')->download(
            $order->invoice_path,
            "Rechnung-{$order->order_number}.pdf"
        );
    }
}
