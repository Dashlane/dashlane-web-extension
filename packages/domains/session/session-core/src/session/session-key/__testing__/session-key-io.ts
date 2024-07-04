import { FlexibleDecryptor, FlexibleEncryptor, FlexibleSignatureVerifier, NullCryptographyInfrastructure, } from '@dashlane/framework-dashlane-application';
import { SessionKeyDecryptor, SessionKeyEncryptor } from '..';
import { DerivationCacheService } from '@dashlane/framework-services';
import { SessionKeyVerifier } from '../session-key-verifier';
export const NullSessionKeyEncryptor = new SessionKeyEncryptor(new FlexibleEncryptor(NullCryptographyInfrastructure, new DerivationCacheService()));
export const NullSessionKeyDecryptor = new SessionKeyDecryptor(new FlexibleDecryptor(NullCryptographyInfrastructure, new DerivationCacheService()));
export const NullSessionKeyVerifier = new SessionKeyVerifier(new FlexibleSignatureVerifier(NullCryptographyInfrastructure, new DerivationCacheService()));
