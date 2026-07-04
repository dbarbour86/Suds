export type StatIconName = "car" | "star" | "shield" | "clock";
export type SocialIconName = "instagram" | "facebook" | "tiktok" | "google";

export interface ProfileAbout {
  heroEyebrow: string;
  serviceLabel: string;
  heroBlurb: string;
  heading: string;
  body: string;
}

export interface ProfileStat {
  value: string;
  label: string;
  icon: StatIconName;
}

export interface ProfileService {
  title: string;
  description: string;
  price: string;
  imageUrl: string;
}

export interface ProfileGalleryImage {
  url: string;
  alt: string;
}

export interface ProfileSocial {
  label: string;
  url: string;
  icon: SocialIconName;
}

export interface Profile {
  username: string;
  businessName: string;
  logoUrl: string;
  heroImageUrl: string;
  about: ProfileAbout;
  phone: string;
  textNumber: string;
  bookingUrl: string;
  location: string;
  stats: ProfileStat[];
  services: ProfileService[];
  galleryImages: ProfileGalleryImage[];
  socials: ProfileSocial[];
  reviewUrl: string;
}

export const profiles = {
  tyrees: {
    username: "tyrees",
    businessName: "Tyrees",
    logoUrl: "/images/tyrees/tyrees-logo.png",
    heroImageUrl: "/images/tyrees/hero-car-wash.png",
    about: {
      heroEyebrow: "Atlanta's mobile detailer",
      serviceLabel: "Mobile Detailing",
      heroBlurb: "We bring the shine to you. Premium mobile detailing delivered with passion, precision, and pride.",
      heading: "Detailing, done differently.",
      body: "We're a fully insured mobile detailing business dedicated to making your vehicle look its absolute best. From daily drivers to show cars, we treat every detail like it's our own.",
    },
    phone: "+14045551234",
    textNumber: "+14045551234",
    bookingUrl: "https://cal.com/tyrees/detailing",
    location: "Atlanta, GA & Surrounding Areas",
    stats: [
      { value: "1,284+", label: "Vehicles Detailed", icon: "car" },
      { value: "247", label: "5-Star Reviews", icon: "star" },
      { value: "100%", label: "Satisfaction", icon: "shield" },
      { value: "5+", label: "Years in Business", icon: "clock" },
    ],
    services: [
      {
        title: "Exterior Wash",
        description: "Hand wash, wheels, tires, and a lasting satin shine.",
        price: "$75",
        imageUrl: "/images/tyrees/exterior-wash.png",
      },
      {
        title: "Interior Detail",
        description: "Deep clean of all interior surfaces, seats, and mats.",
        price: "$125",
        imageUrl: "/images/tyrees/interior-detail.png",
      },
      {
        title: "Full Detail",
        description: "Exterior wash, interior detail, and premium finish.",
        price: "$199",
        imageUrl: "/images/tyrees/finished-sedan.png",
      },
    ],
    galleryImages: [
      { url: "/images/tyrees/finished-sedan.png", alt: "Freshly detailed black performance sedan" },
      { url: "/images/tyrees/interior-detail.png", alt: "Spotless detailed black leather interior" },
      { url: "/images/tyrees/hero-car-wash.png", alt: "Black luxury coupe covered in soap" },
      { url: "/images/tyrees/exterior-wash.png", alt: "Detailer cleaning a glossy black hood" },
      { url: "/images/tyrees/hero-car-wash.png", alt: "Close crop of a washed performance car" },
      { url: "/images/tyrees/interior-detail.png", alt: "Clean front seats and center console" },
      { url: "/images/tyrees/finished-sedan.png", alt: "Polished black sedan at blue hour" },
      { url: "/images/tyrees/exterior-wash.png", alt: "Soap beads on polished black paint" },
    ],
    socials: [
      { label: "Instagram", url: "https://www.instagram.com/tyrees", icon: "instagram" },
      { label: "Facebook", url: "https://www.facebook.com/tyrees", icon: "facebook" },
      { label: "TikTok", url: "https://www.tiktok.com/@tyrees", icon: "tiktok" },
      { label: "Google", url: "https://www.google.com/search?q=Tyrees+Mobile+Detailing", icon: "google" },
    ],
    reviewUrl: "https://www.google.com/search?q=Tyrees+Mobile+Detailing+reviews",
  },
} satisfies Record<string, Profile>;

export type ProfileUsername = keyof typeof profiles;
