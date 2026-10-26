<script setup lang="ts">
defineProps<{ name: string; color: string }>();

const styles: Record<string, string> = {
    violet: 'bg-violet-50 text-violet-700',
    sky: 'bg-sky-50 text-sky-700',
    amber: 'bg-amber-50 text-amber-700',
    pink: 'bg-pink-50 text-pink-700',
    emerald: 'bg-emerald-50 text-emerald-700',
    orange: 'bg-orange-50 text-orange-700',
    slate: 'bg-slate-100 text-slate-700',
};
</script>

<template>
    <span :class="styles[color] ?? styles.slate" class="inline-flex rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap">{{ name }}</span>
</template>
