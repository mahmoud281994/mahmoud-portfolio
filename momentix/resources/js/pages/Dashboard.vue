<script setup lang="ts">
import { Head, Link, router } from '@inertiajs/vue3';
import {
    Activity, AlertTriangle, ArrowRight, BarChart3, Box, ChevronRight, Clock, Database, FileCheck, FileText, Globe,
    HardDrive, Layers, Mail, PauseCircle, PenLine, Plus, PlusCircle, ShieldCheck, ShieldAlert, Tag, UserPlus, Users,
} from 'lucide-vue-next';
import { ref, type Component } from 'vue';
import StatCard from '@/components/StatCard.vue';
import Trend from '@/components/Trend.vue';
import WebsiteFilters from '@/components/WebsiteFilters.vue';
import WebsitesTable from '@/components/WebsitesTable.vue';
import type { Filters, Metric, Option, WebsiteRow } from '@/types';

defineProps<{
    stats: Record<'total' | 'published' | 'draft' | 'suspended' | 'pendingOwners' | 'activeProducts' | 'criticalAlerts', Metric> & {
        growth: { change: number; previous: number; current: number };
    };
    funnel: { status: string; label: string; count: number; percent: number }[];
    health: { key: string; name: string; healthy: boolean; detail: string }[];
    activity: { id: number; event: string; level: string; description: string; subject: string | null; time: string }[];
    governance: {
        auditEvents: Metric;
        failedLogins: Metric;
        permissionChanges: Metric;
        backups: { healthy: boolean; successRate: number | null };
    };
    insights: {
        topCategory: { name: string; count: number } | null;
        topProduct: { name: string; count: number } | null;
        fastestGrowth: { name: string; change: number } | null;
    };
    websites: WebsiteRow[];
    categories: Option[];
    filters: Filters;
}>();

const funnelColors: Record<string, string> = {
    draft: 'bg-blue-500',
    published: 'bg-emerald-500/80',
    suspended: 'bg-orange-400',
    archived: 'bg-slate-300',
};
const healthIcons: Record<string, Component> = { queue: Layers, mail: Mail, storage: HardDrive, scheduler: Clock, backups: FileText };
const activityIcons: Record<string, [Component, string]> = {
    'website.created': [PlusCircle, 'bg-emerald-50 text-emerald-600'],
    'owner.invited': [Users, 'bg-red-50 text-red-500'],
    'website.published': [FileCheck, 'bg-emerald-50 text-emerald-600'],
    'module.activated': [Box, 'bg-violet-50 text-violet-600'],
    'auth.login': [ShieldCheck, 'bg-blue-50 text-blue-600'],
};
const activityIcon = (event: string, level: string): [Component, string] =>
    activityIcons[event] ?? (level === 'critical' ? [ShieldAlert, 'bg-red-50 text-red-600'] : [Activity, 'bg-slate-100 text-slate-600']);

const checking = ref(false);
function runHealthCheck() {
    router.post('/health-check', {}, {
        preserveScroll: true,
        onStart: () => (checking.value = true),
        onFinish: () => (checking.value = false),
    });
}
</script>

