import React from "react";
import { DataStatus } from "@dashlane/framework-react";
import { NoteAddPanelComponent } from "./secure-notes-add-component";
import { useSpaces } from "../../../libs/carbon/hooks/useSpaces";
export const NoteAddPanel = () => {
  const activeSpacesResult = useSpaces();
  if (activeSpacesResult.status !== DataStatus.Success) {
    return null;
  }
  return <NoteAddPanelComponent activeSpaces={activeSpacesResult.data} />;
};
