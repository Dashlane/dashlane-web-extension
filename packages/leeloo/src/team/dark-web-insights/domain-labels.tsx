import {
  HorizontalNavButton,
  HorizontalNavMenu,
  ThemeUIStyleObject,
} from "@dashlane/ui-components";
import { useFeatureFlip } from "@dashlane/framework-react";
import { Domain } from "@dashlane/communication";
import { FEATURE_FLIPS_WITHOUT_MODULE } from "@dashlane/framework-dashlane-application";
const navButtonStyles: ThemeUIStyleObject = {
  background: "ds.container.expressive.neutral.quiet.idle",
  color: "ds.text.neutral.standard",
  cursor: "default",
};
const DisabledHorizontalNavButton = ({ label }: { label: string }) => {
  return (
    <HorizontalNavButton
      sx={{
        ":hover": navButtonStyles,
        ":focus": navButtonStyles,
        ...navButtonStyles,
      }}
      disabled={true}
      selected={false}
      size="medium"
      label={label}
    />
  );
};
export const DomainLabels = ({
  activeDomain,
  verifiedDomains,
  selectVerifiedDomain,
}: {
  activeDomain: Domain | null;
  verifiedDomains: Domain[];
  selectVerifiedDomain: (domain: Domain) => void;
}) => {
  const hasMultiDomainFF = useFeatureFlip(
    FEATURE_FLIPS_WITHOUT_MODULE.DwiMultipleDomainsProd
  );
  const domainName = activeDomain?.name ?? "";
  const verifiedDomainCards = verifiedDomains.map((verifiedDomain) => {
    return (
      <HorizontalNavButton
        sx={navButtonStyles}
        key={verifiedDomain.name}
        onClick={() => {
          if (domainName !== verifiedDomain.name) {
            selectVerifiedDomain(verifiedDomain);
          }
        }}
        selected={domainName === verifiedDomain.name}
        size="medium"
        label={verifiedDomain.name}
      />
    );
  });
  return (
    <HorizontalNavMenu
      sx={{
        marginTop: "12px",
        padding: 0,
      }}
    >
      {hasMultiDomainFF && verifiedDomains.length > 1 ? (
        verifiedDomainCards
      ) : domainName !== "" ? (
        <DisabledHorizontalNavButton label={domainName} />
      ) : null}
    </HorizontalNavMenu>
  );
};
