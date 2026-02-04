import Link from "next/link";
import Image from "next/image";
import i18n from "@/i18n.server";
import styles from "./styled.components.module.css";
import EditorsChoiceIcon from "@/public/newimages/cup.svg";
import VotedIcon from "@/public/newimages/medal2.svg";
import NewIcon from "@/public/newimages/new3.svg";

export default function Banner_small({ brands, partner_id, keyword, locale, ad_campaign_id }) {
  const t = i18n.getFixedT(locale, "translation");

  const cardLabels = [
    {
      labelKey: "Editor’s Choice",
      icon: EditorsChoiceIcon,
      className: styles.editorsChoice,
      btnName: "SEE WHY",
    },
    {
      labelKey: "Voted #1 by Players",
      icon: VotedIcon,
      className: styles.votedByPlayers,
      btnName: "PLAY NOW",
    },
    {
      labelKey: "New on TopBonus",
      icon: NewIcon,
      className: styles.newOnTopBonus,
      btnName: "TRY NOW",
    },
  ];

  return (
    <>
      <div className={styles.emojis}>
        <div className="main__container">
          <div className={`flex justify-center items-center ${styles.faceMob}`}>
            <div
              className={`flex items-center justify-center ${styles.btnsCh}`}
            >
              {brands.slice(0, 3).map((item, index) => {
                const { brand, content } = item;
                const sanitizedContent = DOMPurify.sanitize(content.value);
                const imageSrc = `/images/${brand.brand_logo}.png`;
                const url = `${content.our_link}?source=${partner_id}&  ad_campaign_id=${ad_campaign_id}&keyword=${keyword}&creative_id=Spring_fortune`;
                const { labelKey, icon, className, btnName } =
                  cardLabels[index] || {};
                return (
                  <Link
                    href={`${url}`}
                    target="_blank"
                    key={+index}
                    className={`${styles.cardThr}`}
                  >
                    <div className={styles.relative}>
                      {labelKey && (
                        <div className={`${styles.cardLabel} ${className}`}>
                          {icon && (
                            <span className={styles.cardIcon}>
                              <Image
                                src={icon}
                                width={28}
                                height={28}
                                alt={icon}
                              />
                            </span>
                          )}
                          {t(labelKey)}
                        </div>
                      )}
                      <div className="relative flex align-center justify-center">
                        <Link href={`${url}`} target="_blank">
                          <Image
                            src={imageSrc}
                            alt={`logo-${imageSrc}`}
                            width={204}
                            height={102}
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
                        {t(btnName)}
                      </Link>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
