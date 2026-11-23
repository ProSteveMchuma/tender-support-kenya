import { site } from "@/config/site";

export function LegalDraftNote({ reviewed }: { reviewed: boolean }) {
  if (reviewed && site.productionMode) return null;
  return (
    <p className="draft-note" role="note">
      Draft for owner review. This text has not yet been reviewed for publication and may change before launch.
    </p>
  );
}
