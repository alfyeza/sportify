"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboardRedirect() {
    const router = useRouter();

    useEffect(() => {
        router.replace("/mitra/dashboard");
    }, [router]);

    return null;
}