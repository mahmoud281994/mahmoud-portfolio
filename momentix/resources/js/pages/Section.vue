<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { Construction } from 'lucide-vue-next';

defineProps<{ title: string }>();
</script>

<template>
    <Head :title="title" />
    <h1 class="text-2xl font-bold">{{ title }}</h1>
    <div class="card mt-5 flex flex-col items-center px-6 py-16 text-center">
        <span class="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600"><Construction class="h-6 w-6" /></span>
        <h2 class="mt-4 font-semibold">{{ title }} is coming soon</h2>
        <p class="mt-1 max-w-sm text-sm text-slate-500">This module is not implemented yet.</p>
        <Link href="/" class="btn-outline mt-5">Back to Dashboard</Link>
    </div>
</template>
