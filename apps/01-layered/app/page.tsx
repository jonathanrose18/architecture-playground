import { Button } from '@workspace/ui/components/ui/button';
import { prisma } from '@workspace/database';

export default async function Page() {
   const data = await prisma.contact.findFirst();

   return (
      <main>
         <Button>{data?.firstName}</Button>
      </main>
   );
}
