// src/hooks/useAnalytics.js
"use client";
import { useState, useEffect, useCallback } from "react";

export function useAnalytics(initialParams = {}) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAnalytics = useCallback(async (params) => {
        setLoading(true);
        setError(null);

        try {
            // Construct Query String
            const searchParams = new URLSearchParams();

            Object.entries(params).forEach(([key, value]) => {
                if (value && value !== "All Departments" && value !== "overall") {
                    searchParams.append(key, value);
                }
            });

            // Special handling for filters to match Backend API expectations
            if (params.department && params.department !== "All Departments") {
                searchParams.set("scope", "department");
                searchParams.set("department", params.department);
            } else {
                searchParams.set("scope", "institution");
            }

            if (params.timePeriod && params.timePeriod !== "overall") {
                searchParams.set("period", params.timePeriod === "monthly" ? "month" : params.timePeriod);
            }

            // Handle Date Ranges
            if (params.timePeriod === "custom") {
                searchParams.set("period", "range");
                if (params.startDate) searchParams.set("from", params.startDate);
                if (params.endDate) searchParams.set("to", params.endDate);
            } else if (params.timePeriod === "today") {
                searchParams.set("period", "today");
            }

            const res = await fetch(`/api/analytics?${searchParams.toString()}`);
            const result = await res.json();

            if (!result.success) throw new Error(result.error || "Failed to fetch");

            setData(result);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial Fetch on Mount (optional, or triggered by component)
    useEffect(() => {
        if (Object.keys(initialParams).length > 0) {
            fetchAnalytics(initialParams);
        }
    }, []);

    return { data, loading, error, fetchAnalytics };
}