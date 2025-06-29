// потрібно;

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
            <span>{t("footerNavigation.customers.faq")}</span>
          </li>
          <li>
            <span>{t("footerNavigation.customers.delivery")}</span>
          </li>
          <li>
            <span>{t("footerNavigation.customers.payment")}</span>
          </li>
          <li>
            <span>{t("footerNavigation.customers.returns")}</span>
          </li>
          <li>
            <span>{t("footerNavigation.customers.bonusProgram")}</span>
          </li>
        </ul>
      </div>

      <div className={s.block}>
        <h3>{t("footerNavigation.company.title")}</h3>

        <ul>
          <li>
            <span>{t("footerNavigation.company.blog")}</span>
          </li>
          <li>
            <span>{t("footerNavigation.company.contacts")}</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
