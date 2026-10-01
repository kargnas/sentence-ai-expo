import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import {getAnalysisErrorKey, runAnalysisRequest} from '../app/utils/analysisRequest.ts';

for (const text of ['', '   ', '\n\t\r', '\u3000\u00a0', null, undefined, {nativeEvent: {text: '你好'}}]) {
    test(`invalid input never enters the API/loading/persistence handler: ${JSON.stringify(text)}`, async () => {
        let calls = 0;
        let emptyMessages = 0;
        const result = await runAnalysisRequest(text, async () => { calls++; }, () => { emptyMessages++; });
        assert.equal(calls, 0);
        assert.equal(emptyMessages, 1);
        assert.equal(result, undefined);
    });
}

for (const text of ['你好', '  我可以得到一杯冰美式咖啡吗\n', '\u3000hello world\u00a0']) {
    test(`valid input is trimmed and dispatched exactly once: ${JSON.stringify(text)}`, async () => {
        const calls = [];
        const response = {sentences: [{sentence: text.trim()}]};
        const result = await runAnalysisRequest(text, async (query) => {
            calls.push(query);
            return response;
        }, () => assert.fail('A valid query must not show the empty-input message'));
        assert.deepEqual(calls, [text.trim()]);
        assert.equal(result, response);
    });
}

test('an empty attempt does not prevent the next valid request', async () => {
    let calls = 0;
    const request = async () => { calls++; };
    await runAnalysisRequest(' ', request, () => {});
    await runAnalysisRequest('你好', request, () => {});
    assert.equal(calls, 1);
});

test('request failures remain available to the screen error handler', async () => {
    const failure = new Error('request failure');
    await assert.rejects(runAnalysisRequest('你好', async () => { throw failure; }, () => {}), failure);
});

test('known server validation errors become the localized empty-input hint', () => {
    assert.equal(getAnalysisErrorKey({response: {status: 400, data: {message: 'No text provided'}}}), 'analysis_error_empty');
});

test('network failures have a useful connection hint', () => {
    assert.equal(getAnalysisErrorKey({code: 'ERR_NETWORK'}), 'analysis_error_network');
});

for (const error of [
    {response: {status: 400, data: {message: 'private upstream details'}}},
    {response: {status: 500, data: {message: 'No text provided'}}},
    {response: {status: 500, data: '<html>private error page</html>'}},
    {message: 'Request failed with status code 400'},
    null,
    'arbitrary failure',
]) {
    test(`unknown errors use a safe fallback: ${JSON.stringify(error)}`, () => {
        assert.equal(getAnalysisErrorKey(error), 'analysis_error_failed');
    });
}

test('all supported locales provide the error strings', () => {
    for (const locale of ['en', 'ko', 'ja', 'zh_cn', 'zh_tw']) {
        const messages = JSON.parse(readFileSync(new URL(`../assets/locales/${locale}.json`, import.meta.url), 'utf8'));
        for (const key of ['analysis_error_empty', 'analysis_error_failed', 'analysis_error_network']) {
            assert.equal(typeof messages[key], 'string');
            assert.ok(messages[key].length > 0);
        }
    }
});
