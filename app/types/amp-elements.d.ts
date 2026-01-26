// types/amp-elements.d.ts
import type React from "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "amp-story-player": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}

export {};
