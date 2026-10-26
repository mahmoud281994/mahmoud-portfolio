<?php

namespace App\Http\Requests;

use App\Enums\WebsiteStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class WebsiteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('super-admin');
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'domain' => ['required', 'string', 'max:255', 'regex:/^(?!-)[a-z0-9-]+(\.[a-z0-9-]+)+$/i',
                Rule::unique('websites', 'domain')->ignore($this->route('website'))],
            'owner_id' => ['required', 'integer', 'exists:owners,id'],
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'status' => ['required', Rule::enum(WebsiteStatus::class)],
            'product_ids' => ['array'],
            'product_ids.*' => ['integer', 'distinct', 'exists:products,id'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge(['domain' => strtolower(trim((string) $this->input('domain')))]);
    }
}
