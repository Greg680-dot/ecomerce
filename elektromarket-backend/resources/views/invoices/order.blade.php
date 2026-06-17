<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <title>Rechnung {{ $order->order_number }}</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; color: #333; }
        .header { margin-bottom: 30px; }
        .header h1 { margin: 0; font-size: 24px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background: #f5f5f5; }
        .totals { margin-top: 20px; text-align: right; }
        .totals p { margin: 4px 0; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Rechnung</h1>
        <p><strong>{{ $company['name'] }}</strong><br>{{ $company['address'] }}<br>USt-IdNr.: {{ $company['vat'] }}</p>
        <p>Rechnungsnummer: {{ $order->order_number }}<br>Datum: {{ $order->created_at->format('d.m.Y') }}</p>
    </div>

    <p>
        <strong>Rechnungsempfänger:</strong><br>
        {{ $order->billing_address['first_name'] ?? '' }} {{ $order->billing_address['last_name'] ?? '' }}<br>
        {{ $order->billing_address['street'] ?? '' }} {{ $order->billing_address['street_number'] ?? '' }}<br>
        {{ $order->billing_address['postal_code'] ?? '' }} {{ $order->billing_address['city'] ?? '' }}
    </p>

    <table>
        <thead>
            <tr>
                <th>Artikel</th>
                <th>SKU</th>
                <th>Menge</th>
                <th>Einzelpreis</th>
                <th>Gesamt</th>
            </tr>
        </thead>
        <tbody>
            @foreach($order->items as $item)
            <tr>
                <td>{{ $item->product_name }}</td>
                <td>{{ $item->product_sku }}</td>
                <td>{{ $item->quantity }}</td>
                <td>{{ number_format((float) $item->unit_price, 2, ',', '.') }} €</td>
                <td>{{ number_format((float) $item->total, 2, ',', '.') }} €</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="totals">
        <p>Zwischensumme: {{ number_format((float) $order->subtotal, 2, ',', '.') }} €</p>
        <p>MwSt.: {{ number_format((float) $order->tax, 2, ',', '.') }} €</p>
        <p>Versand: {{ number_format((float) $order->shipping_cost, 2, ',', '.') }} €</p>
        @if((float) $order->discount > 0)
        <p>Rabatt: -{{ number_format((float) $order->discount, 2, ',', '.') }} €</p>
        @endif
        <p><strong>Gesamtbetrag: {{ number_format((float) $order->total, 2, ',', '.') }} €</strong></p>
    </div>
</body>
</html>
