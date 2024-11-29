import LoadingSpinner from "../../../libs/dashlane-style/loading-spinner";
interface ComputedPriceProps {
  isComputing: boolean;
  className: string;
  price: string;
}
export const ComputedPrice = ({
  isComputing,
  className,
  price,
}: ComputedPriceProps) => {
  const content = isComputing ? (
    <LoadingSpinner
      size={16}
      containerStyle={{ display: "inline-block", position: "relative" }}
    />
  ) : (
    price
  );
  return <span className={className}>{content}</span>;
};
