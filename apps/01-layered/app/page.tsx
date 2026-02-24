import { prisma } from "@workspace/database";
import { Button } from "@workspace/ui/components/ui/button";

export default async function Page() {
	const data = await prisma.contact.findFirst();

	return (
		<main>
			<Button>{data?.firstName}</Button>
		</main>
	);
}
