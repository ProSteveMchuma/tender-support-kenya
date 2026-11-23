import { site } from "@/config/site";

export function PreviewNotice({ formsLive }: { formsLive: boolean }) {
  if (site.productionMode) return null;
  return (
    <div className="preview-notice" role="note">
      <div className="wrap">
        <strong>Preview site.</strong> This is a working preview, not a live service yet.{" "}
        {formsLive
          ? "Business details are still being confirmed."
          : "Forms do not send requests, and business details are still being confirmed."}
      </div>
    </div>
  );
}
