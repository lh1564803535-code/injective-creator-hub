"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={`flex items-center gap-2 text-sm ${className}`}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={item.label} className="flex items-center gap-2">
            {index > 0 && <ChevronRight className="h-4 w-4 text-gray-600" />}
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="text-gray-500 transition hover:text-white"
              >
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? "text-white" : "text-gray-500"}>
                {item.label}
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}
