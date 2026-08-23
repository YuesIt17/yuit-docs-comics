export type ProductVariant = "v1" | "v2";

export const features = {
  v2Enabled: true,
  storyBank: false,
  voiceInput: true,
  branchingDialogue: false,
  advancedGamification: false,
} as const;

export function getProductVariantFromSearch(
  searchParams: URLSearchParams
): ProductVariant | null {
  const variant = searchParams.get("variant");
  if (variant === "v2") return "v2";
  if (variant === "v1") return "v1";
  return null;
}
