/**
 * Adds CORS headers to the response.
 */
function cors(res) {
    res.headers = {
        'Access-Control-Allow-Headers': 'Auth',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        ...res.headers
    };
    return res;
}

/**
 * @callback preprocessor
 * @param  {...any} requestArgs
 * @returns {object | undefined}
 */

/**
 * @callback postprocessor
 * @param  {object} response
 * @param  {...any} requestArgs
 * @returns {object}
 */

/**
 * Applies the given preprocessors and postprocessors to the given functions inputs and outputs.
 *
 * - Preprocessors will receive all of the arguments the wrapped function would receive, but should not mutate the
 *   arguments. Preprocessors can return a response object that will be returned to the client immediately (in which
 *   case the wrapped function and any middleware following it will not be called).
 *
 * - Postprocessors will also receive the wrapped function's arguments (which they should not modify) as well as the
 *   response returned from the wrapped function (which they are free to modify). Postprocessors must return a response.
 *
 * @param {Function} func
 * @param {preprocessor[]} pre Functions to run on the the given function's inputs before it's called.
 * @param {postprocessor[]} post Functions to run on the given function's output(s) before it's returned.
 * @returns The wrapped function with middleware applied.
 */
function withMiddleWare(func, pre = [], post = []) {
    return async function () {
        for (let processor of pre) {
            let response = await processor.apply(this, arguments);
            if (response) {
                return response;
            }
        }

        let res = await func.apply(this, arguments);

        for (let processor of post) {
            await processor.apply(this, [res, ...arguments]);
        }

        return res;
    };
}

module.exports = {
    cors,
    withMiddleWare
}