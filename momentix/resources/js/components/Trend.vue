<script setup lang="ts">
import { ArrowDown, ArrowUp } from 'lucide-vue-next';

defineProps<{ change: number; label?: string }>();
</script>

<template>
    <div class="text-xs">
        <span :class="change >= 0 ? 'text-emerald-600' : 'text-red-600'" class="inline-flex items-center gap-0.5 font-semibold">
            <component :is="change >= 0 ? ArrowUp : ArrowDown" class="h-3 w-3" stroke-width="2.5" />
            {{ change >= 0 ? '+' : '' }}{{ change }}%
        </span>
        <div v-if="label !== ''" class="mt-0.5 text-slate-500">{{ label ?? 'vs last 30 days' }}</div>
    </div>
</template>
