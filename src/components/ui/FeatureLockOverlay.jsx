import { IconLock } from "@tabler/icons-react";
import { Button } from "@mantine/core";
import { useRouter } from "next/navigation";

export default function FeatureLockOverlay({
  requiredPlan = "pro",
  currentPlan,
  children,
  customMessage,
}) {
  const router = useRouter();
  const locked =
    requiredPlan === "pro"
      ? currentPlan !== "pro" && currentPlan !== "premium"
      : currentPlan !== requiredPlan;
  if (!locked) return children;
  return (
    <div className="relative w-full h-full">
      <div className="blur-sm pointer-events-none select-none opacity-60 w-full h-full">
        {children}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 z-20 rounded-xl w-full h-full">
        <IconLock className="w-10 h-10 text-gray-400 mb-2" />
        <div className="text-lg font-semibold mb-2 text-gray-700 text-center">
          {customMessage || (
            <>
              Upgrade to{" "}
              {requiredPlan.charAt(0).toUpperCase() + requiredPlan.slice(1)} to
              access this feature
            </>
          )}
        </div>
        <Button
          className="mt-4 bg-primary text-white hover:bg-primary/90 focus:ring-2 focus:ring-primary/30 h-11 px-6 font-semibold text-[15px] rounded-md shadow-md max-w-xs"
          style={{
            fontWeight: 600,
            fontSize: 16,
            boxShadow: "0 2px 8px 0 rgba(80, 80, 180, 0.10)",
          }}
          size="md"
          onClick={() => router.push("/billing")}
        >
          Upgrade Plan
        </Button>
      </div>
    </div>
  );
}
