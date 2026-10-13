import { DepartmentPage, departmentMetadata } from "@/app/_dept/DepartmentPage";
import type { SearchParams } from "@/app/_dept/listing-params";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<SearchParams> };

export const generateMetadata = ({ searchParams }: Props) => departmentMetadata("slips", searchParams);

export default function GetrageneSlipsPage({ searchParams }: Props) {
  return <DepartmentPage id="slips" searchParams={searchParams} />;
}
