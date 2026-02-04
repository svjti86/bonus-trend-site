"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./styled.components.module.css";
import { useTranslation } from "react-i18next";


// Небольшая утилита для перемешивания массива (если нужно случайно)
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
export default function Advent({ brands = [], partner_id, keyword, locale, ad_campaign_id }) {
  // Отображаем только 3 бренда
  // Если хочешь первые 3 — убираешь shuffle
  const [finalBrands, setFinalBrands] = useState([]);
  const { t } = useTranslation();


  // Состояния для активаций
  const [activatedCardIndices, setActivatedCardIndices] = useState([]);
  const [lastActivationDate, setLastActivationDate] = useState(null);
  const [activatedBrandsToday, setActivatedBrandsToday] = useState([]);

  // При монтировании выбираем ровно 3 бренда
  useEffect(() => {
    if (brands.length > 0) {
      // если случайно, то
      const shuffled = shuffle(brands);
      const selected3 = shuffled.slice(0, 3);
      setFinalBrands(selected3);

      // если хочешь взять просто первые 3 без перемешивания, делай:
      // setFinalBrands(brands.slice(0, 3));
    }
  }, [brands]);

  // Функция получения даты в формате YYYY-MM-DD
  const getTodayDateString = () => new Date().toISOString().split("T")[0];

  // При первом рендере читаем из localStorage, чтобы знать,
  // кто уже активировал и сколько раз
  useEffect(() => {
    const savedActivationDate = localStorage.getItem("lastActivationDate");
    const savedActivatedCards = localStorage.getItem("activatedCardIndices");
    const savedActivatedBrands = localStorage.getItem("activatedBrandsToday");
    const today = getTodayDateString();

    if (savedActivationDate === today) {
      setLastActivationDate(savedActivationDate);
      setActivatedCardIndices(
        savedActivatedCards ? JSON.parse(savedActivatedCards) : []
      );
      setActivatedBrandsToday(
        savedActivatedBrands ? JSON.parse(savedActivatedBrands) : []
      );
    } else {
      // Новый день — сбрасываем данные
      localStorage.removeItem("lastActivationDate");
      localStorage.removeItem("activatedCardIndices");
      localStorage.removeItem("activatedBrandsToday");
      setLastActivationDate(null);
      setActivatedCardIndices([]);
      setActivatedBrandsToday([]);
    }
  }, []);

  // Обработка клика по кнопке "Activate"
  const handleActivate = (index) => {
    const today = getTodayDateString();
    const currentActivated =
      lastActivationDate === today ? activatedCardIndices : [];

    if (currentActivated.length >= 3) {
      alert("You have already activated 3 cards today");
      return;
    }
    if (currentActivated.includes(index)) return;

    const newActivatedIndices = [...currentActivated, index];
    const brand = finalBrands[index];
    const brandName = (brand?.CasinoBrand || "").trim();
    const newActivatedBrands =
      lastActivationDate === today
        ? [...activatedBrandsToday, brandName]
        : [brandName];

    // Запоминаем новую активацию
    setActivatedCardIndices(newActivatedIndices);
    setActivatedBrandsToday(newActivatedBrands);
    setLastActivationDate(today);

    localStorage.setItem(
      "activatedCardIndices",
      JSON.stringify(newActivatedIndices)
    );
    localStorage.setItem(
      "activatedBrandsToday",
      JSON.stringify(newActivatedBrands)
    );
    localStorage.setItem("lastActivationDate", today);

    // Запоминаем в excludedBrands (если нужно не показывать их завтра)
    let excludedRaw = localStorage.getItem("excludedBrands");
    let excludedArr = [];
    if (excludedRaw) {
      try {
        excludedArr = JSON.parse(excludedRaw);
      } catch {
        excludedArr = [];
      }
    }
    const lowerName = brandName.toLowerCase();
    if (!excludedArr.includes(lowerName)) {
      excludedArr.push(lowerName);
    }
    localStorage.setItem("excludedBrands", JSON.stringify(excludedArr));

    console.log(
      "Activated brand:",
      brandName,
      "=> activatedIndices:",
      newActivatedIndices,
      "=> excludedArr:",
      excludedArr
    );
  };

  const todayStr = getTodayDateString();
  const totalActivated =
    lastActivationDate === todayStr ? activatedCardIndices.length : 0;

    // console.log(finalBrands, "finalBrands");

  return (
    <div
      id="advent"
      className={`sm:mt-10 mt-5 mb-5 mob-mt10 ${styles.advent} mb-16`}
    >
      <div className={`main__container ${styles.advnt}`}>
        <h2
          className={`text-3xl tracking-tight text-white ${styles.randomTitle} mb-3 text-center`}
        >
          {t("Tonight’s Pick: Triple the Thrill!")}
        </h2>
        <p className={`mb-3 text-center text-white ${styles.txtmob}`}>
          {t("Three shots at luck—no waiting, no limits. Crack open all three picks and discover which surprises are hiding inside.")}
        </p>
        <div
          className={`w-full ${styles.brand_carousel} rounded-md flex justify-between items-center flex-wrap mt-16 ${styles.mobMt16}`}
        >
          {finalBrands.map((item, index) => {
            const activatedToday = lastActivationDate === todayStr;
            const isActivated =
              activatedToday && activatedCardIndices.includes(index);
            const { brand, content } = item;
            const sanitizedContent = DOMPurify.sanitize(content.value);
            const imageSrc = `/images/${brand.brand_logo}.png`;
            const url = `${content.our_link}?source=${partner_id}&keyword=${keyword}&ad_campaign_id=${ad_campaign_id}&creative_id=Everyday_Advent`;
            return (
              <div
                key={index}
                className={`${
                  styles.cardAdvent
                } rounded-xl flex flex-col justify-between basis-[32%] relative mt-16 ${
                  isActivated ? styles.activate : styles.closed
                }`}
              >
                <div className={styles.dated}>{index + 1}</div>
                <div className="mx-auto max-w-7xl flex flex-col w-full">
                  <div
                    className={`mx-auto max-w-2xl lg:mx-0 flex flex-row ${styles.cardSl}`}
                  >
                    <div className="w-full">
                      {isActivated ? (
                        // Открытая карточка
                        <div className="flex flex-col items-center">
                          <Link
                            className="mt-3 mb-2"
                            href={`${url}`}
                            target="_blank"
                          >
                            <Image
                              src={imageSrc}
                              alt={`logo-${imageSrc}`}
                              width={256}
                              height={128}
                              loading="lazy"
                              className={styles.cardSlImg}
                              quality={70}          
                              placeholder="blur"     
                              blurDataURL="/placeholder.png" 
                            />
                          </Link>

                          <p
                            dangerouslySetInnerHTML={{
                              __html: sanitizedContent,
                            }}
                            itemProp="!m-0"
                          />
                          <Link
                            className={`relative ${styles.btnPlay} overflow-hidden`}
                            href={`${url}`}
                            target="_blank"
                          >
                            {t("Play Now")}
                          </Link>
                        </div>
                      ) : (
                        // Закрытая карточка
                        <div className="flex flex-col items-center">
                          <div className={`mt-3 mb-2 ${styles.nonoact}`}></div>
                          {/* <p className="!m-0">
                            {totalActivated >= 3
                              ? "You have activated 3 cards today"
                              : "Ready to Activate"}
                          </p> */}
                          {totalActivated >= 3 ? (
                            <button
                              disabled
                              className={`relative ${styles.btnPlay} overflow-hidden not-yet`}
                            >
                              {t("Not Yet")}
                            </button>
                          ) : (
                            <button
                              className={`relative ${styles.btnPlay} overflow-hidden`}
                              onClick={() => handleActivate(index)}
                            >
                              {t("Activate")}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {finalBrands.length === 0 && (
            <div className="text-white text-center">{t("No Brands Available")}</div>
          )}
        </div>
      </div>
    </div>
  );
}
