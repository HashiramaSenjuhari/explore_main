import { Star } from "lucide-react";

export const renderStars = (
  rating: number,
  attractionId: string,
  color: string
) => {
  return (
    <div className="flex items-center gap-1" key={attractionId}>
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? color
                : star <= Math.ceil(rating) && rating % 1 !== 0
                ? "fill-primary/50"
                : ""
            } `}
          />
        ))}
      </div>
      <span className="text-sm text-muted-foreground ml-1">{rating}</span>
    </div>
  );
};
