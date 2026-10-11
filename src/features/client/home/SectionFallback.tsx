const SectionFallback = () => {
  return (
    <section
      className="bg-background-second/20 py-15 md:py-20"
      aria-hidden="true"
    >
      <div className="container flex flex-col items-center gap-8">
        <div className="h-12 w-12 bg-muted" />
        <div className="h-8 w-48 bg-muted" />
        <div className="h-64 w-full bg-muted/60" />
      </div>
    </section>
  );
};

export default SectionFallback;
