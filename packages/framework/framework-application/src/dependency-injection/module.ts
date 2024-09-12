import { ModuleDeclaration, ModuleDeclarationShorthand } from "./module.types";
export function isModuleDeclaration(
  declaration: ModuleDeclaration | ModuleDeclarationShorthand
): declaration is ModuleDeclaration {
  return "module" in declaration;
}
export function resolveModuleDeclarationShorthand(
  declaration: ModuleDeclaration | ModuleDeclarationShorthand
): ModuleDeclaration {
  return isModuleDeclaration(declaration)
    ? declaration
    : {
        module: declaration,
      };
}
