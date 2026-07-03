import { useState, useEffect } from "react";
import { defaultAuthor, Author } from "../data/articles";

export function useProfile() {
  const [profile, setProfile] = useState<Author>(() => {
    try {
      const saved = localStorage.getItem("plus_ui_profile");
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...defaultAuthor,
          ...parsed
        };
      }
    } catch (e) {
      console.error("Failed to parse profile", e);
    }
    return defaultAuthor;
  });

  const updateProfile = (newProfile: Partial<Author>) => {
    setProfile(prev => {
      const updated = { ...prev, ...newProfile };
      localStorage.setItem("plus_ui_profile", JSON.stringify(updated));
      return updated;
    });
  };

  return { profile, updateProfile };
}
