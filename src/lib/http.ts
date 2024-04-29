import Axios, { AxiosError } from 'axios'
import { ZodType } from 'zod'

type Params = Record<string, string | number | boolean>

const axios = Axios.create({
    withCredentials: false,
})

const http = {
    get<T>(
        endpoint: string,
        params: Params = {},
        schema?: ZodType<T>
    ): Promise<T> {
        return ajax(endpoint, 'GET', null, params, schema)
    },
    post<T>(
        endpoint: string,
        data: unknown = null,
        params: Params = {},
        schema?: ZodType<T>
    ): Promise<T> {
        return ajax(endpoint, 'POST', data, params, schema)
    },
    put<T>(
        endpoint: string,
        data: unknown = null,
        params: Params = {},
        schema?: ZodType<T>
    ): Promise<T> {
        return ajax(endpoint, 'PUT', data, params, schema)
    },
    delete<T>(
        endpoint: string,
        data: unknown = null,
        params: Params = {},
        schema?: ZodType<T>
    ): Promise<T> {
        return ajax(endpoint, 'DELETE', data, params, schema)
    },
}

async function handleError(error: unknown): Promise<boolean> {
    if (Axios.isAxiosError(error)) {
        const axiosError = error as AxiosError
    }
    return false
}

function parseResponse<T>(schema: ZodType<T>, res: T) {
    return schema.parse(res)
}

async function ajax<T>(
    endpoint: string,
    method = 'GET',
    data: unknown = null,
    params: Params = {},
    schema?: ZodType<T>
): Promise<T> {
    try {
        const res = await axios({
            url: endpoint,
            method,
            data,
            params,
        })

        return schema ? parseResponse<T>(schema, res.data) : res.data
    } catch (err: unknown) {
        const isHandleError = await handleError(err)
        if (!isHandleError) throw err
        return null as unknown as T
    }
}

export default http
