interface PageHeadingProps {
  title: string;
  subtitle?: string;
}

export default function PageHeading({ title, subtitle }: PageHeadingProps) {
  return (
    <div className="bg-primary py-8 mb-8 border-t border-light/50">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-display text-4xl font-bold text-light italic">
          {title}
        </h2>
        {subtitle && <p className="text-dark/70 mt-2">{subtitle}</p>}
      </div>
    </div>
  );
}
