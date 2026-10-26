<script setup lang="ts">
import { Head, useForm } from '@inertiajs/vue3';

const form = useForm({ email: '', password: '', remember: false });

function submit() {
    form.post('/login', { onFinish: () => form.reset('password') });
}
</script>

<template>
    <Head title="Sign in" />
    <div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-white via-[#f3faf8] to-[#e6f5f0] p-4">
        <form class="card w-full max-w-sm space-y-4 p-7" @submit.prevent="submit">
            <div class="flex items-center gap-2.5">
                <svg viewBox="0 0 32 32" class="h-8 w-8"><path d="M3 27V5l13 12L29 5v22h-6V16l-7 7-7-7v11z" fill="#14a07c" /><path d="M3 5l13 12v6L3 11z" fill="#0c6f57" /></svg>
                <div class="leading-tight">
                    <div class="text-lg font-bold">Momentix</div>
                    <div class="text-xs text-slate-500">Platform Control Center</div>
                </div>
            </div>
            <label class="block text-sm font-medium">
                Email
                <input v-model="form.email" type="email" autocomplete="username" class="input mt-1.5" required autofocus />
                <span v-if="form.errors.email" class="mt-1 block text-xs text-red-600">{{ form.errors.email }}</span>
            </label>
            <label class="block text-sm font-medium">
                Password
                <input v-model="form.password" type="password" autocomplete="current-password" class="input mt-1.5" required />
            </label>
            <label class="flex items-center gap-2 text-sm text-slate-600">
                <input v-model="form.remember" type="checkbox" class="accent-brand-600" /> Remember me
            </label>
            <button type="submit" class="btn-primary w-full justify-center" :disabled="form.processing">Sign in</button>
        </form>
    </div>
</template>