<template>
    <Head title="Dashboard" />

    <section class="relative -mx-6 -mt-6 overflow-hidden bg-gradient-to-br from-white via-[#f3faf8] to-[#e6f5f0] px-9 pt-5 pb-6">
        <div class="relative z-10 max-w-xl">
            <div class="text-xs font-semibold tracking-wide text-slate-600 uppercase">{{ $page.props.environment }} Platform Control</div>
            <h1 class="mt-2 text-4xl font-extrabold tracking-tight">Super Admin</h1>
            <p class="mt-3 text-[15px] leading-relaxed text-slate-600">Manage websites, owners, products, governance, and operations across the entire Momentix platform.</p>
            <div class="mt-5 flex flex-wrap gap-3">
                <Link href="/websites/create" class="btn-primary"><Plus class="h-4 w-4" /> Create Website <ArrowRight class="h-4 w-4" /></Link>
                <Link href="/invitations" class="btn-outline"><UserPlus class="h-4 w-4" /> Invite Owner <ChevronRight class="h-4 w-4" /></Link>
                <button class="btn-outline" :disabled="checking" @click="runHealthCheck"><Activity class="h-4 w-4" /> {{ checking ? 'Checking…' : 'Run Health Check' }}</button>
            </div>
        </div>
        <div class="absolute top-16 right-[26rem] z-10 hidden max-w-56 xl:block">
            <p class="text-sm font-semibold">A secure, scalable platform for modern digital businesses.</p>
            <p class="mt-3 text-sm text-slate-600">Empower creators. Enable growth. Maintain control.</p>
        </div>
        <div aria-hidden="true" class="absolute top-2 right-12 hidden h-56 w-80 [perspective:900px] lg:block">
            <div class="absolute inset-0 [transform:rotateX(55deg)_rotateZ(-38deg)] [transform-style:preserve-3d]">
                <div v-for="(card, i) in [0, 1, 2, 3]" :key="card"
                    :style="{ transform: `translate(${i * 38}px, ${i * -14}px) translateZ(${i * 26}px)` }"
                    class="absolute top-16 left-10 h-36 w-28 rounded-xl border border-white/80 bg-gradient-to-br from-white to-emerald-50 p-3 shadow-[0_18px_40px_-12px_rgba(12,111,87,0.35)]">
                    <div class="h-2 w-10 rounded bg-emerald-400/70" />
                    <div class="mt-3 space-y-1.5"><div class="h-1.5 rounded bg-slate-200" /><div class="h-1.5 w-3/4 rounded bg-slate-200" /><div class="h-1.5 w-1/2 rounded bg-slate-200" /></div>
                    <div class="mt-4 h-8 rounded-md bg-emerald-100" />
                </div>
                <div class="absolute top-44 left-40 h-10 w-12 [transform:translateZ(110px)] rounded-lg bg-gradient-to-br from-emerald-400 to-brand-700 shadow-xl" />
            </div>
        </div>
    </section>

    <div class="mt-1 grid grid-cols-2 gap-3 md:grid-cols-4 2xl:grid-cols-8">
        <StatCard label="Total Websites" :value="stats.total.value" :change="stats.total.change" :icon="Globe" tone="blue" />
        <StatCard label="Published" :value="stats.published.value" :change="stats.published.change" :icon="FileCheck" tone="green" />
        <StatCard label="Draft" :value="stats.draft.value" :change="stats.draft.change" :icon="PenLine" tone="amber" />
        <StatCard label="Suspended" :value="stats.suspended.value" :change="stats.suspended.change" :icon="PauseCircle" tone="red" />
        <StatCard label="Owners Pending Invite" :value="stats.pendingOwners.value" :change="stats.pendingOwners.change" :icon="Users" tone="violet" />
        <StatCard label="Optional Products Active" :value="stats.activeProducts.value" :change="stats.activeProducts.change" :icon="Box" tone="sky" />
        <StatCard label="Critical Alerts" :value="stats.criticalAlerts.value" :change="stats.criticalAlerts.change" :icon="AlertTriangle" tone="red" />
        <StatCard label="30d Growth (Website Signups)" :value="`${stats.growth.change >= 0 ? '+' : ''}${stats.growth.change}%`" :icon="BarChart3" tone="teal" :footnote="`${stats.growth.previous} → ${stats.growth.current}`" />
    </div>

    <div class="mt-4 grid gap-4 xl:grid-cols-3">
        <div class="card p-5">
            <div class="flex items-center justify-between">
                <h2 class="font-bold">Website Lifecycle Funnel</h2>
                <Link href="/websites" class="flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-brand-700">View all <ArrowRight class="h-3.5 w-3.5" /></Link>
            </div>
            <div class="mt-5 space-y-5">
                <Link v-for="row in funnel" :key="row.status" :href="`/websites?status=${row.status}`" class="grid grid-cols-[6rem_1fr_2rem_2.5rem] items-center gap-3 text-sm">
                    <span class="flex items-center gap-2"><span :class="funnelColors[row.status]" class="h-2 w-2 rounded-full" />{{ row.label }}</span>
                    <span class="h-5 overflow-hidden rounded bg-slate-100"><span :class="funnelColors[row.status]" class="block h-full rounded" :style="{ width: `${row.percent}%` }" /></span>
                    <span class="text-right font-semibold">{{ row.count }}</span>
                    <span class="text-right text-slate-500">{{ row.percent }}%</span>
                </Link>
            </div>
        </div>

        <div class="card p-5">
            <div class="flex items-center justify-between">
                <h2 class="font-bold">Operational Health</h2>
                <span v-if="health.every((h) => h.healthy)" class="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700"><span class="h-2 w-2 rounded-full bg-emerald-500" />All Systems Operational</span>
                <span v-else class="flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700"><span class="h-2 w-2 rounded-full bg-amber-500" />Attention Needed</span>
            </div>
            <ul class="mt-3 divide-y divide-slate-100">
                <li v-for="check in health" :key="check.key" class="grid grid-cols-[1.5rem_7rem_6rem_1fr] items-center gap-2 py-2.5 text-sm">
                    <component :is="healthIcons[check.key]" class="h-4 w-4 text-blue-600" />
                    <span>{{ check.name }}</span>
                    <span :class="check.healthy ? 'text-emerald-700' : 'text-amber-700'" class="flex items-center gap-1.5 font-medium">
                        <span :class="check.healthy ? 'bg-emerald-500' : 'bg-amber-500'" class="h-2 w-2 rounded-full" />{{ check.healthy ? 'Healthy' : 'Warning' }}
                    </span>
                    <span class="truncate text-xs text-slate-500">{{ check.detail }}</span>
                </li>
            </ul>
        </div>

        <div class="card p-5">
            <div class="flex items-center justify-between">
                <h2 class="font-bold">Recent Activity</h2>
                <Link href="/activity" class="flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-brand-700">View all <ArrowRight class="h-3.5 w-3.5" /></Link>
            </div>
            <ul class="mt-3 space-y-3">
                <li v-for="item in activity" :key="item.id" class="flex items-start gap-3 text-sm">
                    <span :class="activityIcon(item.event, item.level)[1]" class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                        <component :is="activityIcon(item.event, item.level)[0]" class="h-4 w-4" />
                    </span>
                    <div class="min-w-0 flex-1">
                        <div class="font-medium">{{ item.description }}</div>
                        <div class="truncate text-xs text-slate-500">{{ item.subject }}</div>
                    </div>
                    <span class="shrink-0 text-xs text-slate-500">{{ item.time }}</span>
                </li>
            </ul>
        </div>
    </div>

    <div class="mt-4 grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <div class="card p-5">
            <div class="flex items-center justify-between">
                <h2 class="font-bold">Governance &amp; Security</h2>
                <Link href="/audit-logs" class="flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-brand-700">View details <ArrowRight class="h-3.5 w-3.5" /></Link>
            </div>
            <div class="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div class="flex gap-3 rounded-lg bg-emerald-50/70 p-3">
                    <FileText class="mt-1 h-5 w-5 shrink-0 text-emerald-600" />
                    <div><div class="text-lg font-bold">{{ governance.auditEvents.value.toLocaleString() }}</div><div class="text-xs text-slate-600">Audit Events</div><Trend :change="governance.auditEvents.change" label="last 30 days" class="mt-0.5" /></div>
                </div>
                <div class="flex gap-3 rounded-lg bg-red-50/70 p-3">
                    <ShieldAlert class="mt-1 h-5 w-5 shrink-0 text-red-500" />
                    <div><div class="text-lg font-bold">{{ governance.failedLogins.value }}</div><div class="text-xs text-slate-600">Failed Logins</div><Trend :change="governance.failedLogins.change" label="last 30 days" class="mt-0.5" /></div>
                </div>
                <div class="flex gap-3 rounded-lg bg-violet-50/70 p-3">
                    <Users class="mt-1 h-5 w-5 shrink-0 text-violet-600" />
                    <div><div class="text-lg font-bold">{{ governance.permissionChanges.value }}</div><div class="text-xs text-slate-600">Permission Changes</div><Trend :change="governance.permissionChanges.change" label="last 30 days" class="mt-0.5" /></div>
                </div>
                <div class="flex gap-3 rounded-lg p-3" :class="governance.backups.healthy ? 'bg-emerald-50/70' : 'bg-amber-50/70'">
                    <Database class="mt-1 h-5 w-5 shrink-0" :class="governance.backups.healthy ? 'text-emerald-600' : 'text-amber-600'" />
                    <div>
                        <div class="text-sm font-bold" :class="governance.backups.healthy ? 'text-emerald-700' : 'text-amber-700'">{{ governance.backups.healthy ? 'Backups Healthy' : 'Backups Need Attention' }}</div>
                        <div class="mt-1 text-xs font-semibold" :class="governance.backups.healthy ? 'text-emerald-600' : 'text-amber-600'">{{ governance.backups.successRate ?? 0 }}% successful</div>
                        <div class="text-xs text-slate-500">last 30 days</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="card p-5">
            <div class="flex items-center justify-between">
                <h2 class="font-bold">Platform Insights</h2>
                <Link href="/analytics" class="flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-brand-700">View analytics <ArrowRight class="h-3.5 w-3.5" /></Link>
            </div>
            <div class="mt-4 grid gap-3 sm:grid-cols-3">
                <div class="flex gap-3 rounded-lg bg-slate-50 p-3">
                    <Tag class="mt-1 h-5 w-5 shrink-0 text-violet-600" />
                    <div><div class="text-xs text-slate-500">Top Category</div><div class="text-sm font-bold">{{ insights.topCategory?.name ?? '—' }}</div><div class="text-xs text-slate-500">{{ insights.topCategory?.count ?? 0 }} websites</div></div>
                </div>
                <div class="flex gap-3 rounded-lg bg-slate-50 p-3">
                    <Box class="mt-1 h-5 w-5 shrink-0 text-blue-600" />
                    <div><div class="text-xs text-slate-500">Most Active Product</div><div class="text-sm font-bold">{{ insights.topProduct?.name ?? '—' }}</div><div class="text-xs text-slate-500">{{ insights.topProduct?.count ?? 0 }} websites</div></div>
                </div>
                <div class="flex gap-3 rounded-lg bg-slate-50 p-3">
                    <BarChart3 class="mt-1 h-5 w-5 shrink-0 text-teal-500" />
                    <div><div class="text-xs text-slate-500">Fastest Growth</div><div class="text-sm font-bold">{{ insights.fastestGrowth?.name ?? '—' }}</div><div class="text-xs font-semibold text-emerald-600">{{ (insights.fastestGrowth?.change ?? 0) >= 0 ? '+' : '' }}{{ insights.fastestGrowth?.change ?? 0 }}%</div></div>
                </div>
            </div>
        </div>
    </div>

    <div class="card mt-4 p-5">
        <div class="flex flex-wrap items-start justify-between gap-3">
            <div>
                <h2 class="font-bold">Websites at a glance</h2>
                <p class="text-xs text-slate-500">Recent websites across the platform. Manage, monitor, and take action.</p>
            </div>
            <WebsiteFilters :filters="filters" :categories="categories" :only="['websites', 'filters']" />
        </div>
        <WebsitesTable :websites="websites" class="mt-3" />
    </div>
</template>
