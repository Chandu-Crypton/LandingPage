import type { Metadata } from "next";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import React from "react";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import RecentOrders from "@/components/ecommerce/RecentOrders";
import RecentApplied from "@/components/ecommerce/RecentApplied";

export const metadata: Metadata = {
  title:
    "FTFL Landing Page",
  description: "This is Next.js Home for FTFL Landing Page",
};

export default function Ecommerce() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-12">
        <EcommerceMetrics />

        <MonthlySalesChart />
      </div>

      

      <div className="col-span-12">
        <StatisticsChart />
      </div>

      <div className="col-span-12 xl:col-span-6">
        <RecentOrders />
      </div>

      <div className="col-span-12 xl:col-span-6">
        <RecentApplied />
      </div>
    </div>
  );
}
