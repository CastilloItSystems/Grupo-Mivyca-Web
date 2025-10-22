/**
 * Hook personalizado para manejar llamadas API con estados de carga y errores
 * Proporciona una interfaz consistente para todas las operaciones CRUD
 */

import { useState, useCallback, useEffect } from "react";
import type { ApiResponse, PaginatedResponse } from "@/services/api";

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

interface UseApiActions<T> {
  execute: (...args: any[]) => Promise<T | void>;
  reset: () => void;
  setData: (data: T | null) => void;
  setError: (error: string | null) => void;
}

interface UseApiResult<T> extends UseApiState<T>, UseApiActions<T> {}

/**
 * Hook para manejar operaciones API individuales
 */
export function useApi<T>(
  apiFunction: (...args: any[]) => Promise<ApiResponse<T>>,
  immediate: boolean = false
): UseApiResult<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
    success: false,
  });

  const execute = useCallback(
    async (...args: any[]) => {
      setState((prev) => ({
        ...prev,
        loading: true,
        error: null,
        success: false,
      }));

      try {
        const response = await apiFunction(...args);
        const data = response.data;

        setState({
          data,
          loading: false,
          error: null,
          success: true,
        });

        return data;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Error desconocido";
        setState({
          data: null,
          loading: false,
          error: errorMessage,
          success: false,
        });

        throw error;
      }
    },
    [apiFunction]
  );

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      success: false,
    });
  }, []);

  const setData = useCallback((data: T | null) => {
    setState((prev) => ({ ...prev, data }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState((prev) => ({ ...prev, error }));
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return {
    ...state,
    execute,
    reset,
    setData,
    setError,
  };
}

/**
 * Hook para manejar listas paginadas
 */
export function usePaginatedApi<T>(
  apiFunction: (...args: any[]) => Promise<PaginatedResponse<T>>,
  initialParams?: Record<string, any>
) {
  const [state, setState] = useState<{
    data: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
    loading: boolean;
    error: string | null;
    success: boolean;
  }>({
    data: [],
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    },
    loading: false,
    error: null,
    success: false,
  });

  const execute = useCallback(
    async (params?: Record<string, any>) => {
      setState((prev) => ({
        ...prev,
        loading: true,
        error: null,
        success: false,
      }));

      try {
        const mergedParams = { ...initialParams, ...params };
        const response = await apiFunction(mergedParams);

        setState({
          data: response.data,
          pagination: {
            page: response.page,
            limit: response.limit,
            total: response.total,
            totalPages: response.totalPages,
          },
          loading: false,
          error: null,
          success: true,
        });

        return response;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Error desconocido";
        setState((prev) => ({
          ...prev,
          loading: false,
          error: errorMessage,
          success: false,
        }));

        throw error;
      }
    },
    [apiFunction, initialParams]
  );

  const nextPage = useCallback(() => {
    if (state.pagination.page < state.pagination.totalPages) {
      execute({ page: state.pagination.page + 1 });
    }
  }, [execute, state.pagination.page, state.pagination.totalPages]);

  const prevPage = useCallback(() => {
    if (state.pagination.page > 1) {
      execute({ page: state.pagination.page - 1 });
    }
  }, [execute, state.pagination.page]);

  const goToPage = useCallback(
    (page: number) => {
      if (page >= 1 && page <= state.pagination.totalPages) {
        execute({ page });
      }
    },
    [execute, state.pagination.totalPages]
  );

  const changePageSize = useCallback(
    (limit: number) => {
      execute({ page: 1, limit });
    },
    [execute]
  );

  const refresh = useCallback(() => {
    execute({ page: state.pagination.page });
  }, [execute, state.pagination.page]);

  const reset = useCallback(() => {
    setState({
      data: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      },
      loading: false,
      error: null,
      success: false,
    });
  }, []);

  return {
    ...state,
    execute,
    nextPage,
    prevPage,
    goToPage,
    changePageSize,
    refresh,
    reset,
  };
}

/**
 * Hook para operaciones CRUD con optimistic updates
 */
export function useCrudApi<T extends { id: string }>(
  listFunction: (...args: any[]) => Promise<PaginatedResponse<T>>,
  createFunction: (data: any) => Promise<ApiResponse<T>>,
  updateFunction: (id: string, data: any) => Promise<ApiResponse<T>>,
  deleteFunction: (id: string) => Promise<ApiResponse<void>>
) {
  const listApi = usePaginatedApi(listFunction);
  const createApi = useApi(createFunction);
  const updateApi = useApi(updateFunction);
  const deleteApi = useApi(deleteFunction);

  const create = useCallback(
    async (data: any) => {
      try {
        const result = await createApi.execute(data);
        // Refresh the list after successful creation
        await listApi.refresh();
        return result;
      } catch (error) {
        throw error;
      }
    },
    [createApi, listApi]
  );

  const update = useCallback(
    async (id: string, data: any) => {
      try {
        const result = await updateApi.execute(id, data);

        // Refresh the list after successful update
        await listApi.refresh();

        return result;
      } catch (error) {
        throw error;
      }
    },
    [updateApi, listApi]
  );

  const remove = useCallback(
    async (id: string) => {
      try {
        await deleteApi.execute(id);

        // Refresh to get updated data and pagination
        await listApi.refresh();
      } catch (error) {
        throw error;
      }
    },
    [deleteApi, listApi]
  );

  return {
    list: listApi,
    create: {
      ...createApi,
      execute: create,
    },
    update: {
      ...updateApi,
      execute: update,
    },
    delete: {
      ...deleteApi,
      execute: remove,
    },
  };
}

/**
 * Hook para manejar múltiples operaciones API relacionadas
 */
export function useMultipleApi<T extends Record<string, any>>(
  operations: T
): {
  [K in keyof T]: T[K] extends (...args: any[]) => Promise<ApiResponse<infer R>>
    ? UseApiResult<R>
    : T[K] extends (...args: any[]) => Promise<PaginatedResponse<infer R>>
      ? ReturnType<typeof usePaginatedApi<R>>
      : never;
} {
  const results = {} as any;

  for (const [key, operation] of Object.entries(operations)) {
    // Determinar si es una operación paginada o simple
    const isPromise = typeof operation === "function";

    if (isPromise) {
      // Para simplicidad, usar useApi para todas las operaciones
      // En un caso real, podrías detectar si retorna PaginatedResponse
      results[key] = useApi(operation);
    }
  }

  return results;
}
