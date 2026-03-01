import type { ReactNode } from 'react';

import {
   Card,
   CardAction,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from '@workspace/ui/components/ui/card';
import { cn } from '@workspace/ui/lib/utils';

export function EntityCard({
   title,
   description,
   meta,
   action,
   children,
   className,
}: {
   action?: ReactNode;
   children?: ReactNode;
   className?: string;
   description?: string;
   meta?: ReactNode;
   title: string;
}) {
   return (
      <Card className={cn('gap-4 py-4', className)} data-slot='entity-card'>
         <CardHeader className='px-4'>
            <div className='space-y-1'>
               <CardTitle className='text-base'>{title}</CardTitle>
               {description ? <CardDescription>{description}</CardDescription> : null}
            </div>
            {action ? <CardAction>{action}</CardAction> : null}
         </CardHeader>
         {meta || children ? (
            <CardContent className='space-y-3 px-4'>
               {meta ? (
                  <div className='text-muted-foreground flex flex-wrap items-center gap-2 text-sm'>{meta}</div>
               ) : null}
               {children}
            </CardContent>
         ) : null}
      </Card>
   );
}
