import { Fragment, useEffect, useRef, useState } from "react";

import PageIndicator from "./PageIndicator";
import ScrollButton from "./ScrollButton";
import MediaCard from "../MediaCard";

import useIsOnMobile from "../../hooks/useIsOnMobile";

import { Media } from "../../misc/types";
import Skeleton from "../Skeleton";

const MEDIA_CARD_DIV_WIDTH = 272; // Includes 8px right-gap
const LEFT_END_SPACE_WIDTH = 48; // Includes 8px right-gap
const RIGHT_END_SPACE_WIDTH = 16; // 16px, no right-gap
const TOTAL_SPACE_WIDTH = LEFT_END_SPACE_WIDTH + RIGHT_END_SPACE_WIDTH;

export interface MediaItemsRowProps {
  title: string;
  mediaItems?: Media[];
}

const MediaItemsRowSkeleton = ({ className }: { className: string }) => {
  return (
    <div
      className={`flex flex-col gap-4 pl-4 pb-2 sm:gap-4 sm:pl-12 ${className} overflow-hidden`}
    >
      <Skeleton className="h-8 w-70" />
      <div className="flex gap-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="shrink-0 w-30 h-45 sm:w-66 sm:h-36" />
        ))}
      </div>
    </div>
  );
};

const MediaItemsRow = ({
  title,
  mediaItems,
  ...rest
}: MediaItemsRowProps & React.ComponentProps<"div">) => {
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const scrollableDiv = useRef<HTMLDivElement | null>(null);
  const isProgrammaticScroll = useRef<boolean>(false);

  const isOnMobile = useIsOnMobile();

  const canScrollLeft = currentPage > 0;
  const canScrollRight = currentPage < totalPages - 1;

  const computePaginationStates = () => {
    const currentDiv = scrollableDiv.current;
    if (!currentDiv) return;

    // Compute TotalPages and CurrentPage
    const actualScrollWidth = currentDiv.scrollWidth - TOTAL_SPACE_WIDTH;
    const visibleMediaItemsCount = Math.floor(
      currentDiv.clientWidth / MEDIA_CARD_DIV_WIDTH
    );

    const step = MEDIA_CARD_DIV_WIDTH * visibleMediaItemsCount;
    const newTotalPages = Math.ceil(actualScrollWidth / step);
    const newCurrentPage = Math.round(currentDiv.scrollLeft / step);

    setCurrentPage(newCurrentPage);
    setTotalPages(newTotalPages);
  };

  useEffect(() => {
    // Initial compute once the items are loaded.
    if (mediaItems && mediaItems.length > 0) {
      computePaginationStates();
    }
  }, [mediaItems]);

  useEffect(() => {
    if (!scrollableDiv.current) return;

    const handleScroll = () => {
      if (isProgrammaticScroll.current) return;
      computePaginationStates();
    };

    const handleScrollEnd = () => {
      isProgrammaticScroll.current = false;
    };

    scrollableDiv.current.addEventListener("scroll", handleScroll);
    scrollableDiv.current.addEventListener("scrollend", handleScrollEnd);

    return () => {
      if (!scrollableDiv.current) return;
      scrollableDiv.current.removeEventListener("scroll", handleScroll);
      scrollableDiv.current.removeEventListener("scrollend", handleScrollEnd);
    };
  }, [scrollableDiv.current]);

  useEffect(() => {
    window.addEventListener("resize", computePaginationStates);
    return () => window.removeEventListener("resize", computePaginationStates);
  }, []);

  /**
   * Moves the scrollable div to show the targetPage based on direction
   * @param direction -1 for previous page, 1 next page
   */
  const shiftPage = (direction: -1 | 1) => {
    const currentDiv = scrollableDiv.current;
    if (currentDiv) {
      isProgrammaticScroll.current = true;

      const visibleMediaItemsCount = Math.floor(
        currentDiv.clientWidth / MEDIA_CARD_DIV_WIDTH
      );

      const step = MEDIA_CARD_DIV_WIDTH * visibleMediaItemsCount;
      const targetPage = Math.max(
        0,
        Math.min(currentPage + direction, totalPages)
      );
      setCurrentPage(targetPage);
      const targetPageScrollLeft = step * targetPage;

      currentDiv.scrollTo({
        left: targetPageScrollLeft,
        behavior: "smooth",
      });
    }
  };

  /**
   * KeyValue Record of each mediaItem loadState/isLoaded. See onImageLoad, we set
   * mediaItem.id -> true. Then check on isDoneLoadingAll if all mediaItem.id has isLoading true
   * recorded here. Then onUnmount, we set records to false.
   */
  const [isMediaCardsLoaded, setIsMediaCardsLoaded] = useState<{
    [key: string]: boolean;
  }>({});

  const isDoneLoadingAll = mediaItems?.every(
    (mediaItem) => !!isMediaCardsLoaded[mediaItem.id]
  );

  const isShowSkeleton = !mediaItems || !isDoneLoadingAll;

  return (
    <div {...rest}>
      {isShowSkeleton && (
        <MediaItemsRowSkeleton
          className={
            !!mediaItems ? "absolute inset-0 pt-3 z-0" : "sm:pt-3 sm:pb-15"
          }
        />
      )}
      {mediaItems && (
        <section
          className={`group/root transition-opacity duration-200 ease-in sm:relative sm:z-0 ${
            isDoneLoadingAll ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex justify-between items-end ml-4 sm:absolute sm:z-0 sm:left-0 sm:right-0 sm:ml-12">
            <h2>{title}</h2>
            {!isOnMobile && (
              <PageIndicator
                totalPages={totalPages}
                currentPage={currentPage}
              />
            )}
          </div>
          <div className="relative flex items-center">
            {!isOnMobile && (
              <Fragment>
                <ScrollButton
                  direction="left"
                  onClick={() => shiftPage(-1)}
                  isVisible={canScrollLeft}
                />
                <ScrollButton
                  direction="right"
                  onClick={() => shiftPage(1)}
                  isVisible={canScrollRight}
                />
              </Fragment>
            )}
            <div
              tabIndex={0}
              aria-label={title}
              ref={scrollableDiv}
              className="scrollable sm:pt-15 sm:pb-15"
            >
              <div className="flex items-center gap-2">
                {/** Acts as left padding, also being scrolled so items go through the edges of the screen.*/}
                <div className="shrink-0 w-2 sm:w-10 bg-white"></div>

                {mediaItems.map((mediaItem) => (
                  <MediaCard
                    key={mediaItem.id}
                    media={mediaItem}
                    onImageLoad={() =>
                      setIsMediaCardsLoaded((p) => {
                        return { ...p, [mediaItem.id]: true };
                      })
                    }
                  />
                ))}

                {/** Acts as right padding/space when the user reaches the last page. */}
                <div className="shrink-0 w-2 sm:w-4  h-1"></div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default MediaItemsRow;
