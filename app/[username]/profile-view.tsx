"use client";

import {
  CalendarDays,
  CarFront,
  Clock3,
  Facebook,
  Instagram,
  MapPin,
  MessageCircle,
  MoreHorizontal,
  Music2,
  Phone,
  Search,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState, type ComponentType, type SVGProps } from "react";
import {
  type Profile,
  type ProfileSocial,
  type ProfileStat,
} from "../../data/profiles";
import {
  PROFILE_STORAGE_EVENT,
  profileStorageKey,
  readStoredProfile,
} from "../../data/profile-storage";
import styles from "./page.module.css";

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

const statIcons: Record<ProfileStat["icon"], Icon> = {
  car: CarFront,
  star: Star,
  shield: ShieldCheck,
  clock: Clock3,
};

const socialIcons: Record<ProfileSocial["icon"], Icon> = {
  instagram: Instagram,
  facebook: Facebook,
  tiktok: Music2,
  google: Search,
};

interface ProfileViewProps {
  defaultProfile: Profile;
}

export function ProfileView({ defaultProfile }: ProfileViewProps) {
  const [profile, setProfile] = useState(defaultProfile);

  useEffect(() => {
    const loadProfile = () => setProfile(readStoredProfile(window.localStorage, defaultProfile));
    const handleStorage = (event: StorageEvent) => {
      if (event.key === profileStorageKey(defaultProfile.username)) loadProfile();
    };
    const handleLocalUpdate = (event: Event) => {
      const detail = (event as CustomEvent<{ username?: string }>).detail;
      if (!detail?.username || detail.username === defaultProfile.username) loadProfile();
    };

    loadProfile();
    window.addEventListener("storage", handleStorage);
    window.addEventListener(PROFILE_STORAGE_EVENT, handleLocalUpdate);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(PROFILE_STORAGE_EVENT, handleLocalUpdate);
    };
  }, [defaultProfile]);

  return (
    <main className={styles.shell} data-profile-storage-key={profileStorageKey(defaultProfile.username)}>
      <header className={styles.topbar}>
        <a className={styles.wordmark} href="#top" aria-label="Suds.to home">
          suds.<span>to</span>
        </a>
        <div className={styles.profilePath}>suds.to/<span>{profile.username}</span></div>
        <button className={styles.share} type="button" aria-label="Share profile">
          <Share2 aria-hidden="true" />
        </button>
      </header>

      <section className={styles.hero} id="top" aria-label={`${profile.businessName} ${profile.about.serviceLabel}`}>
        <Image className={styles.heroImage} src={profile.heroImageUrl} alt={`${profile.businessName} featured detailed vehicle`} fill priority sizes="(max-width: 1180px) 100vw, 1180px" />
        <div className={styles.heroShade} />
        <div className={styles.identityWrap}>
          <Image className={styles.logo} src={profile.logoUrl} alt={`${profile.businessName} logo`} width={148} height={148} priority />
          <div className={styles.identityCopy}>
            <p className={styles.eyebrow}>{profile.about.heroEyebrow}</p>
            <h1>{profile.businessName}</h1>
            <p className={styles.script}>{profile.about.serviceLabel}</p>
            <p className={styles.heroBlurb}>{profile.about.heroBlurb}</p>
            <p className={styles.location}><MapPin aria-hidden="true" /> {profile.location}</p>
          </div>
        </div>
      </section>

      <nav className={styles.actions} aria-label="Profile actions">
        <a className={styles.action} href={`tel:${profile.phone}`}><Phone aria-hidden="true" /><span>Call</span></a>
        <a className={styles.action} href={`sms:${profile.textNumber}`}><MessageCircle aria-hidden="true" /><span>Text</span></a>
        <a className={styles.primaryAction} href={profile.bookingUrl} target="_blank" rel="noreferrer"><CalendarDays aria-hidden="true" /><span>Book Now</span></a>
        <button className={styles.action} type="button"><MoreHorizontal aria-hidden="true" /><span>More</span></button>
      </nav>

      <div className={styles.content}>
        <section className={styles.about} aria-labelledby="about-title">
          <p className={styles.sectionKicker}>Who we are</p>
          <h2 id="about-title">{profile.about.heading}</h2>
          <p>{profile.about.body}</p>
        </section>

        <section className={styles.stats} aria-label="Business stats">
          {profile.stats.map((stat) => {
            const Icon = statIcons[stat.icon];
            return (
              <div className={styles.stat} key={stat.label}>
                <div className={styles.statIcon}><Icon aria-hidden="true" /></div>
                <div><strong>{stat.value}</strong><span>{stat.label}</span></div>
              </div>
            );
          })}
        </section>

        <section className={styles.section} aria-labelledby="services-title">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.sectionKicker}>Services &amp; pricing</p>
              <h2 id="services-title">Choose your level of shine.</h2>
            </div>
            <Sparkles aria-hidden="true" />
          </div>
          <div className={styles.services}>
            {profile.services.map((service) => (
              <article className={styles.serviceCard} key={service.title}>
                <Image src={service.imageUrl} alt="" fill sizes="(max-width: 559px) 100vw, (max-width: 819px) 50vw, 33vw" />
                <div className={styles.serviceCopy}>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <span>Starting at <strong>{service.price}</strong></span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section} aria-label="Gallery">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.sectionKicker}>Gallery</p>
              <h2>Recent transformations.</h2>
            </div>
          </div>
          <div className={styles.gallery}>
            {profile.galleryImages.map((image, index) => (
              <figure className={styles.galleryItem} key={`${image.alt}-${index}`}>
                <Image src={image.url} alt={image.alt} fill sizes="(max-width: 819px) 50vw, 25vw" />
              </figure>
            ))}
          </div>
        </section>
      </div>

      <section className={styles.connectPanel}>
        <div>
          <p className={styles.footerKicker}>Follow along</p>
          <h2>Connect</h2>
          <div className={styles.socials}>
            {profile.socials.map((social) => {
              const Icon = socialIcons[social.icon];
              return <a href={social.url} target="_blank" rel="noreferrer" aria-label={social.label} key={social.label}><Icon aria-hidden="true" /></a>;
            })}
          </div>
        </div>
        <div>
          <p className={styles.footerKicker}>Service area</p>
          <div className={styles.serviceArea}>
            <span><MapPin aria-hidden="true" /></span>
            <p>{profile.location}</p>
          </div>
        </div>
        <div>
          <p className={styles.footerKicker}>Leave a review</p>
          <a className={styles.review} href={profile.reviewUrl} target="_blank" rel="noreferrer">
            <span className={styles.googleIcon}>G</span>
            <div>
              <div className={styles.stars} aria-label="Five stars">
                {[0, 1, 2, 3, 4].map((star) => <Star fill="currentColor" aria-hidden="true" key={star} />)}
              </div>
              <p>Tap to review us on Google</p>
            </div>
          </a>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>© 2026 {profile.businessName} {profile.about.serviceLabel}. All rights reserved.</p>
        <p>Built with <strong>suds.<span>to</span></strong></p>
      </footer>
    </main>
  );
}
