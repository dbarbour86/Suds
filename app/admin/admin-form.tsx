"use client";

import Image from "next/image";
import { ExternalLink, ImageUp, Plus, RotateCcw, Save, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import {
  PROFILE_STORAGE_EVENT,
  readStoredProfile,
  resetStoredProfile,
  saveStoredProfile,
} from "../../data/profile-storage";
import type {
  Profile,
  ProfileService,
  ProfileSocial,
  ProfileStat,
  SocialIconName,
  StatIconName,
} from "../../data/profiles";
import {
  appendListItem,
  cloneProfile,
  removeListItem,
  validateProfile,
  type ProfileErrors,
} from "./profile-form";
import {
  emptyImagePreviewState,
  isAcceptedImageFile,
  removeGalleryPreview,
  removeSinglePreview,
  replaceGalleryPreviews,
  replaceSinglePreview,
  revokePreviewState,
  type ImagePreviewState,
  type SinglePreviewKey,
} from "./image-previews";
import styles from "./admin.module.css";

interface AdminFormProps {
  defaultProfile: Profile;
}

const statIconOptions: Array<{ value: StatIconName; label: string }> = [
  { value: "car", label: "Car" },
  { value: "star", label: "Star" },
  { value: "shield", label: "Shield" },
  { value: "clock", label: "Clock" },
];

const socialIconOptions: Array<{ value: SocialIconName; label: string }> = [
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "tiktok", label: "TikTok" },
  { value: "google", label: "Google" },
];

