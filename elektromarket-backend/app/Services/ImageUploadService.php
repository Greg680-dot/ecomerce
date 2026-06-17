<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageUploadService
{
    protected string $disk;

    public function __construct()
    {
        $this->disk = config('filesystems.default') === 's3' ? 's3' : 'public';
    }

    public function upload(UploadedFile $file, string $directory = 'products'): string
    {
        $filename = Str::uuid().'.'.$file->getClientOriginalExtension();
        $path = "{$directory}/{$filename}";

        Storage::disk($this->disk)->put($path, file_get_contents($file->getRealPath()), 'public');

        return Storage::disk($this->disk)->url($path);
    }

    public function uploadMultiple(array $files, string $directory = 'products'): array
    {
        return array_map(fn (UploadedFile $file) => $this->upload($file, $directory), $files);
    }

    public function delete(?string $url): bool
    {
        if (! $url) {
            return false;
        }

        $path = $this->urlToPath($url);

        if (! $path) {
            return false;
        }

        return Storage::disk($this->disk)->delete($path);
    }

    public function urlToPath(string $url): ?string
    {
        $baseUrl = rtrim(Storage::disk($this->disk)->url(''), '/');

        if (! str_starts_with($url, $baseUrl)) {
            return null;
        }

        return ltrim(str_replace($baseUrl, '', $url), '/');
    }
}
