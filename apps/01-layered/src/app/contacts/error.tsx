'use client';

type Props = { error: Error; reset: () => void };

export default function ContactsError({ error, reset }: Props) {
   return (
      <main className='mx-auto w-full max-w-7xl p-6'>
         <div className='flex flex-col items-center gap-4 py-12 text-center'>
            <p className='text-destructive font-medium'>Failed to load contacts</p>
            <p className='text-muted-foreground text-sm'>{error.message}</p>
            <button onClick={reset} className='text-primary text-sm underline underline-offset-4'>
               Try again
            </button>
         </div>
      </main>
   );
}
