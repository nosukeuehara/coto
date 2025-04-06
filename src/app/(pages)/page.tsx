import { BookCard } from "@/components/bookCard/BookCard";
import BookGallery from "@/components/bookGallery/BookGallery";
import { fetchAllBooks } from "@/lib/api/auth/bookAPI";
import { BookViewData } from "@/types";

export default async function Home() {
  const books: BookViewData[] = await fetchAllBooks();

  return (
    <div>
      <BookGallery>
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </BookGallery>
    </div>
  );
}
