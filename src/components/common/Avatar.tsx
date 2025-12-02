interface AvatarProps {
  userName: string;
  avatarColor: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export default function Avatar({
  userName,
  avatarColor,
  size = "md",
  className = "",
}: AvatarProps) {
  // Generate initials (max 2 letters)
  const getInitials = (name: string): string => {
    const words = name.trim().split(/\s+/);

    if (words.length === 1) {
      // Single word: take first 2 characters
      return words[0].substring(0, 2).toUpperCase();
    } else {
      // Multiple words: take first character of first two words
      return (words[0][0] + words[1][0]).toUpperCase();
    }
  };

  // Size variants
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-lg",
    xl: "w-16 h-16 text-xl",
  };

  const initials = getInitials(userName);

  return (
    <div
      className={`
        ${sizeClasses[size]} 
        rounded-full 
        flex items-center justify-center 
        font-bold 
        text-white
        ${className}
      `}
      style={{ backgroundColor: avatarColor }}
      title={userName}
    >
      {initials}
    </div>
  );
}
