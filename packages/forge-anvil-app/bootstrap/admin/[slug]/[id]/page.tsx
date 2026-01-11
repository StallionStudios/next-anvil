import { AnvilResource } from "@/lib/anvil/resource";

export default async function ResourcePage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = await params;
  const resource = (await import(`@/lib/resources/${slug}`))
    .default as AnvilResource;
  return <div>ResourcePage</div>;
}
