import PageClientV2 from "./v2/PageClientV2";

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;
  return <PageClientV2 initialRef={ref} />;
}
