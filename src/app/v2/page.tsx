import PageClientV2 from "./PageClientV2";

export const dynamic = "force-dynamic";

export default async function V2Page({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;
  return <PageClientV2 initialRef={ref} />;
}
