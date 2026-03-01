import type { ReactNode } from "react";

import { cn } from "@workspace/ui/lib/utils";

export function DetailList({
	items,
	className,
}: {
	className?: string;
	items: {
		label: string;
		value: ReactNode;
	}[];
}) {
	return (
		<dl
			className={cn("divide-border divide-y rounded-md border", className)}
			data-slot="detail-list"
		>
			{items.map((item) => (
				<div
					className="grid grid-cols-1 gap-1 px-3 py-2 sm:grid-cols-[140px_1fr] sm:items-center sm:gap-3"
					key={item.label}
				>
					<dt className="text-muted-foreground text-sm">{item.label}</dt>
					<dd className="text-sm font-medium">{item.value}</dd>
				</div>
			))}
		</dl>
	);
}
