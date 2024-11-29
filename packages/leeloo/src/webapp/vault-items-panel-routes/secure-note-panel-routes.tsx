import { lazy } from "react";
import { PanelTransitionRoute, RoutesProps } from "../../libs/router";
import { useNavigateBack, uuidRegex } from "./common";
const NoteAddPanel = lazy(() =>
  import("../secure-notes/add/secure-notes-add").then((module) => ({
    default: module.NoteAddPanel,
  }))
);
const SecureNotesEdit = lazy(() =>
  import("../secure-notes/edit/secure-notes-edit").then((module) => ({
    default: module.SecureNotesEdit,
  }))
);
export const SecureNotePanelRoutes = ({ path }: RoutesProps) => {
  const { routes, navigateBack } = useNavigateBack();
  return (
    <>
      <PanelTransitionRoute
        path={`${path}*/secure-note(s?)/add`}
        component={NoteAddPanel}
        additionalProps={{
          onClose: () => navigateBack(routes.userSecureNotes),
        }}
      />
      <PanelTransitionRoute
        path={`${path}*/secure-note(s?)/:uuid(${uuidRegex})`}
        component={SecureNotesEdit}
        additionalProps={{
          onClose: () => navigateBack(routes.userSecureNotes),
        }}
      />
    </>
  );
};
