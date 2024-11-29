export function browserSupportsWebAuthnAuthentication(): boolean {
  return (
    window?.PublicKeyCredential !== undefined &&
    typeof window.PublicKeyCredential === "function"
  );
}
export function hasWebAuthnPlatformAuthenticator(): Promise<boolean> {
  if (!browserSupportsWebAuthnAuthentication()) {
    return Promise.resolve(false);
  }
  return PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
}
export function isRoamingCredential(): boolean {
  return false;
}
