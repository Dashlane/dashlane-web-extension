import { getCredentialsExport } from "./get-credentials-export";
import { getSecureNotesExport } from "./get-secure-notes-export";
import { getPaymentsExport } from "./get-payments-export";
import { getIdsExport } from "./get-ids-export";
import { getPersonalInfoExport } from "./get-personal-info-export";
import { PersonalDataVaultItems } from "DataManagement/types";
const dataGenerators = [
  { filename: "credentials", generator: getCredentialsExport },
  { filename: "personalInfo", generator: getPersonalInfoExport },
  { filename: "securenotes", generator: getSecureNotesExport },
  { filename: "payments", generator: getPaymentsExport },
  { filename: "ids", generator: getIdsExport },
];
const getBase64FromBlob = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const base64data = reader.result;
      if (!base64data) {
        reject(new Error("Error creating CSV export."));
      } else {
        resolve(base64data.toString());
      }
    };
  });
export async function getCSVExport(
  personalData: PersonalDataVaultItems
): Promise<string> {
  const zip = await import("@zip.js/zip.js");
  zip.configure({
    useWebWorkers: false,
  });
  const zipWriter = new zip.ZipWriter(new zip.BlobWriter("application/zip"));
  const promises: Promise<Awaited<ReturnType<(typeof zipWriter)["add"]>>>[] =
    [];
  for (const { filename, generator } of dataGenerators) {
    const csvData = generator(personalData);
    promises.push(
      zipWriter.add(
        `${filename}.csv`,
        new zip.BlobReader(new Blob([csvData], { type: "text/csv" }))
      )
    );
  }
  await Promise.all(promises);
  const csvBlob = await zipWriter.close();
  return await getBase64FromBlob(csvBlob);
}
