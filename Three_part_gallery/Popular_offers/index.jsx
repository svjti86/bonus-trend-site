// "use client"; // если вы делаете его клиентским (например, нужен useState, useEffect и т.п.)
// // Если он всё же серверный — придётся отказаться от прямого использования i18n.server и передавать переводы пропсами

import Link from "next/link";
import Image from "next/image";
import DOMPurify from "isomorphic-dompurify";
// ВАЖНО: i18n.server использовать тут нельзя, если это "use client"
import i18n from "@/i18n.server";
import styles from "./styled.components.module.css";

import SlickCarousel from "./SlickCarousel"; // Импортируем обёртку

export default function Popular_offers({
  brands,
  partner_id,
  keyword,
  locale,
  ad_campaign_id
}) {
  // обратите внимание, что `t` (функцию перевода) лучше получить пропсом,
  // если вы из родительского серверного компонента передаёте переводы.
  // или же используйте i18n в родительском серверном компоненте
  // и прокидывайте сюда уже готовую строку.
  const t = i18n.getFixedT(locale, "translation");

  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    autoplaySpeed: 2000,
    arrows: true,
    slidesToShow: 2,
    slidesToScroll: 2,
    cssEase: "linear",
    responsive: [
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          dots: false,
        },
      },
      {
        breakpoint: 420,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          dots: false,
        },
      },
    ],
  };

  // Находим все бренды с priority: "Popular"
  const priorityBrands = brands.filter(
    (item) => item.brand.priority === "Popular"
  );

  // Убираем дубликаты из остальных брендов
  const otherBrands = brands.filter(
    (item) => item.brand.priority !== "Popular"
  );

  // Собираем итоговый массив, гарантируя наличие всех priority = Popular (в пределах лимита)
  const mergedBrands = [...priorityBrands, ...otherBrands];

  // Удаляем дубликаты по `brand.id` (на всякий случай)
  const uniqueBrands = Array.from(
    new Map(mergedBrands.map((item) => [item.brand.id, item])).values()
  );

  // Берём только нужное количество брендов (6 для десктопа, 5 для мобилки)
  const displayedBrands = uniqueBrands.slice(0, 6);
  const displayedMobileBrands = uniqueBrands.slice(0, 5);

  return (
    <div className={styles.popularOffers}>
      <div className="main__container">
        <div className="w-full">
          <div className={`flex justify-between mt-16 ${styles.mobMt16}`}>
            <h2
              className={`text-3xl tracking-tight text-white ${styles.randomTitle}`}
            >
              {t("POPULAR")} <span>{t("offers")}</span>
            </h2>
          </div>

          {/* --- Десктопная версия --- */}
          <div className={`mx-auto max-w-2xl px-4 lg:max-w-7xl lg:px-8 hidden md:inline ${styles.pop}`}>
            <div className={styles.cardsThr}>
              {displayedBrands.slice(0, 6).map((item, index) => {
                const { brand, content } = item;
                const sanitizedContent = DOMPurify.sanitize(content.value);
                const imageSrc = `/images/${brand.brand_logo}.png`;
                const url = `${content.our_link}?source=${partner_id}&  ad_campaign_id=${ad_campaign_id}&keyword=${keyword}&creative_id=Popular_Offers_2`;
                return (
                  <div
                    key={"Popular_offers" + index}
                    className={`${styles.cardThr} ${
                      brand.prime_brand ? styles[brand.prime_brand] : ""
                    }`}
                  >
                    <div className={styles.relative}>
                      <div className="relative flex align-center justify-center">
                        <Link href={`${url}`} target="_blank">
                          <Image
                            src={imageSrc}
                            alt={`logo-${imageSrc}`}
                            width={190}
                            height={130}
                            loading="lazy"
                            className="w-full object-contain object-center"
                            quality={70}          
                            placeholder="blur"     
                            blurDataURL="/placeholder.png" 
                          />
                        </Link>
                      </div>
                      <div className="relative mt-4 text-center">
                        <h3 className="text-lg  text-gray-900">
                          {brand.casino_brand}
                        </h3>
                        <p
                          dangerouslySetInnerHTML={{
                            __html: sanitizedContent,
                          }}
                          itemProp="mt-1 text-sm text-gray-500 h-10"
                        />
                      </div>
                    </div>
                    <div className={styles.btnCrd}>
                      <Link
                        href={`${url}`}
                        target="_blank"
                        className={`relative flex items-center justify-center px-8 py-2 text-lg font-medium rounded-full text-white ${styles.btnBlick} overflow-hidden`}
                      >
                        {t("Play Now")}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* --- Мобильная версия --- */}
          <div className={`md:hidden w-full ${styles.mobSl}`}>
            <div className={`${styles.cardsTh} !mt-0 mmb-1`}>
          
              <SlickCarousel settings={settings}>
                {displayedMobileBrands.slice(0, 5).map((item, index) => {
                  const { brand, content } = item;
                  const sanitizedContent = DOMPurify.sanitize(content.value);
                  const imageSrc = `/images/${brand.brand_logo}.png`;
                  const url = `${content.our_link}?source=${partner_id}&keyword=${keyword}&creative_id=Popular_Offers_2`;
                  return (
                    <div
                      className={`overflow-hidden ${styles.cardThr}`}
                      key={"Mobile_offers" + index}
                    >
                      <div className={styles.pm10}>
                        <div className={styles.imgp}>
                          <Link target="_blank" href={`${url}`}>
                            <Image
                              src={imageSrc}
                              alt={`logo-${imageSrc}`}
                              width={100}
                              height={100}
                              loading="lazy"
                              className="w-full object-contain object-center"
                              quality={70}          
                              placeholder="blur"     
                              blurDataURL="/placeholder.png" 
                            />
                          </Link>
                        </div>
                        <div className="mt-4 text-center">
                          <h3 className="text-lg  text-gray-900">
                            {brand.casino_brand}
                          </h3>
                          <p
                            dangerouslySetInnerHTML={{
                              __html: sanitizedContent,
                            }}
                            itemProp="mt-1 text-sm"
                          />
                        </div>
                      </div>
                      <div className="mt-6">
                        <Link
                          href={`${url}`}
                          target="_blank"
                          className={`flex items-center justify-center text-white ${styles.btnCrd}`}
                        >
                          {t("Play Now")}
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </SlickCarousel>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
