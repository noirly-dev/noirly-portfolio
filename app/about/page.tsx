import Image from "next/image";
import Link from "next/link";
import { getPortfolioContent } from "@/lib/content/server";

export default async function AboutPage() {
  const { profile } = await getPortfolioContent();

  return (
    <section id="about" className="spacing-section bg-background">
      <div className="spacing-container container mx-auto">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-16 text-center text-3xl font-bold text-foreground">About Me</h2>

          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div className="space-y-6">
              <p className="text-lg leading-relaxed text-muted-foreground">{profile.aboutBio}</p>
              {profile.aboutPoints.map((point) => (
                <p key={point} className="text-lg leading-relaxed text-muted-foreground">
                  {point}
                </p>
              ))}
              <Link
                href="/skills"
                className="btn-accent inline-block cursor-pointer rounded-sm px-8 py-3 font-medium transition-colors"
              >
                See My Skills
              </Link>
            </div>

            <div className="flex justify-center">
              <div className="relative">
                <div className="glass-effect flex h-80 w-80 items-center justify-center overflow-hidden border border-border bg-secondary">
                  {profile.profileImage ? (
                    <Image
                      src={profile.profileImage}
                      alt={profile.name}
                      width={288}
                      height={288}
                      className="h-72 w-72 object-cover"
                      unoptimized
                    />
                  ) : (
                    <span className="text-7xl font-bold text-muted-foreground">
                      {profile.name.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="absolute -top-4 -right-4 h-8 w-8 rounded-full bg-accent" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
