import type { ReactNode } from "react";

import {
	Card,
	CardContent,
	CardDescription,
	CardTitle,
} from "@workspace/ui/components/ui/card";
import { cn } from "@workspace/ui/lib/utils";

export function EmptyState({
	action,
	className,
	description,
	title,
}: {
	action?: ReactNode;
	className?: string;
	description?: string;
	title: string;
}) {
	return (
		<Card className={cn("border-dashed", className)} data-slot="empty-state">
			<CardContent className="flex flex-col items-center justify-center gap-2 py-10 text-center">
				<CardTitle className="text-base">{title}</CardTitle>
				{description ? (
					<CardDescription className="max-w-md">{description}</CardDescription>
				) : null}
				{action ? <div className="pt-2">{action}</div> : null}
			</CardContent>
		</Card>
	);
}
