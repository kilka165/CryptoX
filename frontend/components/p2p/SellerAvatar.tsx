"use client";

interface SellerAvatarProps {
  name: string;
  avatar?: string | null;
  // size + text-* классы (по умолчанию как в карточке оффера)
  className?: string;
}

// Аватар продавца: фото пользователя, либо первая буква имени на градиенте.
export function SellerAvatar({ name, avatar, className = "w-10 h-10 text-base" }: SellerAvatarProps) {
  return (
    <div
      className={`rounded-full overflow-hidden shrink-0 flex items-center justify-center font-bold text-white bg-gradient-to-br from-blue-500 to-purple-600 ${className}`}
    >
      {avatar ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={avatar} alt="" className="w-full h-full object-cover" />
      ) : (
        (name?.[0] || "?").toUpperCase()
      )}
    </div>
  );
}
