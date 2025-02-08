import type { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  iconColor?: string;
  iconBgColor?: string;
  // search?: (search: string) => void;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  iconColor = "text-blue-500",
  iconBgColor = "bg-blue-50",
}: FeatureCardProps) {
  let copy = async () => {
    try {
      navigator.clipboard.writeText(description);
    } catch {
      console.log("");
    }
  };
  return (
    <div
      className="flex flex-col items-start gap-4 p-4 rounded-xl border hover:shadow-lg transition-shadow cursor-pointer"
      onClick={copy}
    >
      <div className={`p-3 rounded-full ${iconBgColor}`}>
        <Icon className={`w-6 h-6 ${iconColor}`} />
      </div>
      <div>
        <h3 className="font-medium mb-1">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
}
