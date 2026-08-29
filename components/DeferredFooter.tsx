"use client";

import dynamic from "next/dynamic";
import type { Profile } from "@/data/profile";

const Footer = dynamic(
  () => import("@/components/Footer").then((m) => m.Footer),
  { ssr: true },
);

/** Keeps footer motion/icons out of the layout’s critical client graph. */
export function DeferredFooter({
  title,
  profile,
}: {
  title: string;
  profile: Profile;
}) {
  return <Footer title={title} profile={profile} />;
}
