import { SneckbarContext } from "alex-evo-sh-ui-kit";
import { useCallback, useContext, useEffect } from "react";

export const useError = ({ isError, error }: { isError: boolean; error: unknown }) => {

    const {showSnackbar} = useContext(SneckbarContext)

    const message = useCallback((text: string) => {
        showSnackbar(text, {delay: 3000, backgroundColor: "var(--Error-color)", color: "var(--On-error-color)"})
    },[showSnackbar])

    useEffect(() => {
        if (isError) {
            if (error && typeof error === 'object' && 'message' in error)
                message(String(error.message))
            if (
                error &&
                typeof error === 'object' &&
                'data' in error &&
                error.data &&
                typeof error.data === 'object' &&
                'message' in error.data
            )
                message(String(error.data.message))
            else message(JSON.stringify(error))
        }
    }, [isError, error, message]);

    return message
};
