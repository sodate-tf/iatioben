// app/types/amp.d.ts
import React from "react";

declare global {
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