export function AdminForm({ defaultProfile }: AdminFormProps) {
  const [profile, setProfile] = useState(() => cloneProfile(defaultProfile));
  const [errors, setErrors] = useState<ProfileErrors>({});
  const [status, setStatus] = useState("");
  const [imagePreviews, setImagePreviews] = useState<ImagePreviewState>(() => emptyImagePreviewState());
  const [imageErrors, setImageErrors] = useState({ logo: "", hero: "", gallery: "" });
  const imagePreviewsRef = useRef(imagePreviews);

  useEffect(() => {
    setProfile(cloneProfile(readStoredProfile(window.localStorage, defaultProfile)));
  }, [defaultProfile]);

  useEffect(() => () => {
    revokePreviewState(imagePreviewsRef.current, URL.revokeObjectURL);
  }, []);

  const updateImagePreviews = (update: (current: ImagePreviewState) => ImagePreviewState) => {
    setImagePreviews((current) => {
      const next = update(current);
      imagePreviewsRef.current = next;
      return next;
    });
  };

  const handleSingleImage = (key: SinglePreviewKey, errorKey: "logo" | "hero", event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!isAcceptedImageFile(file)) {
      setImageErrors((current) => ({ ...current, [errorKey]: "Choose a JPEG, PNG, or WebP image." }));
      return;
    }

    updateImagePreviews((current) => replaceSinglePreview(current, key, file, URL.createObjectURL, URL.revokeObjectURL));
    setImageErrors((current) => ({ ...current, [errorKey]: "" }));
  };

  const handleGalleryImages = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (!files.length) return;

    if (files.some((file) => !isAcceptedImageFile(file))) {
      setImageErrors((current) => ({ ...current, gallery: "Every gallery file must be a JPEG, PNG, or WebP image." }));
      return;
    }

    updateImagePreviews((current) => replaceGalleryPreviews(current, files, URL.createObjectURL, URL.revokeObjectURL));
    setImageErrors((current) => ({ ...current, gallery: "" }));
  };

  const clearTemporaryImages = () => {
    revokePreviewState(imagePreviewsRef.current, URL.revokeObjectURL);
    const empty = emptyImagePreviewState();
    imagePreviewsRef.current = empty;
    setImagePreviews(empty);
    setImageErrors({ logo: "", hero: "", gallery: "" });
  };

  const setBasic = (field: "businessName" | "phone" | "textNumber" | "bookingUrl" | "location", value: string) => {
    setProfile((current) => ({ ...current, [field]: value }));
  };

  const setAbout = (field: keyof Profile["about"], value: string) => {
    setProfile((current) => ({ ...current, about: { ...current.about, [field]: value } }));
  };

  const setService = (index: number, field: keyof ProfileService, value: string) => {
    setProfile((current) => ({
      ...current,
      services: current.services.map((service, serviceIndex) => serviceIndex === index ? { ...service, [field]: value } : service),
    }));
  };

  const setStat = (index: number, field: keyof ProfileStat, value: string) => {
    setProfile((current) => ({
      ...current,
      stats: current.stats.map((stat, statIndex) => statIndex === index ? { ...stat, [field]: value } : stat),
    }));
  };

  const setSocial = (index: number, field: keyof ProfileSocial, value: string) => {
    setProfile((current) => ({
      ...current,
      socials: current.socials.map((social, socialIndex) => socialIndex === index ? { ...social, [field]: value } : social),
    }));
  };

  const emitProfileUpdate = () => {
    window.dispatchEvent(new CustomEvent(PROFILE_STORAGE_EVENT, { detail: { username: profile.username } }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateProfile(profile);
    setErrors(nextErrors);

    const firstError = Object.keys(nextErrors)[0];
    if (firstError) {
      setStatus("Please correct the highlighted fields before saving.");
      requestAnimationFrame(() => {
        document.querySelector<HTMLElement>(`[name="${firstError}"]`)?.focus();
      });
      return;
    }

    try {
      saveStoredProfile(window.localStorage, profile);
      emitProfileUpdate();
      setStatus("Changes saved. Your public profile now uses these local edits.");
    } catch {
      setStatus("Your browser could not save these changes. Check local storage permissions and try again.");
    }
  };

  const handleReset = () => {
    if (!window.confirm("Reset Tyrees to the typed default profile? This removes your local edits.")) return;

    resetStoredProfile(window.localStorage, defaultProfile.username);
    clearTemporaryImages();
    setProfile(cloneProfile(defaultProfile));
    setErrors({});
    emitProfileUpdate();
    setStatus("Local edits cleared. Tyrees is back to the typed default profile.");
  };

  const fieldError = (path: string) => errors[path];

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <a className={styles.wordmark} href={`/${profile.username}`}>suds.<span>to</span></a>
        <div className={styles.headerActions}>
          <a className={styles.viewLink} href={`/${profile.username}`} target="_blank" rel="noreferrer">
            View profile <ExternalLink aria-hidden="true" />
          </a>
          <button className={styles.saveTop} type="submit" form="profile-form"><Save aria-hidden="true" /> Save changes</button>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.intro}>
          <p className={styles.kicker}>Profile editor</p>
          <h1>Edit Tyrees</h1>
          <p>Changes are saved only in this browser for testing. Your typed profile remains the fallback.</p>
        </div>

        <form id="profile-form" className={styles.form} onSubmit={handleSubmit} noValidate>
          <section className={styles.card}>
            <div className={styles.cardHeading}><div><span>01</span><h2>Business basics</h2></div><p>The essentials customers use to reach you.</p></div>
            <div className={styles.gridTwo}>
              <Field label="Business name" name="businessName" value={profile.businessName} error={fieldError("businessName")} onChange={(value) => setBasic("businessName", value)} />
              <Field label="Location" name="location" value={profile.location} error={fieldError("location")} onChange={(value) => setBasic("location", value)} />
              <Field label="Phone" name="phone" type="tel" value={profile.phone} error={fieldError("phone")} onChange={(value) => setBasic("phone", value)} />
              <Field label="Text number" name="textNumber" type="tel" value={profile.textNumber} error={fieldError("textNumber")} onChange={(value) => setBasic("textNumber", value)} />
              <div className={styles.spanTwo}><Field label="Booking URL" name="bookingUrl" type="url" value={profile.bookingUrl} error={fieldError("bookingUrl")} onChange={(value) => setBasic("bookingUrl", value)} /></div>
            </div>
          </section>

          <section className={styles.card}>
            <div className={styles.cardHeading}><div><span>02</span><h2>About</h2></div><p>Shape the story visitors see at the top of the profile.</p></div>
            <div className={styles.gridTwo}>
              <Field label="Hero eyebrow" name="about.heroEyebrow" value={profile.about.heroEyebrow} error={fieldError("about.heroEyebrow")} onChange={(value) => setAbout("heroEyebrow", value)} />
              <Field label="Service label" name="about.serviceLabel" value={profile.about.serviceLabel} error={fieldError("about.serviceLabel")} onChange={(value) => setAbout("serviceLabel", value)} />
              <div className={styles.spanTwo}><Field label="Hero blurb" name="about.heroBlurb" multiline value={profile.about.heroBlurb} error={fieldError("about.heroBlurb")} onChange={(value) => setAbout("heroBlurb", value)} /></div>
              <div className={styles.spanTwo}><Field label="About heading" name="about.heading" value={profile.about.heading} error={fieldError("about.heading")} onChange={(value) => setAbout("heading", value)} /></div>
              <div className={styles.spanTwo}><Field label="About body" name="about.body" multiline value={profile.about.body} error={fieldError("about.body")} onChange={(value) => setAbout("body", value)} /></div>
            </div>
          </section>

          <section className={styles.card}>
            <div className={styles.cardHeading}><div><span>03</span><h2>Images</h2></div><p>Try new visuals locally. These previews disappear when you refresh and are never included in Save.</p></div>
            <div className={styles.imageGrid}>
              <ImagePicker
                title="Logo image"
                inputId="logo-image"
                imageUrl={imagePreviews.logoUrl ?? profile.logoUrl}
                imageAlt="Logo preview"
                shape="logo"
                hasTemporaryPreview={Boolean(imagePreviews.logoUrl)}
                error={imageErrors.logo}
                onChange={(event) => handleSingleImage("logoUrl", "logo", event)}
                onRemove={() => updateImagePreviews((current) => removeSinglePreview(current, "logoUrl", URL.revokeObjectURL))}
              />
              <ImagePicker
                title="Hero image"
                inputId="hero-image"
                imageUrl={imagePreviews.heroUrl ?? profile.heroImageUrl}
                imageAlt="Hero preview"
                shape="hero"
                hasTemporaryPreview={Boolean(imagePreviews.heroUrl)}
                error={imageErrors.hero}
                onChange={(event) => handleSingleImage("heroUrl", "hero", event)}
                onRemove={() => updateImagePreviews((current) => removeSinglePreview(current, "heroUrl", URL.revokeObjectURL))}
              />
            </div>

            <div className={styles.galleryPanel}>
              <div className={styles.imagePanelHeader}>
                <div><h3>Gallery images</h3><p>Select several images at once to preview a new gallery.</p></div>
                <label className={styles.uploadButton} htmlFor="gallery-images"><ImageUp aria-hidden="true" /> Choose images</label>
                <input className={styles.fileInput} id="gallery-images" aria-label="Gallery images" type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handleGalleryImages} />
              </div>
              {imageErrors.gallery && <p className={styles.imageError} role="alert">{imageErrors.gallery}</p>}
              <div className={styles.galleryPreviewGrid}>
                {(imagePreviews.galleryUrls.length
                  ? imagePreviews.galleryUrls.map((url, index) => ({ url, alt: `Temporary gallery preview ${index + 1}`, temporary: true }))
                  : profile.galleryImages.map((image) => ({ ...image, temporary: false })))
                  .map((image, index) => (
                    <div className={styles.galleryPreview} key={`${image.url}-${index}`}>
                      <Image src={image.url} alt={image.alt} fill sizes="(max-width: 680px) 45vw, 190px" unoptimized={image.url.startsWith("blob:")} />
                      {image.temporary && (
                        <button type="button" onClick={() => updateImagePreviews((current) => removeGalleryPreview(current, index, URL.revokeObjectURL))} aria-label={`Remove gallery preview ${index + 1}`}>
                          <X aria-hidden="true" />
                        </button>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </section>

          <section className={styles.card}>
            <RepeatableHeading number="04" title="Services" description="Packages, descriptions, and starting prices." actionLabel="Add service" onAdd={() => setProfile((current) => ({ ...current, services: appendListItem(current.services, { title: "New service", description: "Describe this service.", price: "$0", imageUrl: current.heroImageUrl }) }))} />
            <div className={styles.rows}>
              {profile.services.map((service, index) => (
                <div className={styles.rowCard} key={index}>
                  <div className={styles.rowTop}><strong>Service {index + 1}</strong><RemoveButton disabled={profile.services.length === 1} onClick={() => setProfile((current) => ({ ...current, services: removeListItem(current.services, index) }))} /></div>
                  <div className={styles.gridTwo}>
                    <Field label="Title" name={`services.${index}.title`} value={service.title} error={fieldError(`services.${index}.title`)} onChange={(value) => setService(index, "title", value)} />
                    <Field label="Price" name={`services.${index}.price`} value={service.price} error={fieldError(`services.${index}.price`)} onChange={(value) => setService(index, "price", value)} />
                    <div className={styles.spanTwo}><Field label="Description" name={`services.${index}.description`} multiline value={service.description} error={fieldError(`services.${index}.description`)} onChange={(value) => setService(index, "description", value)} /></div>
                    <div className={styles.spanTwo}><Field label="Image URL" name={`services.${index}.imageUrl`} value={service.imageUrl} error={fieldError(`services.${index}.imageUrl`)} onChange={(value) => setService(index, "imageUrl", value)} /></div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className={styles.card}>
            <RepeatableHeading number="05" title="Stats" description="The proof points shown beneath your introduction." actionLabel="Add stat" onAdd={() => setProfile((current) => ({ ...current, stats: appendListItem(current.stats, { value: "0", label: "New stat", icon: "star" }) }))} />
            <div className={styles.rows}>
              {profile.stats.map((stat, index) => (
                <div className={styles.rowCard} key={index}>
                  <div className={styles.rowTop}><strong>Stat {index + 1}</strong><RemoveButton disabled={profile.stats.length === 1} onClick={() => setProfile((current) => ({ ...current, stats: removeListItem(current.stats, index) }))} /></div>
                  <div className={styles.gridThree}>
                    <Field label="Value" name={`stats.${index}.value`} value={stat.value} error={fieldError(`stats.${index}.value`)} onChange={(value) => setStat(index, "value", value)} />
                    <Field label="Label" name={`stats.${index}.label`} value={stat.label} error={fieldError(`stats.${index}.label`)} onChange={(value) => setStat(index, "label", value)} />
                    <SelectField label="Icon" name={`stats.${index}.icon`} value={stat.icon} options={statIconOptions} onChange={(value) => setStat(index, "icon", value)} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className={styles.card}>
            <RepeatableHeading number="06" title="Social links" description="Destinations displayed in the dark footer." actionLabel="Add social link" onAdd={() => setProfile((current) => ({ ...current, socials: appendListItem(current.socials, { label: "Instagram", url: "https://www.instagram.com/", icon: "instagram" }) }))} />
            <div className={styles.rows}>
              {profile.socials.map((social, index) => (
                <div className={styles.rowCard} key={index}>
                  <div className={styles.rowTop}><strong>Social link {index + 1}</strong><RemoveButton disabled={profile.socials.length === 1} onClick={() => setProfile((current) => ({ ...current, socials: removeListItem(current.socials, index) }))} /></div>
                  <div className={styles.gridThree}>
                    <Field label="Label" name={`socials.${index}.label`} value={social.label} error={fieldError(`socials.${index}.label`)} onChange={(value) => setSocial(index, "label", value)} />
                    <Field label="URL" name={`socials.${index}.url`} type="url" value={social.url} error={fieldError(`socials.${index}.url`)} onChange={(value) => setSocial(index, "url", value)} />
                    <SelectField label="Icon" name={`socials.${index}.icon`} value={social.icon} options={socialIconOptions} onChange={(value) => setSocial(index, "icon", value)} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className={styles.formFooter}>
            <div role="status" aria-live="polite" className={styles.status}>{status}</div>
            <div className={styles.footerButtons}>
              <button className={styles.resetButton} type="button" onClick={handleReset}><RotateCcw aria-hidden="true" /> Reset to defaults</button>
              <button className={styles.saveButton} type="submit"><Save aria-hidden="true" /> Save changes</button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}

function ImagePicker({ title, inputId, imageUrl, imageAlt, shape, hasTemporaryPreview, error, onChange, onRemove }: {
  title: string;
  inputId: string;
  imageUrl: string;
  imageAlt: string;
  shape: "logo" | "hero";
  hasTemporaryPreview: boolean;
  error: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
}) {
  return (
    <div className={styles.imagePanel}>
      <div className={styles.imagePanelHeader}>
        <div><h3>{title}</h3><p>{hasTemporaryPreview ? "Temporary preview" : "Current profile image"}</p></div>
        <label className={styles.uploadButton} htmlFor={inputId}><ImageUp aria-hidden="true" /> {hasTemporaryPreview ? "Replace" : "Choose"}</label>
        <input className={styles.fileInput} id={inputId} aria-label={title} type="file" accept="image/jpeg,image/png,image/webp" onChange={onChange} />
      </div>
      {error && <p className={styles.imageError} role="alert">{error}</p>}
      <div className={`${styles.previewFrame} ${shape === "logo" ? styles.logoPreview : styles.heroPreview}`}>
        <Image src={imageUrl} alt={imageAlt} fill sizes={shape === "logo" ? "140px" : "(max-width: 680px) 90vw, 420px"} unoptimized={imageUrl.startsWith("blob:")} />
      </div>
      <button className={styles.previewRemove} type="button" disabled={!hasTemporaryPreview} onClick={onRemove} aria-label={`Remove ${shape} preview`}><X aria-hidden="true" /> Remove preview</button>
    </div>
  );
}

interface FieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: "text" | "tel" | "url";
  multiline?: boolean;
}

function Field({ label, name, value, onChange, error, type = "text", multiline }: FieldProps) {
  const errorId = `${name}-error`;
  return (
    <label className={styles.field}>
      <span>{label}</span>
      {multiline ? (
        <textarea name={name} value={value} onChange={(event) => onChange(event.target.value)} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} />
      ) : (
        <input name={name} type={type} value={value} onChange={(event) => onChange(event.target.value)} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} />
      )}
      {error && <small id={errorId}>{error}</small>}
    </label>
  );
}

function SelectField({ label, name, value, options, onChange }: { label: string; name: string; value: string; options: Array<{ value: string; label: string }>; onChange: (value: string) => void }) {
  return (
    <label className={styles.field}>
      <span>{label}</span>
      <select name={name} value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}
      </select>
    </label>
  );
}

function RepeatableHeading({ number, title, description, actionLabel, onAdd }: { number: string; title: string; description: string; actionLabel: string; onAdd: () => void }) {
  return (
    <div className={styles.cardHeading}>
      <div><span>{number}</span><h2>{title}</h2></div>
      <p>{description}</p>
      <button className={styles.addButton} type="button" onClick={onAdd}><Plus aria-hidden="true" /> {actionLabel}</button>
    </div>
  );
}

function RemoveButton({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return <button className={styles.removeButton} type="button" disabled={disabled} onClick={onClick} aria-label="Remove row"><Trash2 aria-hidden="true" /></button>;
}
