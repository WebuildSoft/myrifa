"use strict";

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Search, Filter } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/use-debounce";

export function BuyerFilters() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const currentSearch = searchParams.get('search') || '';
    const currentFilter = searchParams.get('filter') || 'all';

    const [searchTerm, setSearchTerm] = useState(currentSearch);
    const debouncedSearchTerm = useDebounce(searchTerm, 400);

    const createQueryString = useCallback(
        (params: Record<string, string | null>) => {
            const newSearchParams = new URLSearchParams(searchParams.toString());

            for (const [key, value] of Object.entries(params)) {
                if (value === null || value === '' || (key === 'filter' && value === 'all')) {
                    newSearchParams.delete(key);
                } else {
                    newSearchParams.set(key, value);
                }
            }

            return newSearchParams.toString();
        },
        [searchParams]
    );

    useEffect(() => {
        const query = createQueryString({ search: debouncedSearchTerm });
        if (searchParams.get('search') !== debouncedSearchTerm) {
            replace(`${pathname}?${query}`);
        }
    }, [debouncedSearchTerm, createQueryString, pathname, replace, searchParams]);

    const handleFilterChange = (filter: string) => {
        const query = createQueryString({ filter });
        replace(`${pathname}?${query}`);
    };

    const filters = [
        { label: 'Todos', value: 'all' },
        { label: 'Pagos', value: 'paid' },
        { label: 'Pendentes', value: 'pending' },
        { label: 'Expirados', value: 'expired' },
    ];

    return (
        <div className="space-y-6">
            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                <Input
                    placeholder="Buscar por nome ou telefone..."
                    className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-2xl py-6 pl-12 pr-4 focus-visible:ring-2 focus-visible:ring-primary/50 text-sm font-medium shadow-sm transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Filter Chips */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
                {filters.map((f) => (
                    <Button
                        key={f.value}
                        variant={currentFilter === f.value ? "default" : "outline"}
                        onClick={() => handleFilterChange(f.value)}
                        className={`rounded-full h-9 px-6 text-xs font-black uppercase tracking-widest transition-all ${currentFilter === f.value
                                ? "shadow-lg shadow-primary/20"
                                : "bg-white dark:bg-slate-800 border-primary/5 hover:bg-primary/5"
                            }`}
                    >
                        {f.label}
                    </Button>
                ))}
            </div>
        </div>
    );
}
