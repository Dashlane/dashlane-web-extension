import { Flex } from "@dashlane/design-system";
import { colors, Link, LoadingIcon, Paragraph } from "@dashlane/ui-components";
import { useEffect, useState } from "react";
const { midGreen00 } = colors;
interface License {
  licenses: string;
  version: string;
  name: string;
}
const LICENSE_PATH = `${PUBLIC_PATH}assets/licenses.json`;
const DASHLANE_LICENSE_NAME = "Dashlane";
const omitDashlane = (deps: License[]) =>
  deps.filter(({ licenses }) => licenses !== DASHLANE_LICENSE_NAME);
export const Dependencies = () => {
  const [deps, setDeps] = useState<License[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    fetch(LICENSE_PATH)
      .then(async (response) => {
        const deps: License[] = await response.json();
        setDeps(omitDashlane(deps));
      })
      .catch(() => {
        setError("There was an error loading dependencies.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  return (
    <Flex
      flexDirection="column"
      alignItems="center"
      sx={{
        m: "50px auto",
        p: "20px",
        maxWidth: "550px",
        bg: "neutrals.3",
      }}
    >
      {loading ? (
        <LoadingIcon
          color={midGreen00}
          size="75px"
          sx={{ margin: "0 50%", position: "relative", left: "-37px" }}
        />
      ) : null}
      {!loading && error ? (
        <Paragraph color="errors.5">{error}</Paragraph>
      ) : null}
      {!loading && !error ? (
        <div>
          <Paragraph>
            3rd party packages used in this software along with their licenses:
          </Paragraph>
          <ul>
            {deps.map(({ name, licenses, version }) => (
              <Paragraph as="li" key={name + version} size="small">
                <Link href={"__REDACTED__" + name}>{name}</Link>@{version}:{" "}
                {licenses}
              </Paragraph>
            ))}
          </ul>
        </div>
      ) : null}
    </Flex>
  );
};
