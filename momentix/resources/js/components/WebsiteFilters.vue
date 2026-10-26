<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import { Download, Search } from 'lucide-vue-next';
import { computed, reactive, watch } from 'vue';
import type { Filters, Option } from '@/types';

const props = defineProps<{ filters: Filters; categories: Option[]; only?: string[] }>();

const form = reactive({
    search: props.filters.search ?? '',
    category: props.filters.category ?? '',
    status: props.filters.status ?? '',
});

const query = computed(() => Object.fromEntries(Object.entries(form).filter(([, v]) => v !== '')));
const exportUrl = computed(() => `/websites/export?${new URLSearchParams(query.value)}`);

let timer: ReturnType<typeof setTimeout>;
watch(form, () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
        router.get(window.location.pathname, query.value, { only: props.only, preserveState: true, preserveScroll: true, replace: true });
    }, 300);
});
</script>

<template>
    <div class="flex flex-wrap items-center gap-2">
        <label class="relative">
            <Search class="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input v-model="form.search" type="search" placeholder="Search websites..." class="input w-56 pl-9" />
        </label>
        <select v-model="form.category" class="input w-44">
            <option value="">All Categories</option>
            <option v-for="c in categories" :key="c.id" :value="String(c.id)">{{ c.name }}</option>
        </select>
        <select v-model="form.status" class="input w-36">
            <option value="">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="suspended">Suspended</option>
            <option value="archived">Archived</option>
        </select>
        <a :href="exportUrl" class="btn-outline py-2"><Download class="h-4 w-4" /> Export</a>
    </div>
</template>
