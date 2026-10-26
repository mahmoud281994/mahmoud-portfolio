<script setup lang="ts">
import { Link, router, usePage } from '@inertiajs/vue3';
import {
    Activity, BarChart3, Bell, Box, ChevronDown, ChevronRight, CircleHelp, Database, FileText, Globe, Home,
    List, LogOut, Monitor, Search, Settings, Tag, UserPlus, Users, X, Zap,
} from 'lucide-vue-next';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import Avatar from '@/components/Avatar.vue';
import type { SharedProps } from '@/types';

const page = usePage<SharedProps>();
const user = computed(() => page.props.auth.user);
const flash = computed(() => page.props.flash);

const groups = [
    { title: 'Overview', items: [{ label: 'Dashboard', href: '/', icon: Home }] },
    { title: 'Websites', items: [{ label: 'Websites', href: '/websites', icon: Globe }] },
    {
        title: 'Owners & Invitations',
        items: [
            { label: 'Owners', href: '/owners', icon: Users },
            { label: 'Invitations', href: '/invitations', icon: UserPlus },
        ],
    },
    { title: 'Categories', items: [{ label: 'Categories', href: '/categories', icon: Tag }] },
    { title: 'Capabilities', items: [{ label: 'Capabilities', href: '/capabilities', icon: Zap }] },
    { title: 'Product Enablement', items: [{ label: 'Products & Modules', href: '/products', icon: Box }] },
    { title: 'Themes & Templates', items: [{ label: 'Themes & Templates', href: '/themes', icon: Monitor }] },
    { title: 'Analytics', items: [{ label: 'Platform Analytics', href: '/analytics', icon: BarChart3 }] },
    { title: 'Activity Center', items: [{ label: 'Activity Feed', href: '/activity', icon: List }] },
    { title: 'Security & Audit', items: [{ label: 'Audit Logs', href: '/audit-logs', icon: FileText }] },
    { title: 'System Health', items: [{ label: 'System Health', href: '/system-health', icon: Activity }] },
    { title: 'Backups & Recovery', items: [{ label: 'Backups & Recovery', href: '/backups', icon: Database }] },
    { title: 'Settings', items: [{ label: 'Platform Settings', href: '/settings', icon: Settings }] },
];

const isActive = (href: string) => {
    const path = page.url.split('?')[0];
    return href === '/' ? path === '/' : path.startsWith(href);
};

const search = ref('');
const searchInput = ref<HTMLInputElement>();
const userMenu = ref(false);
const dismissed = ref(false);

function submitSearch() {
    router.get('/websites', search.value ? { search: search.value } : {});
}

function onKey(e: KeyboardEvent) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInput.value?.focus();
    }
}

onMounted(() => window.addEventListener('keydown', onKey));
onBeforeUnmount(() => window.removeEventListener('keydown', onKey));
router.on('navigate', () => (dismissed.value = false));
</script>

<template>
    <div class="flex min-h-screen">
        <aside class="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-slate-200/80 bg-white lg:flex">
            <Link href="/" class="flex items-center gap-2.5 px-6 pt-4 pb-5">
                <svg viewBox="0 0 32 32" class="h-8 w-8"><path d="M3 27V5l13 12L29 5v22h-6V16l-7 7-7-7v11z" fill="#14a07c" /><path d="M3 5l13 12v6L3 11z" fill="#0c6f57" /></svg>
                <span class="leading-tight">
                    <span class="block text-lg font-bold">Momentix</span>
                    <span class="block text-xs text-slate-500">Platform Control Center</span>
                </span>
            </Link>
            <nav class="flex-1 space-y-3 overflow-y-auto px-4 pb-4">
                <div v-for="group in groups" :key="group.title">
                    <div class="px-2 pb-1 text-[10px] font-semibold tracking-wider text-slate-500 uppercase">{{ group.title }}</div>
                    <Link
                        v-for="item in group.items"
                        :key="item.href"
                        :href="item.href"
                        :class="isActive(item.href) ? 'bg-brand-50 font-semibold text-brand-700' : 'text-slate-700 hover:bg-slate-50'"
                        class="relative flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm"
                    >
                        <span v-if="isActive(item.href)" class="absolute top-0 -left-4 h-full w-1 rounded-r bg-brand-600" />
                        <component :is="item.icon" class="h-4 w-4" />
                        {{ item.label }}
                    </Link>
                </div>
            </nav>
            <div v-if="user" class="flex items-center gap-3 border-t border-slate-200/80 px-5 py-3">
                <Avatar :name="user.name" />
                <div class="min-w-0 flex-1 text-xs">
                    <div class="truncate text-sm font-semibold">{{ user.name }}</div>
                    <div class="truncate text-slate-500">{{ user.email }}</div>
                </div>
                <ChevronRight class="h-4 w-4 text-slate-400" />
            </div>
        </aside>

        <div class="min-w-0 flex-1">
            <header class="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-slate-200/80 bg-white/90 px-6 backdrop-blur">
                <form class="relative max-w-2xl flex-1" @submit.prevent="submitSearch">
                    <Search class="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <input
                        ref="searchInput"
                        v-model="search"
                        type="search"
                        placeholder="Search websites, owners, categories, products, or anything..."
                        class="input border-transparent bg-slate-100/80 pr-16 pl-9"
                    />
                    <kbd class="absolute top-1/2 right-3 -translate-y-1/2 rounded border border-slate-200 bg-white px-1.5 text-[10px] text-slate-500">Ctrl K</kbd>
                </form>
                <div class="ml-auto flex items-center gap-4">
                    <span class="hidden items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-semibold capitalize sm:inline-flex">
                        <span class="h-2 w-2 rounded-full" :class="page.props.environment === 'production' ? 'bg-emerald-500' : 'bg-amber-500'" />
                        {{ page.props.environment }}
                    </span>
                    <Link href="/activity" class="relative rounded-full p-1.5 hover:bg-slate-100" aria-label="Notifications">
                        <Bell class="h-5 w-5 text-slate-600" />
                        <span v-if="page.props.alertsCount" class="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">{{ page.props.alertsCount }}</span>
                    </Link>
                    <button class="rounded-full p-1.5 hover:bg-slate-100" aria-label="Help"><CircleHelp class="h-5 w-5 text-slate-600" /></button>
                    <div v-if="user" class="relative border-l border-slate-200 pl-4">
                        <button class="flex items-center gap-3" @click="userMenu = !userMenu">
                            <Avatar :name="user.name" size="lg" />
                            <span class="hidden text-left leading-tight md:block">
                                <span class="block text-sm font-semibold">{{ user.name }}</span>
                                <span class="block text-xs text-slate-500">Platform Administrator</span>
                            </span>
                            <ChevronDown class="h-4 w-4 text-slate-500" />
                        </button>
                        <div v-if="userMenu" class="absolute right-0 mt-2 w-44 rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                            <Link href="/settings" class="flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50"><Settings class="h-4 w-4" /> Settings</Link>
                            <Link href="/logout" method="post" as="button" class="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"><LogOut class="h-4 w-4" /> Log out</Link>
                        </div>
                    </div>
                </div>
            </header>

            <div v-if="!dismissed && (flash.success || flash.error)" :class="flash.error ? 'border-red-200 bg-red-50 text-red-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'" class="mx-6 mt-4 flex items-center justify-between rounded-lg border px-4 py-2.5 text-sm">
                {{ flash.error ?? flash.success }}
                <button @click="dismissed = true"><X class="h-4 w-4" /></button>
            </div>

            <main class="p-6">
                <slot />
            </main>
        </div>
    </div>
</template>
