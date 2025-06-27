// потрібно;
import Link from "next/link";
import s from "./FooterNavigationBlock.module.css";
import { useTranslation } from "react-i18next";

export const FooterNavigationBlock = () => {
  const { t } = useTranslation();

  return (
    <div className={s.navigationBlock}>
      <div className={s.block}>
        <h3>{t("footerNavigation.customers.title")}</h3>

        <ul>
          <li>
            <Link href="/support#faq">
              {t("footerNavigation.customers.faq")}
            </Link>
          </li>
          <li>
            <Link href="/support#dostavka">
              {t("footerNavigation.customers.delivery")}
            </Link>
          </li>
          <li>
            <Link href="/support#oplata">
              {t("footerNavigation.customers.payment")}
            </Link>
          </li>
          <li>
            <Link href="/support#obmin-ta-povernennya">
              {t("footerNavigation.customers.returns")}
            </Link>
          </li>
          <li>
            {/* <Link href="/bilobrov-club">
              {t("footerNavigation.customers.bonusProgram")}
            </Link> */}
          </li>
        </ul>
      </div>

      <div className={s.block}>
        <h3>{t("footerNavigation.company.title")}</h3>

        <ul>
          {/* <li>
            <Link href="/about">{t("footerNavigation.company.about")}</Link>
          </li> */}
          <li>
            {/* <Link to="/blog">{t("footerNavigation.company.blog")}</Link> */}
          </li>
          {/* <li>
            <Link href="/account">{t("footerNavigation.company.account")}</Link>
          </li> */}
          <li>
            <Link href="/support#contacts">
              {t("footerNavigation.company.contacts")}
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};
