import BlogCardList from "@/components/BlogCardList";
import { DataProvider } from "../adminTioBen/contexts/DataContext";


// Exemplo simples com Pages Router
export default function BlogIndexPage() {
  return (
    <DataProvider>
      <BlogCardList />
    </DataProvider>
);
}