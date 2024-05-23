export enum ClientBypassType {
    NONE = 'NONE',
    ASK_MP = 'ASK_MP',
    WAITING_IDP_REDIRECTION = 'WAITING_IDP_REDIRECTION'
}
export type ClientBypass = {
    type: ClientBypassType.NONE;
} | {
    type: ClientBypassType.ASK_MP;
} | {
    type: ClientBypassType.WAITING_IDP_REDIRECTION;
    login?: string;
};
