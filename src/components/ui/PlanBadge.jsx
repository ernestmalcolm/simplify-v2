import { IconBadge, IconRocket, IconCrown } from "@tabler/icons-react";

export default function PlanBadge({ plan }) {
  if (plan === "pro") {
    return (
      <span className="flex items-center gap-1 text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
        <IconRocket className="w-4 h-4" /> Pro Plan
      </span>
    );
  }
  if (plan === "premium") {
    return (
      <span className="flex items-center gap-1 text-yellow-800 bg-yellow-100 px-2 py-0.5 rounded-full">
        <IconCrown className="w-4 h-4" /> Premium Plan
      </span>
    );
  }
  // Default to free
  return (
    <span className="flex items-center gap-1 text-gray-600 bg-gray-200 px-2 py-0.5 rounded-full">
      <IconBadge className="w-4 h-4" /> Free Plan
    </span>
  );
}
