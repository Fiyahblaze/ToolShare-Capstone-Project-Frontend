interface PlaceholderPageProps {
  title: string;
  description: string;
}

export default function PlaceholderPage({
  title,
  description,
}: PlaceholderPageProps) {
  return (
    <section className="content-card">
      <h1>{title}</h1>
      <p className="description">{description}</p>
    </section>
  );
}