import s from "./ProductItem.module.css";
import { ProductInfo } from "../../types/productTypes";
import { StarRating } from "../StarRating/StarRating";
import WishlistButton from "../WishlistButton/WishlistButton";
import { useWindowSize } from "../../hooks/useWindowSize";
import Link from "next/link";
import { useProductStore } from "@/store/products/useProductStore";
import Image from "next/image";
import type { ProductStore } from "@/store/products/useProductStore";

interface ProductItemProps {
  info: ProductInfo;
  certificate?: boolean;
  mini?: boolean;
}

const isNewProduct = (dateCreated: string) => {
  if (!dateCreated) return false;
  const createdDate = new Date(dateCreated);
  const today = new Date();
  const daysDiff = Math.floor(
    (today.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  return daysDiff <= 14;
};

export const ProductItem: React.FC<ProductItemProps> = ({
  info,
  certificate,
  mini,
}) => {
  const reviews = useProductStore((state: ProductStore) => state.reviews);
  const currentReviews = reviews.filter(
    (item: { product_id: number }) => item.product_id == info.id
  );
  const { width } = useWindowSize();
  const isMobile = width < 1024;
  const brandName = info.brands[0]?.name || "";
  const localAverage =
    currentReviews.length > 0
      ? currentReviews.reduce(
          (sum: number, r: { rating: number }) => sum + r.rating,
          0
        ) / currentReviews.length
      : 0;

  return (
    <>
      <li
        key={info.id}
        className={`${s.productItem} ${mini && s.miniProductItem} ${
          (info.stock_quantity ?? 0) < 1 && s.notAvailable
        } `}
      >
        <Link className={s.link} href={`/product/${info.slug}/${info.id}`} />
        <div className={s.block}>
          <div className={s.productImage}>
            <div className={s.markersBlock}>
              {info.featured && (
                <div className={s.bestMarker}>
                  <span>bilobrov&apos;S</span>
                  <span>BEST</span>
                </div>
              )}
              <div className={s.topMarker}>TOP</div>
              {isNewProduct(info.date_created) && (
                <div className={s.newMarker}>NEW</div>
              )}
              {info.sale_price &&
                info.sale_price !== "0" &&
                info.regular_price &&
                info.regular_price !== "0" && (
                  <div className={s.saleMarker}>
                    -
                    {Math.round(
                      (1 -
                        Number(info.sale_price) / Number(info.regular_price)) *
                        100
                    )}
                    %
                  </div>
                )}
            </div>
            {info.images && info.images.length > 0 && info.images[0]?.src ? (
              <Image
                src={info.images[0].src}
                alt={info.images[0]?.alt || info.name}
                width={100}
                height={100}
              />
            ) : (
              <div
                style={{
                  width: 100,
                  height: 100,
                  backgroundColor: "#f5f5f5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#999",
                }}
              >
                No Image
              </div>
            )}
            <WishlistButton productId={info.id} />
            <div className={`${s.cart}`} title="Додати в корзину">
              <svg
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.5 17H17.33C18.28 17 18.75 17 19.14 16.83C19.48 16.68 19.77 16.43 19.98 16.12C20.22 15.77 20.31 15.31 20.48 14.37L21.83 6.94C21.89 6.62 21.92 6.46 21.87 6.33C21.83 6.22 21.75 6.13 21.65 6.07C21.54 6 21.37 6 21.04 6H5M2 2H3.32C3.56 2 3.68 2 3.78 2.04C3.87 2.08 3.94 2.15 3.99 2.23C4.05 2.32 4.07 2.44 4.11 2.68L6.89 20.32C6.93 20.56 6.95 20.68 7.01 20.77C7.06 20.85 7.13 20.92 7.22 20.96C7.32 21 7.44 21 7.68 21H19"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
          {brandName && <p className={s.productBrand}>{brandName}</p>}
          {certificate && <p className={s.productBrand}>Bilobrov</p>}
          <p className={s.productName}>{info.name}</p>
          {typeof info.short_description === "string" ? (
            <p
              className={s.shortDesc}
              dangerouslySetInnerHTML={{ __html: info.short_description }}
            />
          ) : (
            <>{info.short_description}</>
          )}
          <div className={s.ratingBlock}>
            <StarRating isMobile={isMobile} rating={localAverage} />
            <span>({currentReviews.length})</span>
          </div>
        </div>
        <div>
          {info.sale_price && info.sale_price !== "0" ? (
            <>
              <span className={`${s.salePrice} ${s.red}`}>
                {info.sale_price}
              </span>
              <span className={`${s.currency} ${s.red}`}>₴</span>
              <span className={s.regularPrice}>{info.regular_price}</span>
            </>
          ) : (
            <>
              <span className={s.currency}>₴</span>
              <span className={s.salePrice}>{info.price}</span>
            </>
          )}
        </div>
      </li>
    </>
  );
};
