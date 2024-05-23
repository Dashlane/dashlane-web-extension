export function browserSupportsWebAuthnAuthentication(): boolean {
    return (window?.PublicKeyCredential !== undefined &&
        typeof window.PublicKeyCredential === 'function');
}
