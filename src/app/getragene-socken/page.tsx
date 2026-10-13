import { DepartmentPage, departmentMetadata } from "@/app/_dept/DepartmentPage";
import type { SearchParams } from "@/app/_dept/listing-params";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<SearchParams> };

export const generateMetadata = ({ searchParams }: Props) => departmentMetadata("socken", searchParams);

export default function GetrageneSockenPage({ searchParams }: Props) {
  return <DepartmentPage id="socken" searchParams={searchParams} />;
}
