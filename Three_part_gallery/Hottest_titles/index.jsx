import Link from "next/link";
import Image from "next/image";
import DOMPurify from "isomorphic-dompurify";
import i18n from "@/i18n.server";
import styles from "./styled.components.module.css";
import premium from "@/public/newimages/premium.png";

export default function Popular_offers({
  brands,
  partner_id,
  keyword,
  locale,
  ad_campaign_id,
}) {
  const t = i18n.getFixedT(locale, "translation");

  // Находим все бренды с priority: "Popular"
  const priorityBrands = brands.filter(
    (item) => item.brand.priority === "Hottest"
  );

  // Убираем дубликаты из остальных брендов
  const otherBrands = brands.filter(
    (item) => item.brand.priority !== "Hottest"
  );

  // Собираем итоговый массив, гарантируя наличие всех priority = Popular (в пределах лимита)
  const mergedBrands = [...priorityBrands, ...otherBrands];

  // Удаляем дубликаты по `brand.id` (на всякий случай)
  const uniqueBrands = Array.from(
    new Map(mergedBrands.map((item) => [item.brand.id, item])).values()
  );

  // Берём только нужное количество брендов (5 для десктопа, 4 для мобилки)
  const displayedBrands = uniqueBrands.slice(0, 5);

  return (
    <>
      <div className={styles.fivehot}>
        <div className="main__container">
          <div>
            <div className={styles.fivehotBanner}>
              <h3>
                {t("Top")} {5}{" "}
                <span className={styles.spanOrange}>{t("Festive")}</span>{" "}
                <span>{t("casinos")}</span>
              </h3>
              <p className="!text-xl mt-5">
                {t(
                  "Celebrate the season with big wins and exclusive surprises!"
                )}
              </p>
            </div>
            <ul
              role="list"
              className={`grid grid-cols-1 gap-5 sm:gap-6 ${styles.ulList}`}
            >
              {displayedBrands.slice(0, 5).map((item, index) => {
                const { brand, content } = item;
                const sanitizedContent = DOMPurify.sanitize(content.value);
                const imageSrc = `/images/${brand.brand_logo}.png`;
                const url = `${content.our_link}?source=${partner_id}&ad_campaign_id=${ad_campaign_id}&keyword=${keyword}&creative_id=Hottest_2`;
                const isZlatobet = brand.casino_brand === "Zlatobet";
                const isFairspin = brand.casino_brand === "Fairspin";

                return (
                  <Link
                    key={index}
                    className={`${brand.casino_brand}`}
                    href={`${url}`}
                    target="_blank"
                  >
                    <li key={index} className="col-span-1">
                      <div className={styles.liImg}>
                        <Image
                          src={imageSrc}
                          alt={imageSrc}
                          width={58}
                          height={58}
                          loading="lazy"
                          quality={70}
                          placeholder="blur"
                          blurDataURL="/placeholder.png"
                        />
                      </div>
                      <div className="flex items-center flex-col w-full">
                        <div className="flex-1 px-4 text-sm h-full w-full">
                          <a href={`${url}`} className="font-medium">
                            {brand.casino_brand}
                          </a>
                          <p
                            dangerouslySetInnerHTML={{
                              __html: sanitizedContent,
                            }}
                            itemProp="!m-0"
                          />
                        </div>
                        <div
                          className={`flex-shrink-0 pr-2 flex justify-end w-full ${styles.btns}`}
                        >
                          {isZlatobet && (
                            <div className={`flex ${styles.promo}`}>
                              <Image
                                src={premium}
                                alt={premium}
                                width={27}
                                height={27}
                                loading="lazy"
                                quality={70}
                                className="mr-1"
                              />

                              <button>{t("VPN friendly crypto casino")}</button>
                            </div>
                          )}
                          {isFairspin && (
                            <div className={`flex ${styles.promo}`}>
                              <Image
                                src={premium}
                                alt={premium}
                                width={27}
                                height={27}
                                loading="lazy"
                                quality={70}
                                className="mr-1"
                              />

                              <button>{t("+10% Crypto Bonus")}</button>
                            </div>
                          )}
                          <a
                            type="button"
                            className={`inline-flex h-8 items-center justify-center rounded-full bg-transparent ${styles.luckyBtn} text-white px-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                          >
                            {t("Play Now")}
                          </a>
                        </div>
                      </div>
                    </li>
                  </Link>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
