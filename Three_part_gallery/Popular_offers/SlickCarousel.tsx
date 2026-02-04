"use client"; // важная директива, показывающая, что этот компонент клиентский

import dynamic from "next/dynamic";
import React from "react";

// Импортируем стили для slick-carousel.
// Часто их подключают в глобальном CSS или в _app, но можно и тут:
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Делаем динамический импорт самого react-slick, отключая SSR:
const Slider = dynamic(() => import("react-slick"), {
  ssr: false,
  loading: () => <div>Загрузка слайдера...</div>,
});

type SlickCarouselProps = {
  settings: any;
  children: React.ReactNode;
};

export default function SlickCarousel({ settings, children }: SlickCarouselProps) {
  return <Slider {...settings}>{children}</Slider>;
}
