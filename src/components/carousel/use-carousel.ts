import { useEffect, useState } from "react";
import type { CarouselItem } from "./carousel.types";

const DEFAULT_MAX_ITEMS = 5;

const SM_WIDTH = 480;
const MD_WIDTH = 768;
const LG_WIDTH = 1024;

export const useCarousel = (items: CarouselItem[]) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(DEFAULT_MAX_ITEMS);
  const [maxIndex, setMaxIndex] = useState(0);

  const shouldEnableNavigation = items.length > itemsPerView;
  
  useEffect(() => {
    const updateItemsPerView = () => {
      let newItemsPerView = DEFAULT_MAX_ITEMS;
      
      if (window.innerWidth <= SM_WIDTH) {
        newItemsPerView = 2;
      } else if (window.innerWidth <= MD_WIDTH) {
        newItemsPerView = 3;
      } else if (window.innerWidth <= LG_WIDTH) {
        newItemsPerView = 4;
      }
      
      setItemsPerView(newItemsPerView);
      setMaxIndex(Math.max(0, items.length - newItemsPerView));
    };
    
    updateItemsPerView();
    
    window.addEventListener('resize', updateItemsPerView);

    return () => {
      window.removeEventListener('resize', updateItemsPerView);
    };
  }, [items.length]);

  const updateIndex = (newIndex: number) => {
    if (newIndex < 0) {
      newIndex = 0;
    } else if (newIndex > maxIndex) {
      newIndex = maxIndex;
    }

    setActiveIndex(newIndex);
  };

  return {
    activeIndex,
    maxIndex,
    itemsPerView,
    updateIndex,
    shouldEnableNavigation
  }
}