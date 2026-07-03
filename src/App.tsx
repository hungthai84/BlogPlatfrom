/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createContext, useContext, useState } from "react";
import { Home } from "./pages/Home";
import { Post } from "./pages/Post";
import { Photography } from "./pages/Photography";
import { Bookmarks } from "./pages/Bookmarks";
import { Write } from "./pages/Write";
import { Settings } from "./pages/Settings";
import { ScrollToTop } from "./components/ScrollToTop";
import { Layout } from "./components/Layout";

const BackgroundContext = createContext<{
  background: string;
  backgroundType: 'image' | 'video' | 'gradient' | 'pattern' | 'default';
  cardOpacity: number;
  setBackgroundSetting: (type: 'image' | 'video' | 'gradient' | 'pattern' | 'default', value: string) => void;
  setCardOpacity: (opacity: number) => void;
}>({
  background: 'default',
  backgroundType: 'default',
  cardOpacity: 0.6,
  setBackgroundSetting: () => {},
  setCardOpacity: () => {},
});

export const useBackgroundContext = () => useContext(BackgroundContext);

export default function App() {
  const [background, setBackground] = useState<string>('default');
  const [backgroundType, setBackgroundType] = useState<'image' | 'video' | 'gradient' | 'pattern' | 'default'>('default');
  const [cardOpacity, setCardOpacity] = useState<number>(0.6);

  const setBackgroundSetting = (type: 'image' | 'video' | 'gradient' | 'pattern' | 'default', value: string) => {
    setBackground(value);
    setBackgroundType(type);
  };

  return (
    <BackgroundContext.Provider value={{ background, backgroundType, cardOpacity, setBackgroundSetting, setCardOpacity }}>
      <BrowserRouter>
        <ScrollToTop />
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/photography" element={<Photography />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="/write" element={<Write />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/post/:slug" element={<Post />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </BackgroundContext.Provider>
  );
}

