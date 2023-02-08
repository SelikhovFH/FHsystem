import { Form } from "antd";
import { useRequestMessages } from "../hooks/useRequestMessages";
import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQuery } from "react-query";
import { API, getRequestConfig } from "./api";
import { queryClient } from "./queryClient";
import { AxiosError } from "axios";

type Mutation = {
  path?: string
  fetcher?: (requestConfig: {}) => void
  onSuccess?: () => void
}

type ConstructorProps<Response> = {
  basePath: string
  get?: {
    queryKeys?: any[]
    path?: string
    fetcher?: (requestConfig: {}) => Promise<Response>
  }
  add?: Mutation
  edit?: Mutation
  remove?: Mutation
}


export const useApiFactory = <Response = {}, Variables = {}>({
                                                               basePath,
                                                               get,
                                                               add,
                                                               remove,
                                                               edit
                                                             }: ConstructorProps<Response>) => {
  const [form] = Form.useForm();
  const requestMessages = useRequestMessages(basePath);
  const { getAccessTokenSilently } = useAuth0();

  const data = useQuery<Response, AxiosError>(get?.queryKeys ?? basePath, async () => {
    const token = await getAccessTokenSilently();
    const requestConfig = getRequestConfig(token);
    if (get?.fetcher) {
      return get.fetcher(requestConfig);
    }
    const res = await API.get(get?.path ?? basePath, requestConfig);
    return res.data.data;
  });

  const addMutation = useMutation<any, AxiosError, Variables>(async (data) => {
    const token = await getAccessTokenSilently();
    const requestConfig = getRequestConfig(token);
    requestMessages.onLoad();
    if (add?.fetcher) {
      return add.fetcher(requestConfig);
    }
    const res = await API.post(add?.path ?? basePath, data, getRequestConfig(token));
    return res.data.data;
  }, {
    onSuccess: async () => {
      requestMessages.onSuccess();
      form.resetFields();
      await queryClient.invalidateQueries({ queryKey: [basePath] });
      if (add?.onSuccess) {
        add.onSuccess();
      }
    },
    onError: async () => {
      requestMessages.onError();
    }
  });

  const editMutation = useMutation<any, AxiosError, Variables>(async (data) => {
    const token = await getAccessTokenSilently();
    const requestConfig = getRequestConfig(token);
    requestMessages.onLoad();
    if (edit?.fetcher) {
      return edit.fetcher(requestConfig);
    }
    const res = await API.patch(edit?.path ?? basePath, data, getRequestConfig(token));
    return res.data.data;
  }, {
    onSuccess: async () => {
      requestMessages.onSuccess();
      form.resetFields();
      await queryClient.invalidateQueries({ queryKey: [basePath] });
      if (edit?.onSuccess) {
        edit.onSuccess();
      }
    },
    onError: async () => {
      requestMessages.onError();
    }
  });

  const deleteMutation = useMutation<any, AxiosError, string>(async (id) => {
    const token = await getAccessTokenSilently();
    const requestConfig = getRequestConfig(token);
    requestMessages.onLoad();
    if (remove?.fetcher) {
      return remove.fetcher(requestConfig);
    }
    const res = await API.delete(`${remove?.path ?? basePath}/${id}`, getRequestConfig(token));
    return res.data.data;
  }, {
    onSuccess: async () => {
      requestMessages.onSuccess();
      await queryClient.invalidateQueries({ queryKey: [basePath] });
      if (remove?.onSuccess) {
        remove.onSuccess();
      }
    },
    onError: async () => {
      requestMessages.onError();
    }
  });


  return {
    form,
    data,
    addMutation,
    editMutation,
    deleteMutation,
    messageContext: requestMessages.contextHolder
  };
};

