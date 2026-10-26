<script setup lang="ts">
import { Link, router } from '@inertiajs/vue3';
import { MoreHorizontal } from 'lucide-vue-next';
import { ref } from 'vue';
import Avatar from '@/components/Avatar.vue';
import CategoryBadge from '@/components/CategoryBadge.vue';
import StatusBadge from '@/components/StatusBadge.vue';
import type { WebsiteRow } from '@/types';

defineProps<{ websites: WebsiteRow[] }>();

const openMenu = ref<number | null>(null);
const tones = ['bg-blue-50 text-blue-600', 'bg-emerald-50 text-emerald-600', 'bg-orange-50 text-orange-600', 'bg-violet-50 text-violet-600'];

function remove(website: WebsiteRow) {
    openMenu.value = null;
    if (confirm(`Delete ${website.name}? This cannot be undone.`)) {
        router.delete(`/websites/${website.id}`, { preserveScroll: true });
    }
}
</script>

<template>
    <div class="overflow-x-auto">
        <table class="w-full min-w-[960px] text-left text-sm">
            <thead class="border-b border-slate-100 text-xs font-semibold text-slate-600">
                <tr>
                    <th class="py-2.5 pr-4 pl-3">Website</th>
                    <th class="px-4">Owner</th>
                    <th class="px-4">Category</th>
                    <th class="px-4">Status</th>
                    <th class="px-4">Products</th>
                    <th class="px-4">Last Updated</th>
                    <th class="px-4 text-right">Actions</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
                <tr v-for="w in websites" :key="w.id" class="hover:bg-slate-50/60">
                    <td class="py-2.5 pr-4 pl-3">
                        <div class="flex items-center gap-3">
                            <span :class="tones[w.id % tones.length]" class="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold">{{ w.name[0] }}</span>
                            <div>
                                <div class="font-semibold">{{ w.name }}</div>
                                <div class="text-xs text-slate-500">{{ w.domain }}</div>
                            </div>
                        </div>
                    </td>
                    <td class="px-4">
                        <div class="flex items-center gap-3">
                            <Avatar :name="w.owner.name" size="sm" class="bg-slate-100! text-slate-700!" />
                            <div>
                                <div class="text-xs font-medium">{{ w.owner.name }}</div>
                                <div class="text-xs text-slate-500">{{ w.owner.email }}</div>
                            </div>
                        </div>
                    </td>
                    <td class="px-4"><CategoryBadge v-bind="w.category" /></td>
                    <td class="px-4"><StatusBadge :status="w.status" /></td>
                    <td class="px-4">
                        <div class="flex flex-wrap gap-1.5">
                            <span v-for="p in w.products.slice(0, 2)" :key="p" class="rounded-full border border-slate-200 px-2.5 py-1 text-xs whitespace-nowrap text-slate-600">{{ p }}</span>
                            <span v-if="w.products.length > 2" class="rounded-full border border-slate-200 px-2 py-1 text-xs text-slate-600">+{{ w.products.length - 2 }}</span>
                            <span v-if="!w.products.length" class="text-xs text-slate-400">—</span>
                        </div>
                    </td>
                    <td class="px-4 text-xs">
                        <div class="font-medium">{{ w.updated_human }}</div>
                        <div class="text-slate-500">{{ w.updated_at }}</div>
                    </td>
                    <td class="relative px-4 text-right">
                        <button class="rounded p-1 hover:bg-slate-100" @click="openMenu = openMenu === w.id ? null : w.id">
                            <MoreHorizontal class="h-4 w-4" />
                        </button>
                        <div v-if="openMenu === w.id" class="absolute top-9 right-4 z-20 w-32 rounded-lg border border-slate-200 bg-white py-1 text-left text-sm shadow-lg">
                            <Link :href="`/websites/${w.id}/edit`" class="block px-3 py-1.5 hover:bg-slate-50">Edit</Link>
                            <button class="block w-full px-3 py-1.5 text-left text-red-600 hover:bg-red-50" @click="remove(w)">Delete</button>
                        </div>
                    </td>
                </tr>
                <tr v-if="!websites.length">
                    <td colspan="7" class="py-10 text-center text-sm text-slate-500">No websites found.</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
