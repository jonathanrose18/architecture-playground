import type { ReactNode } from "react";

import { cn } from "@workspace/ui/lib/utils";

export function Main({
	title,
	description,
	actions,
	children,
	className,
	contentClassName,
}: {
	actions?: ReactNode;
	children: ReactNode;
	className?: string;
	contentClassName?: string;
	description?: string;
	title: string;
}) {
	return (
		<main
			className={cn(
				"mx-auto flex w-full max-w-5xl flex-col gap-6 p-6 md:p-8",
				className,
			)}
			data-slot="app-shell"
		>
			<header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
				<div className="space-y-1">
					<h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
					{description ? (
						<p className="text-muted-foreground text-sm">{description}</p>
					) : null}
				</div>
				{actions ? (
					<div className="flex items-center gap-2">{actions}</div>
				) : null}
			</header>
			<div className={cn("space-y-4", contentClassName)}>{children}</div>
		</main>
	);
}
