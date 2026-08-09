import { PageLoader } from "@/shared/components/PageLoader";

/**
 * The root fallback, so no route can navigate to a blank screen.
 *
 * Segments that can outline what is coming should still add their own `loading.tsx`
 * with a skeleton — a shape of the page reads as faster than a spinner does. This
 * catches everything that hasn't.
 */
export default function Loading() {
  return <PageLoader />;
}
