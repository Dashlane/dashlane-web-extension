export default function okResponse(): Promise<any> {
    return new Promise((resolve) => {
        setTimeout(() => resolve({
            code: 200,
        }), 500);
    });
}
