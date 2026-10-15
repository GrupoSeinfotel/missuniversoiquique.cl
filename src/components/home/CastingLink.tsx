"use client";
import Link from "next/link";

export default function CastingLink() {
    return (
        <div style={{ display: 'none' }}>
            {/* Helper component for linking, currently not rendering visible content 
          but ensuring the import in page.tsx doesn't break. 
          Can be expanded later for a sticky CTA.
      */}
            <Link href="/casting">Go to Casting</Link>
        </div>
    );
}
