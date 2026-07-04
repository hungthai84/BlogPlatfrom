import { useState, useEffect } from "react";
import { articles as staticArticles, Article, defaultAuthor } from "../data/articles";

export interface Collection {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

const DEFAULT_COLLECTIONS: Collection[] = [
  {
    id: "col-1",
    name: "Du lịch & Trải nghiệm",
    description: "Những bài viết ghi lại hành trình khám phá thế giới và tìm kiếm bản thân.",
    createdAt: "12/10/2023",
  },
  {
    id: "col-2",
    name: "Nhiếp ảnh & Nghệ thuật",
    description: "Nhật ký lưu giữ những khoảnh khắc đẹp qua ống kính máy ảnh.",
    createdAt: "28/09/2023",
  },
  {
    id: "col-3",
    name: "Phong cách sống",
    description: "Những chia sẻ về thói quen, chánh niệm và cuộc sống thường nhật.",
    createdAt: "15/09/2023",
  },
];

export function useArticles() {
  const [collections, setCollections] = useState<Collection[]>(() => {
    try {
      const saved = localStorage.getItem("plus_ui_collections");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to parse collections", e);
    }
    return DEFAULT_COLLECTIONS;
  });

  const [customArticles, setCustomArticles] = useState<Article[]>(() => {
    try {
      const saved = localStorage.getItem("plus_ui_custom_articles");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to parse custom articles", e);
    }
    return [];
  });

  const [articlesList, setArticlesList] = useState<Article[]>([]);

  // Merge static and custom articles
  useEffect(() => {
    // We can also associate pre-defined articles with default collections
    const enrichedStatic = staticArticles.map(art => {
      // Seed some collection associations
      let collectionId = undefined;
      if (art.tags.includes("Du lịch")) collectionId = "col-1";
      else if (art.tags.includes("Nhiếp ảnh")) collectionId = "col-2";
      else if (art.tags.includes("Phong cách sống")) collectionId = "col-3";
      
      return {
        ...art,
        collectionId
      };
    });

    setArticlesList([...enrichedStatic, ...customArticles]);
  }, [customArticles]);

  // Save collections to localStorage
  const addCollection = (name: string, description: string) => {
    const newCol: Collection = {
      id: "col-" + Date.now(),
      name,
      description,
      createdAt: new Date().toLocaleDateString("vi-VN"),
    };
    const updated = [...collections, newCol];
    setCollections(updated);
    localStorage.setItem("plus_ui_collections", JSON.stringify(updated));
    return newCol;
  };

  const deleteCollection = (id: string) => {
    const updated = collections.filter(c => c.id !== id);
    setCollections(updated);
    localStorage.setItem("plus_ui_collections", JSON.stringify(updated));

    // Remove collection association from custom articles
    const updatedArticles = customArticles.map(art => {
      if (art.collectionId === id) {
        return { ...art, collectionId: undefined };
      }
      return art;
    });
    setCustomArticles(updatedArticles);
    localStorage.setItem("plus_ui_custom_articles", JSON.stringify(updatedArticles));
  };

  // Article Actions
  const addArticle = (newArt: Omit<Article, "id"> & { id?: string; collectionId?: string }) => {
    const art: Article & { collectionId?: string } = {
      ...newArt,
      id: newArt.id || Date.now().toString(),
    };
    const updated = [art, ...customArticles];
    setCustomArticles(updated);
    localStorage.setItem("plus_ui_custom_articles", JSON.stringify(updated));

    // Also call server API in background to keep in sync with Drive if configured
    fetch("/api/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([...staticArticles, ...updated]),
    }).catch(err => console.warn("Failed to sync article to server:", err));

    return art;
  };

  const updateArticle = (updatedArt: Article & { collectionId?: string }) => {
    // Check if it's a custom article or we want to override a static article
    const isCustom = customArticles.some(a => a.id === updatedArt.id);
    
    let newCustom: Article[];
    if (isCustom) {
      newCustom = customArticles.map(a => a.id === updatedArt.id ? updatedArt : a);
    } else {
      // If editing a static article, save it into custom articles list which overrides it
      newCustom = [...customArticles, updatedArt];
    }
    
    setCustomArticles(newCustom);
    localStorage.setItem("plus_ui_custom_articles", JSON.stringify(newCustom));

    fetch("/api/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([...staticArticles, ...newCustom]),
    }).catch(err => console.warn("Failed to sync article update to server:", err));
  };

  const deleteArticle = (id: string) => {
    // Check if it's custom
    const updatedCustom = customArticles.filter(a => a.id !== id);
    setCustomArticles(updatedCustom);
    localStorage.setItem("plus_ui_custom_articles", JSON.stringify(updatedCustom));

    // Also if we "delete" a static article, we can track deleted static ids in localStorage
    const deletedStaticIds = JSON.parse(localStorage.getItem("plus_ui_deleted_static_ids") || "[]");
    if (staticArticles.some(a => a.id === id)) {
      deletedStaticIds.push(id);
      localStorage.setItem("plus_ui_deleted_static_ids", JSON.stringify(deletedStaticIds));
    }

    fetch("/api/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([...staticArticles.filter(a => !deletedStaticIds.includes(a.id)), ...updatedCustom]),
    }).catch(err => console.warn("Failed to sync article deletion to server:", err));
  };

  // Filter out deleted static articles
  const deletedStaticIds: string[] = JSON.parse(localStorage.getItem("plus_ui_deleted_static_ids") || "[]");
  const filteredArticlesList = articlesList.filter(a => !deletedStaticIds.includes(a.id));

  return {
    articles: filteredArticlesList,
    collections,
    addArticle,
    updateArticle,
    deleteArticle,
    addCollection,
    deleteCollection,
  };
}
