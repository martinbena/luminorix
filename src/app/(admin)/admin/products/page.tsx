import AdminActions from "@/components/admin/AdminActions";
import ItemTitle from "@/components/data-tables/ItemTitle";
import Table from "@/components/data-tables/Table";
import TableBody from "@/components/data-tables/TableBody";
import TableContainer from "@/components/data-tables/TableContainer";
import TableHeader from "@/components/data-tables/TableHeader";
import TableRow from "@/components/data-tables/TableRow";
import Button from "@/components/ui/Button";
import HeadingSecondary from "@/components/ui/HeadingSecondary";
import paths from "@/lib/paths";

export default function AdminAllProductsPage() {
  return (
    <>
      <HeadingSecondary>Manage all products</HeadingSecondary>
      <section className="mt-12 py-8">
        <Button type="secondary" href={paths.adminProductCreate()}>
          Add new products
        </Button>
        <TableContainer>
          <Table>
            <TableHeader>Products</TableHeader>
          </Table>
        </TableContainer>
      </section>
    </>
  );
}
