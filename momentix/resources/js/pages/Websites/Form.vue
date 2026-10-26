<script setup lang="ts">
import { Head, Link, useForm } from '@inertiajs/vue3';
import { ArrowLeft } from 'lucide-vue-next';
import type { Option } from '@/types';

const props = defineProps<{
    website?: { id: number; name: string; domain: string; owner_id: number; category_id: number; status: string; product_ids: number[] };
    owners: (Option & { email: string })[];
    categories: Option[];
    products: Option[];
    statuses: { value: string; label: string }[];
}>();

const form = useForm({
    name: props.website?.name ?? '',
    domain: props.website?.domain ?? '',
    owner_id: props.website?.owner_id ?? '',
    category_id: props.website?.category_id ?? '',
    status: props.website?.status ?? 'draft',
    product_ids: props.website?.product_ids ?? ([] as number[]),
});

function submit() {
    if (props.website) {
        form.put(`/websites/${props.website.id}`);
    } else {
        form.post('/websites');
    }
}
</script>

<template>
    <Head :title="website ? 'Edit Website' : 'Create Website'" />
    <Link href="/websites" class="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-brand-700"><ArrowLeft class="h-4 w-4" /> Websites</Link>
    <h1 class="mt-2 text-2xl font-bold">{{ website ? `Edit ${website.name}` : 'Create Website' }}</h1>

    <form class="card mt-5 max-w-3xl space-y-5 p-6" @submit.prevent="submit">
        <div class="grid gap-5 sm:grid-cols-2">
            <label class="block text-sm font-medium">
                Name
                <input v-model="form.name" class="input mt-1.5" required />
                <span v-if="form.errors.name" class="mt-1 block text-xs text-red-600">{{ form.errors.name }}</span>
            </label>
            <label class="block text-sm font-medium">
                Domain
                <input v-model="form.domain" class="input mt-1.5" placeholder="example.com" required />
                <span v-if="form.errors.domain" class="mt-1 block text-xs text-red-600">{{ form.errors.domain }}</span>
            </label>
            <label class="block text-sm font-medium">
                Owner
                <select v-model="form.owner_id" class="input mt-1.5" required>
                    <option value="" disabled>Select owner</option>
                    <option v-for="o in owners" :key="o.id" :value="o.id">{{ o.name }} ({{ o.email }})</option>
                </select>
                <span v-if="form.errors.owner_id" class="mt-1 block text-xs text-red-600">{{ form.errors.owner_id }}</span>
            </label>
            <label class="block text-sm font-medium">
                Category
                <select v-model="form.category_id" class="input mt-1.5" required>
                    <option value="" disabled>Select category</option>
                    <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
                </select>
                <span v-if="form.errors.category_id" class="mt-1 block text-xs text-red-600">{{ form.errors.category_id }}</span>
            </label>
            <label class="block text-sm font-medium">
                Status
                <select v-model="form.status" class="input mt-1.5">
                    <option v-for="s in statuses" :key="s.value" :value="s.value">{{ s.label }}</option>
                </select>
                <span v-if="form.errors.status" class="mt-1 block text-xs text-red-600">{{ form.errors.status }}</span>
            </label>
        </div>

        <fieldset>
            <legend class="text-sm font-medium">Products</legend>
            <div class="mt-2 flex flex-wrap gap-2">
                <label v-for="p in products" :key="p.id" :class="form.product_ids.includes(p.id) ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200'" class="flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-sm">
                    <input v-model="form.product_ids" type="checkbox" :value="p.id" class="accent-brand-600" />
                    {{ p.name }}
                </label>
            </div>
            <span v-if="form.errors.product_ids" class="mt-1 block text-xs text-red-600">{{ form.errors.product_ids }}</span>
        </fieldset>

        <div class="flex justify-end gap-3 border-t border-slate-100 pt-5">
            <Link href="/websites" class="btn-outline">Cancel</Link>
            <button type="submit" class="btn-primary" :disabled="form.processing">{{ website ? 'Save Changes' : 'Create Website' }}</button>
        </div>
    </form>
</template>
