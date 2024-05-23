import { DropdownElement, jsx, Tooltip } from '@dashlane/ui-components';
const TOOLTIP_MAX_WIDTH = 162;
interface DisabledTooltipDropdownElementProps {
    dropdownLabel: string;
    tooltipTitle: string;
}
export const DisabledDropdownElement = ({ dropdownLabel, tooltipTitle, }: DisabledTooltipDropdownElementProps) => {
    return (<div aria-label={tooltipTitle} aria-disabled onClick={(e) => {
            e.stopPropagation();
        }}>
      <Tooltip placement="top" content={tooltipTitle} sx={{ maxWidth: `${TOOLTIP_MAX_WIDTH}px` }} portalTarget={document.body}>
        <span tabIndex={-1}>
          <DropdownElement disabled fullWidth>
            {dropdownLabel}
          </DropdownElement>
        </span>
      </Tooltip>
    </div>);
};
