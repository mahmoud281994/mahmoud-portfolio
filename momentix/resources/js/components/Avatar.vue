<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{ name: string; size?: 'sm' | 'md' | 'lg' }>(), { size: 'md' });

const initials = computed(() =>
    props.name
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join(''),
);
const sizes = { sm: 'h-8 w-8 text-xs', md: 'h-9 w-9 text-xs', lg: 'h-11 w-11 text-sm' };
</script>

<template>
    <span :class="[sizes[size]]" class="inline-flex shrink-0 items-center justify-center rounded-full bg-brand-700 font-semibold text-white">
        {{ initials }}
    </span>
</template>
