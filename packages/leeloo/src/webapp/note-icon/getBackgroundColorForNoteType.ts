import cssVariables from "./variables.css";
export default function (noteType: string) {
  return cssVariables[
    "--dashlane-secure-notes-icon-background-" + noteType.toLocaleLowerCase()
  ];
}
