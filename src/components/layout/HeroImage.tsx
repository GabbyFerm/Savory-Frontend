interface HeroImageProps {
  imageUrl: string;
  title: string;
  author?: string;
  createdAt?: string;
}

export default function HeroImage({
  imageUrl,
  title,
  author,
  createdAt,
}: HeroImageProps) {
  // Construct full image URL
  const fullImageUrl = imageUrl.startsWith("http")
    ? imageUrl
    : `${import.meta.env.VITE_API_URL?.replace("/api", "")}${imageUrl}`;

  return (
    <div className="relative h-96 w-full overflow-hidden">
      {/* Background Image */}
      <img
        src={fullImageUrl}
        alt={title}
        className="w-full h-full object-cover"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/40 to-transparent" />

      {/* Title Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-8">
        <div className="container mx-auto">
          <h1 className="font-display text-5xl font-bold text-white mb-2 italic">
            {title}
          </h1>
          {(author || createdAt) && (
            <p className="text-white/90 text-sm">
              {author && `👤 By: ${author}`}
              {author && createdAt && " | "}
              {createdAt && `📅 ${new Date(createdAt).toLocaleDateString()}`}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
