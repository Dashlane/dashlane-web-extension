import { Button, Flex, Paragraph, TextInput } from "@dashlane/design-system";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { Chip } from "../../../change-plan/components/chip";
const I18N_KEYS = {
  ENTER_PROMO_CODE:
    "team_account_teamplan_changeplan_order_summary_promo_code_cta",
  PROMO_CODE: "team_account_teamplan_changeplan_order_summary_promo_code",
  PROMO_CODE_ERROR:
    "team_account_teamplan_changeplan_order_summary_promo_code_error",
};
interface PromoCodeProps {
  currency: string;
  hasError?: boolean;
  isLoading?: boolean;
  onCancel?: () => void;
  onChange?: (value: string) => void;
  onClear?: () => void;
  onSubmit?: () => boolean;
  promoCode?: string;
  promoPrice: number;
  setShowInput?: (targetState: boolean) => void;
  showInput?: boolean;
}
export const PromoCode = ({
  currency,
  hasError,
  isLoading,
  onCancel,
  onChange,
  onClear,
  onSubmit,
  promoCode,
  promoPrice,
  setShowInput,
  showInput,
}: PromoCodeProps) => {
  const { translate } = useTranslate();
  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit();
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
          data-testid="promo-code-input"
          value={promoCode}
          placeholder={translate(I18N_KEYS.ENTER_PROMO_CODE)}
          feedback={
            hasError
              ? {
                  id: "promo-error-message",
                  text: translate(I18N_KEYS.PROMO_CODE_ERROR),
                  type: "error",
                }
              : undefined
          }
          onChange={
            onChange ? (evt) => onChange(evt?.target?.value) : undefined
          }
        />
      </div>
      <div sx={{ paddingTop: "3px" }}>
        <Button
          disabled={isLoading}
          data-testid="promo-code-submit"
          type="button"
          intensity="supershy"
          onClick={handleSubmit}
          isLoading={isLoading}
          layout="iconOnly"
          icon="CheckmarkOutlined"
          sx={{
            border: "1px solid ds.container.expressive.brand.quiet.hover",
          }}
        />
        <Button
          layout="iconOnly"
          icon="ActionCloseOutlined"
          type="button"
          intensity="supershy"
          onClick={handleCancel}
          sx={{ marginLeft: "6px" }}
        />
      </div>
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
        <Paragraph
          textStyle="ds.body.standard.strong"
          color="ds.text.neutral.catchy"
        >
          {translate(I18N_KEYS.PROMO_CODE)}
        </Paragraph>
        <Chip
          value={promoCode}
          onDismiss={onClear}
          buttonProps={{ "data-testid": "promo-code-clear" }}
        />
      </Flex>
      <div>
        <Paragraph
          textStyle="ds.body.standard.regular"
          color="ds.text.neutral.standard"
        >
          {translate.price(currency, -(promoPrice / 100))}
        </Paragraph>
      </div>
    </Flex>
  ) : (
    <Flex sx={{ padding: "0 10px" }}>
      <Button
        type="button"
        intensity="supershy"
        onClick={() => (setShowInput ? setShowInput(true) : null)}
        sx={{
          margin: 0,
          padding: 0,
          minWidth: 0,
          height: "16px",
          textDecoration: "underline",
        }}
        aria-label={translate(I18N_KEYS.ENTER_PROMO_CODE)}
      >
        <Paragraph color="ds.text.brand.standard">
          {translate(I18N_KEYS.ENTER_PROMO_CODE)}
        </Paragraph>
      </Button>
    </Flex>
  );
};
