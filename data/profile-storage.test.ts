import { describe, expect, it } from "vitest";
import { profiles } from "./profiles";
import {
  PROFILE_STORAGE_VERSION,
  profileStorageKey,
  readStoredProfile,
  resetStoredProfile,
  saveStoredProfile,
} from "./profile-storage";

class MemoryStorage implements Storage {
  private values = new Map<string, string>();
  get length() { return this.values.size; }
  clear() { this.values.clear(); }
  getItem(key: string) { return this.values.get(key) ?? null; }
  key(index: number) { return [...this.values.keys()][index] ?? null; }
  removeItem(key: string) { this.values.delete(key); }
  setItem(key: string, value: string) { this.values.set(key, value); }
}

describe("profile storage", () => {
  const defaultProfile = profiles.tyrees;

  it("uses a stable username-scoped key", () => {
    expect(profileStorageKey("tyrees")).toBe("suds.profile.tyrees");
  });

  it("saves and reads a complete versioned profile", () => {
    const storage = new MemoryStorage();
    const edited = { ...defaultProfile, businessName: "Tyrees Test Edit" };

    saveStoredProfile(storage, edited);

    expect(JSON.parse(storage.getItem(profileStorageKey("tyrees"))!)).toEqual({
      version: PROFILE_STORAGE_VERSION,
      profile: edited,
    });
    expect(readStoredProfile(storage, defaultProfile).businessName).toBe("Tyrees Test Edit");
  });

  it.each([
    ["missing data", null],
    ["malformed JSON", "not-json"],
    ["old version", JSON.stringify({ version: 0, profile: defaultProfile })],
    ["incomplete profile", JSON.stringify({ version: 1, profile: { username: "tyrees" } })],
  ])("falls back to typed defaults for %s", (_label, storedValue) => {
    const storage = new MemoryStorage();
    if (storedValue) storage.setItem(profileStorageKey("tyrees"), storedValue);

    expect(readStoredProfile(storage, defaultProfile)).toBe(defaultProfile);
  });

  it("clears the username-scoped override", () => {
    const storage = new MemoryStorage();
    saveStoredProfile(storage, defaultProfile);

    resetStoredProfile(storage, "tyrees");

    expect(storage.getItem(profileStorageKey("tyrees"))).toBeNull();
  });
});
