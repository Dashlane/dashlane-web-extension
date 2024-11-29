import {
  Button,
  CheckIcon,
  CloseIcon,
  colors,
  Link,
  Paragraph,
  TextInput,
} from "@dashlane/ui-components";
import { Flex, IndeterminateLoader } from "@dashlane/design-system";
import { Chip } from "../../components/chip";
import useTranslate from "../../../../libs/i18n/useTranslate";
interface PromoCodeProps {
  currency?: string;
  promoPrice?: number | null;
  promoCode?: string;
  hasError?: boolean;
  isLoading?: boolean;
  showInput?: boolean;
  setShowInput?: (targetState: boolean) => void;
  onSubmit?: () => boolean;
  onCancel?: () => void;
  onChange?: (value: string) => void;
  onClear?: () => void;
}
export const getDisplayPromoPrice = (promoPrice: number) =>
  promoPrice ? -(promoPrice / 100) : 0;
export const PromoCode = ({
  currency,
  promoPrice,
  promoCode,
  hasError,
  isLoading,
  showInput,
  setShowInput,
  onSubmit,
  onCancel,
  onChange,
  onClear,
}: PromoCodeProps) => {
  const { translate } = useTranslate();
  const handleSubmit = async () => {
    if (onSubmit) {
      await onSubmit();
    }
  };
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };
  return showInput ? (
    <Flex gap="6px" fullWidth sx={{ padding: "0 10px" }}>
      <div sx={{ flex: 1 }}>
        <TextInput
          fullWidth
          value={promoCode}
          placeholder={translate(
            "team_account_teamplan_changeplan_order_summary_promo_code_cta"
          )}
          feedbackText={
            hasError
              ? translate(
                  "team_account_teamplan_changeplan_order_summary_promo_code_error"
                )
              : null
          }
          feedbackType={hasError ? "error" : undefined}
          onChange={
            onChange ? (evt) => onChange(evt?.target?.value) : undefined
          }
        />
      </div>
      <Button
        disabled={isLoading}
        data-testid="promo_code_button_submit"
        type="button"
        nature="secondary"
        onClick={handleSubmit}
      >
        {isLoading ? (
          <IndeterminateLoader size={20} mood="neutral" />
        ) : (
          <CheckIcon size={20} />
        )}
      </Button>
      <Button
        data-testid="promo_code_button_cancel"
        type="button"
        nature="ghost"
        onClick={handleCancel}
      >
        <CloseIcon size={20} />
      </Button>
    </Flex>
  ) : promoCode ? (
    <Flex
      gap="4px"
      fullWidth
      alignItems="center"
      justifyContent="space-between"
      sx={{ padding: "0 10px" }}
    >
      <Flex alignItems="center" gap="4px">
        <Paragraph size="small" color={colors.black}>
          {translate(
            "team_account_teamplan_changeplan_order_summary_promo_code"
          )}
        </Paragraph>
        <Chip
          value={promoCode}
          onDismiss={onClear}
          buttonProps={{ "data-testid": "promo_code_button_clear" }}
        />
      </Flex>
      <div>
        {promoPrice && currency ? (
          <Paragraph size="small" color={colors.black}>
            {translate.price(currency, getDisplayPromoPrice(promoPrice))}
          </Paragraph>
        ) : null}
      </div>
    </Flex>
  ) : (
    <Flex sx={{ padding: "0 10px" }}>
      <Button
        data-testid="promo_code_button_enter"
        size="medium"
        type="button"
        nature="ghost"
        onClick={() => (setShowInput ? setShowInput(true) : null)}
        sx={{ margin: 0, padding: 0, minWidth: 0, height: "16px" }}
        aria-label={translate(
          "team_account_teamplan_changeplan_order_summary_promo_code_cta"
        )}
      >
        <Link>
          <Paragraph size="small" color={colors.midGreen00}>
            {translate(
              "team_account_teamplan_changeplan_order_summary_promo_code_cta"
            )}
          </Paragraph>
        </Link>
      </Button>
    </Flex>
  );
};
