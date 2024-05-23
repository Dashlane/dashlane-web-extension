export default function getQueryParams(queryString: string) {
    return queryString
        .substring(1)
        .split('#')[0]
        .split('&')
        .reduce((result: {}, param: string) => {
        const parts = param.split('=');
        result[parts[0]] = parts[1];
        return result;
    }, {});
}
