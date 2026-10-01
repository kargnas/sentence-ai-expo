/** Keep blank input out of the request, loading, and persistence paths. */
export async function runAnalysisRequest<T>(
    text: unknown,
    request: (text: string) => Promise<T>,
    onEmpty: () => void,
): Promise<T | undefined> {
    const query = typeof text === 'string' ? text.trim() : '';
    if (!query) {
        onEmpty();
        return;
    }

    return request(query);
}

/** Only map known public errors; never display arbitrary server/provider details. */
export function getAnalysisErrorKey(error: unknown): string {
    if (typeof error === 'object' && error !== null) {
        const response = 'response' in error ? error.response : undefined;
        if (typeof response === 'object' && response !== null) {
            const data = 'data' in response ? response.data : undefined;
            if ('status' in response && response.status === 400 &&
                typeof data === 'object' && data !== null &&
                'message' in data && data.message === 'No text provided') {
                return 'analysis_error_empty';
            }
        }

        if ('code' in error && error.code === 'ERR_NETWORK') {
            return 'analysis_error_network';
        }
    }

    return 'analysis_error_failed';
}
