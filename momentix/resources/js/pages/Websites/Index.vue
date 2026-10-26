<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { Plus } from 'lucide-vue-next';
import WebsiteFilters from '@/components/WebsiteFilters.vue';
import WebsitesTable from '@/components/WebsitesTable.vue';
import type { Filters, Option, WebsiteRow } from '@/types';

defineProps<{
    websites: { data: WebsiteRow[]; links: { url: string | null; label: string; active: boolean }[]; total: number; from: number | null; to: number | null };
    categories: Option[];
    filters: Filters;
}>();
</script>

<template>
    <Head title="Websites" />
    <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
            <h1 class="text-2xl font-bold">Websites</h1>
            <p class="text-sm text-slate-500">All websites across the Momentix platform.</p>
        </div>
        <Link href="/websites/create" class="btn-primary"><Plus class="h-4 w-4" /> Create Website</Link>
    </div>

    <div class="card mt-5 p-5">
        <WebsiteFilters :filters="filters" :categories="categories" />
        <WebsitesTable :websites="websites.data" class="mt-4" />
        <div v-if="websites.total" class="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
            <span>Showing {{ websites.from }}–{{ websites.to }} of {{ websites.total }}</span>
            <div class="flex gap-1">
                <template v-for="link in websites.links" :key="link.label">
                    <Link v-if="link.url" :href="link.url" preserve-scroll :class="link.active ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-200 hover:bg-slate-50'" class="rounded-md border px-3 py-1" v-html="link.label" />
                    <span v-else class="rounded-md border border-slate-100 px-3 py-1 text-slate-300" v-html="link.label" />
                </template>
            </div>
        </div>
    </div>
</template>
