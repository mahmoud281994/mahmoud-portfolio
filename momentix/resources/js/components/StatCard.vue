<script setup lang="ts">
import type { Component } from 'vue';
import Trend from '@/components/Trend.vue';

defineProps<{ label: string; value: number | string; change?: number; icon: Component; tone: string; footnote?: string }>();

const tones: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    red: 'bg-red-50 text-red-600',
    violet: 'bg-violet-50 text-violet-600',
    sky: 'bg-sky-50 text-sky-600',
    teal: 'bg-teal-50 text-teal-600',
};
</script>

<template>
    <div class="card flex gap-3 p-4">
        <span :class="tones[tone]" class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl">
            <component :is="icon" class="h-5 w-5" />
        </span>
        <div class="min-w-0">
            <div class="text-xs leading-tight font-medium text-slate-600">{{ label }}</div>
            <div class="mt-1.5 text-2xl font-bold tracking-tight">{{ value }}</div>
            <Trend v-if="change !== undefined" :change="change" class="mt-1" />
            <div v-if="footnote" class="mt-1 text-xs text-slate-500">{{ footnote }}</div>
        </div>
    </div>
</template>
