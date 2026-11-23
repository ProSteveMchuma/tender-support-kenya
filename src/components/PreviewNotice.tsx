import { site } from "@/config/site";

export function PreviewNotice({ formsLive }: { formsLive: boolean }) {
  if (site.productionMode) return null;
  return (
    <div className="preview-notice" role="note">
      <div className="wrap">
        <span className="pn-dot" aria-hidden="true" />
        <strong>Preview</strong>
        <span>
          {formsLive
            ? "Business details are being confirmed."
            : "Online forms don’t send yet. Business details are being confirmed."}
        </span>
      </div>
    </div>
  );
}
