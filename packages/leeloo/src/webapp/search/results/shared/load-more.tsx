import { Button } from "@dashlane/design-system";
import useTranslate from "../../../../libs/i18n/useTranslate";
const I18N_KEYS = {
  SEE_MORE: "webapp_sidemenu_search_results_see_more",
};
interface LoadMoreProps {
  loadMore: () => void;
  remaining: number;
}
export const LoadMore = ({ loadMore, remaining }: LoadMoreProps) => {
  const { translate } = useTranslate();
  return remaining ? (
    <Button
      onClick={loadMore}
      mood="neutral"
      intensity="quiet"
      size="small"
      fullsize
      sx={{ marginTop: "16px" }}
    >
      {translate(I18N_KEYS.SEE_MORE, {
        count: remaining,
      })}
    </Button>
  ) : null;
};
