export type Metric = { value: number; change: number };

export type WebsiteRow = {
    id: number;
    name: string;
    domain: string;
    status: 'draft' | 'published' | 'suspended' | 'archived';
    owner: { name: string; email: string };
    category: { name: string; color: string };
    products: string[];
    updated_human: string;
    updated_at: string;
};

export type Option = { id: number; name: string };

export type Filters = { search?: string; category?: string; status?: string };

export type SharedProps = {
    auth: { user: { id: number; name: string; email: string } | null };
    environment: string;
    alertsCount: number;
    flash: { success: string | null; error: string | null };
};
