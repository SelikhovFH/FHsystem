import {message} from "antd";

export const useRequestMessages = (messageKey: string) => {
    const [messageApi, contextHolder] = message.useMessage();
    const onLoad = () => {
        messageApi.open({
            key: messageKey,
            type: 'loading',
            content: 'Loading...',
        })
    }
    const onSuccess = () => {
        messageApi.open({
            key: messageKey,
            type: 'success',
            content: 'Loaded!',
            duration: 2,
        });
    }
    const onError = () => {
        messageApi.open({
            key: messageKey,
            type: 'error',
            content: 'Error!',
            duration: 2,
        });
    }
    return {
        contextHolder,
        onLoad,
        onSuccess,
        onError
    }
}
