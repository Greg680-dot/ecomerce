<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AnswerQuestionRequest;
use App\Http\Requests\Admin\UpdateSettingsRequest;
use App\Models\ProductQuestion;
use App\Models\SiteSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $settings = SiteSetting::query()
            ->when($request->group, fn ($q, $g) => $q->where('group', $g))
            ->orderBy('group')
            ->orderBy('key')
            ->get()
            ->map(fn (SiteSetting $s) => [
                'id' => $s->id,
                'key' => $s->key,
                'value' => SiteSetting::get($s->key),
                'group' => $s->group,
                'type' => $s->type,
            ]);

        return response()->json(['settings' => $settings]);
    }

    public function update(UpdateSettingsRequest $request): JsonResponse
    {
        $updated = [];

        foreach ($request->settings as $setting) {
            $updated[] = SiteSetting::set(
                $setting['key'],
                $setting['value'] ?? '',
                $setting['group'] ?? 'general',
                $setting['type'] ?? 'string',
            );
        }

        return response()->json([
            'message' => 'Einstellungen erfolgreich gespeichert.',
            'settings' => $updated,
        ]);
    }

    public function questions(Request $request): JsonResponse
    {
        $questions = ProductQuestion::query()
            ->with(['product:id,name,slug', 'user:id,name'])
            ->when($request->boolean('unanswered'), fn ($q) => $q->whereNull('answer'))
            ->latest()
            ->paginate((int) $request->input('per_page', 20));

        return response()->json(['data' => $questions]);
    }

    public function answerQuestion(AnswerQuestionRequest $request, ProductQuestion $question): JsonResponse
    {
        $question->update([
            'answer' => $request->answer,
            'answered_by' => $request->user()->id,
            'answered_at' => now(),
            'is_public' => $request->boolean('is_public', true),
        ]);

        return response()->json([
            'message' => 'Frage erfolgreich beantwortet.',
            'question' => $question->fresh()->load(['product', 'user', 'answeredBy']),
        ]);
    }
}
