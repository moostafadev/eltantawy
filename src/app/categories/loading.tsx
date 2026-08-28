import CategoriesSkeleton from "@/features/client/categories/CategoriesSkeleton";

const Loading = () => {
  return (
    <main className="container py-6 lg:py-8">
      <div className="flex flex-col gap-6 lg:gap-8">
        <header className="flex flex-col items-center gap-2 text-center">
          <div className="size-12 animate-pulse bg-main/10" />

          <div className="h-8 w-48 animate-pulse bg-muted" />

          <div className="h-5 w-80 max-w-full animate-pulse bg-muted" />
        </header>

        <CategoriesSkeleton />
      </div>
    </main>
  );
};

export default Loading;
