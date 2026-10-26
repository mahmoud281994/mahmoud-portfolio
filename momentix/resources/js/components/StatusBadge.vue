<script setup lang="ts">
import type { WebsiteRow } from '@/types';

defineProps<{ status: WebsiteRow['status'] }>();

const styles: Record<WebsiteRow['status'], string> = {
    published: 'bg-emerald-50 text-emerald-700 [--dot:var(--color-emerald-500)]',
    draft: 'bg-blue-50 text-blue-700 [--dot:var(--color-blue-500)]',
    suspended: 'bg-orange-50 text-orange-700 [--dot:var(--color-orange-500)]',
    archived: 'bg-slate-100 text-slate-600 [--dot:var(--color-slate-400)]',
};
</script>

<template>
    <span :class="styles[status]" class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium capitalize">
        <span class="h-1.5 w-1.5 rounded-full bg-(--dot)" />
        {{ status }}
    </span>
</template>
