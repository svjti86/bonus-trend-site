import dynamic from "next/dynamic";
import Emoji from "./Emoji_picker";
import Hottest_titles from "./Hottest_titles";
// import Link from "next/link";
// import Image from "next/image";
// import DOMPurify from "isomorphic-dompurify";
// import i18n from "@/i18n.server";
import styles from "./styled.components.module.css";

// const Popular_offers = dynamic(() => import("./Popular_offers"), {
//   ssr: false,
//   loading: () => <p>Loading Popular Offers...</p>,
// });
const Popular_offers = dynamic(
  () => import("@/components/Home_sharks/Three_part_gallery/Popular_offers"),
  { ssr: false }
);

export default async function Three_part_gallery({
  processedBrands_hottest,
  processedBrands_popular,
  processedBrands_vip,
  partner_id,
  keyword,
  locale,
  ad_campaign_id,
}) {
  // const t = i18n.getFixedT(locale, "translation");

  return (
    <>
      <div className={`pt-16 ${styles.mobPt16}`}>
        <div className="main__container">
          <div className="flex justify-start flex-col md:flex-row">
            <div className="basis-1/3">
              <Hottest_titles
                brands={processedBrands_hottest}
                partner_id={partner_id}
                keyword={keyword}
                locale={locale}
                ad_campaign_id={ad_campaign_id}
              />
            </div>
            <div className={`basis-2/3 ${styles.rightC}`}>
              <Emoji
                brands={processedBrands_vip}
                partner_id={partner_id}
                keyword={keyword}
                locale={locale}
                ad_campaign_id={ad_campaign_id}
              />
              <Popular_offers
                brands={processedBrands_popular}
                partner_id={partner_id}
                keyword={keyword}
                locale={locale}
                ad_campaign_id={ad_campaign_id}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
