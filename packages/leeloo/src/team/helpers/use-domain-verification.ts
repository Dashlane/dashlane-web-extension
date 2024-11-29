import { useCallback, useEffect, useState } from "react";
import { Domain, DomainStatus } from "@dashlane/communication";
import { carbonConnector } from "../../libs/carbon/connector";
export enum DomainVerificationStatus {
  Loading = "loading",
  Start = "start",
  Pending = "pending",
  Validated = "validated",
  Deactivating = "deactivating",
}
export const useDomainVerification = () => {
  const [verifiedOrPendingDomain, setVerifiedOrPendingDomain] = useState<
    | {
        domain: null;
        status:
          | DomainVerificationStatus.Loading
          | DomainVerificationStatus.Start;
      }
    | {
        domain: Domain;
        status: Omit<
          DomainVerificationStatus,
          DomainVerificationStatus.Loading | DomainVerificationStatus.Start
        >;
      }
  >({ domain: null, status: DomainVerificationStatus.Loading });
  const [verifiedDomains, setVerifiedDomains] = useState<Domain[]>([]);
  const updateDomainState = useCallback(async () => {
    try {
      const result = await carbonConnector.getTeamDomains();
      if (result.success && result.domains.length) {
        const pendingDomains = result.domains.filter(
          (domainInfo) => domainInfo.status === DomainStatus.pending
        );
        const validatedDomains = result.domains.filter(
          (domainInfo) => domainInfo.status === DomainStatus.valid
        );
        if (validatedDomains.length) {
          setVerifiedDomains(validatedDomains);
          const lastValidatedDomain = validatedDomains[0];
          setVerifiedOrPendingDomain({
            domain: lastValidatedDomain,
            status: DomainVerificationStatus.Validated,
          });
        } else if (pendingDomains.length) {
          const mostRecentPendingDomain =
            pendingDomains[pendingDomains.length - 1];
          setVerifiedOrPendingDomain({
            domain: mostRecentPendingDomain,
            status: DomainVerificationStatus.Pending,
          });
        } else {
          setVerifiedOrPendingDomain({
            domain: result.domains[result.domains.length - 1],
            status: DomainVerificationStatus.Pending,
          });
        }
      } else {
        setVerifiedOrPendingDomain({
          domain: null,
          status: DomainVerificationStatus.Start,
        });
      }
    } catch (e) {
      setVerifiedOrPendingDomain({
        domain: null,
        status: DomainVerificationStatus.Start,
      });
    }
  }, []);
  useEffect(() => {
    updateDomainState();
  }, [updateDomainState]);
  const deactivateDomain = async () => {
    if (verifiedOrPendingDomain.domain === null) {
      return;
    }
    setVerifiedOrPendingDomain((prevState) => {
      return {
        domain: prevState.domain!,
        status: DomainVerificationStatus.Deactivating,
      };
    });
    try {
      const result = await carbonConnector.deactivateTeamDomain({
        domain: verifiedOrPendingDomain.domain.name,
      });
      if (result.success) {
        setVerifiedOrPendingDomain({
          domain: null,
          status: DomainVerificationStatus.Start,
        });
      } else {
        updateDomainState();
      }
    } catch (e) {
      updateDomainState();
    }
  };
  const tryVerifyDomain = async () => {
    await carbonConnector.completeTeamDomainRegistration();
    await updateDomainState();
  };
  const selectVerifiedDomain = (domain: Domain) => {
    setVerifiedOrPendingDomain({
      domain: domain,
      status: DomainVerificationStatus.Validated,
    });
  };
  return {
    verifiedOrPendingDomain,
    verifiedDomains,
    updateDomainState,
    deactivateDomain,
    tryVerifyDomain,
    selectVerifiedDomain,
  };
};
